import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password.");
      return;
    }

    setError(" ");
    // Login API Call From Backend

    try {
      const response = await axiosInstance.post("users/login", {
        email: email,
        password: password,
      });
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard  ");
      }
    } catch (error) {
      // Handle login error

      if (
        error.response &&
        error.response.data.message &&
        error.response.data
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again. ");
      }
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center mt-28">
        <div className=" w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7">Login</h4>

            <input
              className="input-box"
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-xs pb-1">{error} </p>}

            <button className="btn btn-primary" type="submit">
              Login
            </button>

            <p className="text-sm text-center mt-4 ">
              Not Registered yet?{" "}
              <Link to="/signup" className="font-medium text-primary underline">
                Create an Account.
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
