"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis/urls";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [showPassword, setShowPassword] = useState(false);
  const { postQuery } = usePostQuery();
  const router = useRouter();
  const { login } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    // Simulate login API call
    const loginUrl =
      role === "customer" ? apiUrls.customerLogin : apiUrls.driverLogin;
    await postQuery({
      url: loginUrl,
      postData: { email, password },
      onSuccess: (data) => {
        toast.success("Login successful!");
        login(data.token);
        router.push("/");
        //window.location.reload();

        //console.log(data, "login-success");
      },
      onFail: (error) => {
        toast.error("Login failed. Please try again.");
        //console.log(error, "login-fail");
      },
    });

    // setEmail("");
    // setPassword("");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Login Form */}
      <motion.section
        className="pt-24 pb-16 flex items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Login to Your Account
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="role"
                className="block text-gray-700 font-semibold mb-2"
              >
                Login As
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-700"
              >
                <option value="customer">Customer</option>
                <option value="driver">Driver</option>
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-semibold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-700"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-6 relative">
              <label
                htmlFor="password"
                className="block text-gray-700 font-semibold mb-2"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-700"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
              >
                Login
              </button>
            </motion.div>
          </form>
          <p className="text-center text-gray-600 mt-4">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Ambulance Tracker</h3>
              <p className="text-gray-400">
                Connecting you to emergency services, anytime, anywhere.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/services"
                    className="text-gray-400 hover:text-white transition duration-300"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-white transition duration-300"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-white transition duration-300"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p className="text-gray-400">
                Email: support@ambulancetracker.com
                <br />
                Phone: +1-800-123-4567
              </p>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400">
            © 2025 Ambulance Tracker. All rights reserved.
          </div>
        </div>
      </footer>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
