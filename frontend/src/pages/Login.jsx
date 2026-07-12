import React, { useState } from "react";
import { IoMdEyeOff } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CTAButton from "../components/CTAButton";
import { Login as loginAction } from "../services/authAPI";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return;
    }
    dispatch(loginAction(formData.email, formData.password, navigate));
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 flex flex-col md:flex-row text-gray-200">
      {/* Left Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-slate-800">
        <div className="max-w-md text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500 mb-6">
            Welcome Back
          </h2>
          <p className="text-lg text-slate-400 mb-2 font-medium">
            Connect with friends, colleagues, and family instantly.
          </p>
          <p className="text-sm text-slate-500">
            Log in to access your secure chat workspace and resume your ongoing conversations.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <form
          onSubmit={handleSubmit}
          className="glass p-8 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in"
        >
          <h3 className="text-2xl font-bold text-center mb-8 text-amber-300">
            Sign In
          </h3>

          <div className="mb-5">
            <label htmlFor="email" className="block text-slate-300 mb-2 text-sm font-medium">
              Email Address
            </label>
            <input
              value={formData.email}
              onChange={handleChange}
              name="email"
              type="email"
              id="email"
              required
              placeholder="you@example.com"
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
            />
          </div>

          <div className="mb-8 relative">
            <label htmlFor="pw" className="block text-slate-300 mb-2 text-sm font-medium">
              Password
            </label>
            <input
              value={formData.password}
              onChange={handleChange}
              name="password"
              type={showPassword ? "text" : "password"}
              id="pw"
              required
              placeholder="••••••••"
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition pr-12"
            />
            <button
              type="button"
              tabIndex="-1"
              className="absolute top-[38px] right-3 text-slate-400 hover:text-white transition focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <IoMdEyeOff className="h-6 w-6" />
              ) : (
                <FaEye className="h-6 w-6" />
              )}
            </button>
          </div>

          <CTAButton text={loading ? "Authenticating..." : "Login"} disabled={loading} />

          <div className="flex justify-center items-center mt-6">
            <p className="text-slate-400 text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-amber-400 hover:text-amber-300 hover:underline transition font-semibold"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
