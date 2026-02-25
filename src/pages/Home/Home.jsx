import React, { useEffect, useState } from "react";
import moment from "moment";
import Navbar from "../../components/Navbar/Navbar";
import NotesCard from "../../components/cards/NotesCard";
import { MdAdd, MdFilterList } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMeassage/Toast";
import EmptyCard from "../../components/cards/EmptyCard";
import AddNotesImg from "../../assets/image/add-note.png";
import NoDataImg from "../../assets/image/no-data.png";

const PRIORITY_OPTIONS = [
  { value: "", label: "All Priorities" },
  { value: "low", label: "🟢 Low" },
  { value: "medium", label: "🟡 Medium" },
  { value: "high", label: "🟠 High" },
  { value: "urgent", label: "🔴 Urgent" },
];

const CATEGORY_OPTIONS = [
  { value: "", label: "All Categories" },
  { value: "personal", label: "Personal" },
  { value: "work", label: "Work" },
  { value: "ideas", label: "Ideas" },
  { value: "tasks", label: "Tasks" },
  { value: "other", label: "Other" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "todo", label: "Todo" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

const SORT_OPTIONS = [
  { value: "", label: "Newest First" },
  { value: "priority", label: "Priority" },
  { value: "dueDate", label: "Due Date" },
  { value: "title", label: "Title A-Z" },
];

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [filterPriority, setFilterPriority] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("");

  const [showToastMeassage, setShowToastMessage] = useState({
    message: "",
    isShown: false,
    type: "add",
  });
  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/users/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllNotes = async () => {
    try {
      const hasFilters = filterPriority || filterCategory || filterStatus || sortBy;
      const endpoint = hasFilters ? "/notes/filter-notes" : "/notes/get-all-notes";
      const params = {};
      if (filterPriority) params.priority = filterPriority;
      if (filterCategory) params.category = filterCategory;
      if (filterStatus) params.status = filterStatus;
      if (sortBy) params.sort = sortBy;

      const response = await axiosInstance.get(endpoint, { params });
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const getNoteStats = async () => {
    try {
      const response = await axiosInstance.get("/notes/note-stats");
      if (response.data && response.data.stats) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.log("Stats error:", error);
    }
  };

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const showToastMsg = (message, type) => {
    setShowToastMessage({ isShown: true, message, type });
  };

  const handleCloseToast = () => {
    setShowToastMessage({ isShown: false, message: "" });
  };

  const deleteNote = async (data) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      const response = await axiosInstance.delete(`/notes/delete-note/${data._id}`);
      if (response.data && !response.data.error) {
        showToastMsg("Note Deleted Successfully.", "delete");
        getAllNotes();
        getNoteStats();
      }
    } catch (error) {
      console.error("Error deleting note:", error);
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
      console.log("Search error:", error);
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  const updateIsPinned = async (noteData) => {
    try {
      const response = await axiosInstance.patch(
        `/notes/update-note-pinned/${noteData._id}`,
        { isPinned: !noteData.isPinned }
      );
      if (response.data && !response.data.error) {
        showToastMsg("Note Updated Successfully.");
        getAllNotes();
      }
    } catch (error) {
      console.log("Pin error:", error);
    }
  };

  const handleAvatarUpdate = (updatedUser) => {
    setUserInfo(updatedUser);
  };

  const refreshData = () => {
    getAllNotes();
    getNoteStats();
  };

  useEffect(() => {
    getUserInfo();
    getAllNotes();
    getNoteStats();
  }, []);

  // Re-fetch when filters change
  useEffect(() => {
    if (!isLoading) {
      getAllNotes();
    }
  }, [filterPriority, filterCategory, filterStatus, sortBy]);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNotes={onSearchNotes}
        handleClearSearch={handleClearSearch}
        onAvatarUpdate={handleAvatarUpdate}
      />

      <div className="container mx-auto px-4 pb-20">
        {/* Stats bar */}
        {stats && stats.total > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 animate-fade-in">
            <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold text-gray-800 dark:text-dark-text">{stats.total}</p>
              <p className="text-[11px] text-slate-500 dark:text-dark-muted mt-0.5">Total Notes</p>
            </div>
            <div className="bg-white dark:bg-dark-card border border-red-200 dark:border-red-900/50 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold text-red-500">{stats.byPriority.urgent}</p>
              <p className="text-[11px] text-slate-500 dark:text-dark-muted mt-0.5">Urgent</p>
            </div>
            <div className="bg-white dark:bg-dark-card border border-blue-200 dark:border-blue-900/50 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold text-blue-500">{stats.byStatus["in-progress"]}</p>
              <p className="text-[11px] text-slate-500 dark:text-dark-muted mt-0.5">In Progress</p>
            </div>
            <div className="bg-white dark:bg-dark-card border border-yellow-200 dark:border-yellow-900/50 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold text-yellow-500">{stats.dueToday}</p>
              <p className="text-[11px] text-slate-500 dark:text-dark-muted mt-0.5">Due Today</p>
            </div>
            <div className="bg-white dark:bg-dark-card border border-red-200 dark:border-red-900/50 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              <p className="text-[11px] text-slate-500 dark:text-dark-muted mt-0.5">Overdue</p>
            </div>
          </div>
        )}

        {/* Filter/Sort bar */}
        {!isLoading && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                  showFilters || filterPriority || filterCategory || filterStatus
                    ? "bg-primary text-white border-primary"
                    : "bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-slate-600 dark:text-dark-muted hover:border-primary"
                }`}
              >
                <MdFilterList className="text-lg" />
                Filter
                {(filterPriority || filterCategory || filterStatus) && (
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                )}
              </button>

              {(filterPriority || filterCategory || filterStatus) && (
                <button
                  onClick={() => {
                    setFilterPriority("");
                    setFilterCategory("");
                    setFilterStatus("");
                  }}
                  className="text-xs text-red-500 hover:text-red-600 hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-slate-600 dark:text-dark-muted outline-none focus:border-primary transition-colors"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <p className="text-xs text-slate-400 dark:text-dark-muted">
                {isSearch
                  ? `Found ${allNotes.length}`
                  : `${allNotes.length} notes`}
              </p>
            </div>
          </div>
        )}

        {/* Filter dropdowns */}
        {showFilters && (
          <div className="grid grid-cols-3 gap-3 mt-3 animate-fade-in">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-slate-700 dark:text-dark-text outline-none focus:border-primary transition-colors"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-slate-700 dark:text-dark-text outline-none focus:border-primary transition-colors"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-slate-700 dark:text-dark-text outline-none focus:border-primary transition-colors"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Notes grid */}
        {isLoading ? (
          <div className="flex items-center justify-center mt-32">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-500 dark:text-dark-muted">
                Loading your notes...
              </p>
            </div>
          </div>
        ) : allNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {allNotes.map((item) => (
              <NotesCard
                key={item?._id}
                title={item?.title}
                date={moment(item?.createdAt).format("DD MMM YYYY")}
                content={item?.content}
                tags={item?.tags}
                isPinned={item?.isPinned}
                priority={item?.priority}
                category={item?.category}
                status={item?.status}
                dueDate={item?.dueDate}
                image={item?.image}
                color={item?.color}
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
                : filterPriority || filterCategory || filterStatus
                ? `No notes match the current filters. Try adjusting them.`
                : `Start creating your first note! Click the '+' button to jot down your thoughts, ideas and reminders. Let's get started!`
            }
          />
        )}
      </div>

      {/* Floating Add Button */}
      <button
        className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-600 hover:from-blue-600 hover:to-primary shadow-lg hover:shadow-xl fixed bottom-8 right-8 transition-all duration-300 hover:scale-110 z-40"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[28px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModal({ isShown: false, type: "add", data: null })
        }
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 60,
          },
        }}
        contentLabel=""
        className="w-[90%] sm:w-[55%] lg:w-[45%] max-h-[90vh] bg-white dark:bg-dark-card rounded-2xl mx-auto mt-10 p-6 overflow-auto outline-none animate-scale-in"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={refreshData}
          showToastMsg={showToastMsg}
        />
      </Modal>

      <Toast
        isShown={showToastMeassage.isShown}
        type={showToastMeassage.type}
        message={showToastMeassage.message}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
