import React, { useEffect, useState } from "react";
import moment from "moment";
import Navbar from "../../components/Navbar/Navbar";
import NotesCard from "../../components/cards/NotesCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMeassage/Toast";
import EmptyCard from "../../components/cards/EmptyCard";
import AddNotesImg from "../../assets/image/add-note.png";
import NoDataImg from "../../assets/image/no-data.png";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [showToastMeassage, setShowToastMessage] = useState({
    message: "",
    isShown: false,
    type: "add",
  });
  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  // get the user information from backend API
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/users/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // get all notes from the API
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/notes/get-all-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected is found. Please try again later.");
    }
  };

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const showToastMsg = (message, type) => {
    setShowToastMessage({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseTOast = () => {
    setShowToastMessage({ isShown: false, message: "" });
  };

  const deleteNote = async (data) => {
    const noteId = data?._id;

    const response = await axiosInstance.delete(`/notes/delete-note/${noteId}`);

    try {
      if (response.data && !response.data.error) {
        showToastMsg("Note Deleted Successfully. ", "delete");
        getAllNotes();
      }
    } catch (error) {
      console.error("Error editing note:", error);
      setError(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  const onSearchNotes = async (query) => {
    try {
      const response = await axiosInstance.get("/notes/search-note", {
        params: { query },
      });
      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("Error on : ", error);
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  const updateIsPinned = async (noteData) => {
    const noteId = noteData?._id;

    try {
      const response = await axiosInstance.patch(
        `/notes/update-note-pinned/${noteId}`,
        { isPinned: !noteData.isPinned }
      );

      if (response.data && !response.data.error) {
        showToastMsg("Note Updated Successfully.");
        getAllNotes();
      }
    } catch (error) {
      console.log("Error on: ", error);
    }
  };

  useEffect(() => {
    getUserInfo();
    getAllNotes();
    return () => {};
  }, []);

  return (
    <>
      {userInfo && (
        <Navbar
          userInfo={userInfo}
          onSearchNotes={onSearchNotes}
          handleClearSearch={handleClearSearch}
        />
      )}

      <div className="container mx-auto">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 mt-7">
            {allNotes.map((item, index) => (
              <NotesCard
                key={item?._id}
                title={item?.title}
                date={moment(item?.createdAt).format("DD-MM-YYYY")}
                content={item?.content}
                tags={item?.tags}
                isPinned={item?.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => deleteNote(item)}
                onPinNote={() => updateIsPinned(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            imgSrc={isSearch ? NoDataImg : AddNotesImg}
            message={
              isSearch
                ? `Oops! No notes found matching your search.`
                : `Start creating your first note! Click the 'Add' button to join down your thoughts, ideas and reminders. Let's get started!`
            }
          />
        )}
      </div>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:text-blue-600 absolute bottom-10 right-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequest={() =>
          setOpenAddEditModal({ isShown: false, type: "add", data: null })
        }
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-hidden"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMsg={showToastMsg}
        />
      </Modal>
      <Toast
        isShown={showToastMeassage.isShown}
        type={showToastMeassage.type}
        message={showToastMeassage.message}
        onClose={handleCloseTOast}
      />
    </>
  );
};

export default Home;
