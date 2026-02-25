import React, { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter your name.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/users/register", {
        email: email,
        name: name,
        password: password,
      });
      if (response.data && response.data.error) {
        setError(response.data.message);
        return;
      }
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-60px)] flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-dark-bg dark:via-slate-900 dark:to-dark-bg px-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-primary bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-sm text-slate-500 dark:text-dark-muted mt-2">
              Get started with your personal notes
            </p>
          </div>

          <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl shadow-xl dark:shadow-2xl px-8 py-10">
            <form onSubmit={handleSignUp}>
              <input
                className="input-box"
                placeholder="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
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

              {/* Password strength indicator */}
              {password && (
                <div className="mb-3 animate-fade-in">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                          password.length >= level * 3
                            ? password.length >= 8
                              ? "bg-green-500"
                              : password.length >= 6
                              ? "bg-yellow-500"
                              : "bg-red-500"
                            : "bg-gray-200 dark:bg-dark-border"
                        }`}
                      />
                    ))}
                  </div>
                  <p
                    className={`text-[10px] ${
                      password.length >= 8
                        ? "text-green-500"
                        : password.length >= 6
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {password.length >= 8
                      ? "Strong password"
                      : password.length >= 6
                      ? "Fair password"
                      : `Too short (${password.length}/6)`}
                  </p>
                </div>
              )}

              {error && (
                <p className="text-red-500 text-xs pb-3 animate-fade-in">
                  {error}
                </p>
              )}

              <button
                className="btn-primary py-3 mt-2"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>

              <p className="text-sm text-center mt-6 text-slate-500 dark:text-dark-muted">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-primary hover:underline"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
