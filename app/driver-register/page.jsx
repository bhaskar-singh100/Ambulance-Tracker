"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DriverRegister() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [driverForm, setDriverForm] = useState({
    name: "",
    email: "",
    phone: "",
    licenseNumber: "",
    vehicleType: "",
    vehicleRegistration: "",
  });

  const navItems = [
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" },
    tap: { scale: 0.95 },
  };

  const handleDriverFormSubmit = (e) => {
    e.preventDefault();
    if (
      !driverForm.name ||
      !driverForm.email ||
      !driverForm.phone ||
      !driverForm.licenseNumber ||
      !driverForm.vehicleType ||
      !driverForm.vehicleRegistration
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(driverForm.email)) {
      toast.error("Please enter a valid email");
      return;
    }
    if (!/^\d{10}$/.test(driverForm.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    // Simulate submission to backend
    toast.success("Your application is pending. Admin will update you soon.");
    setDriverForm({
      name: "",
      email: "",
      phone: "",
      licenseNumber: "",
      vehicleType: "",
      vehicleRegistration: "",
    });
  };

  const handleDriverFormChange = (e) => {
    const { name, value } = e.target;
    setDriverForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-lg fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <img
                  src="/ambulance-logo.png"
                  alt="Ambulance Tracker"
                  className="h-10 w-10"
                />
                <span className="ml-2 text-xl font-bold text-blue-600">
                  Ambulance Tracker
                </span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 transition duration-300"
                >
                  {item.name}
                </Link>
              ))}
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  href="/book"
                  className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
                >
                  Book Now
                </Link>
              </motion.div>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  href="/login"
                  className="border border-blue-600 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-50 transition duration-300"
                >
                  Login
                </Link>
              </motion.div>
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      isMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <motion.div
            className="md:hidden bg-white shadow-lg"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pt-2 pb-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-gray-700 hover:text-blue-600 transition duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/book"
                className="block bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Book Now
              </Link>
              <Link
                href="/login"
                className="block border border-blue-600 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-50 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Driver Registration Form */}
      <motion.section
        className="pt-24 pb-16 flex items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Driver Registration
          </h2>
          <form onSubmit={handleDriverFormSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 font-semibold mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={driverForm.name}
                onChange={handleDriverFormChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                placeholder="Enter your full name"
              />
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
                name="email"
                value={driverForm.email}
                onChange={handleDriverFormChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-gray-700 font-semibold mb-2"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={driverForm.phone}
                onChange={handleDriverFormChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                placeholder="Enter your phone number"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="licenseNumber"
                className="block text-gray-700 font-semibold mb-2"
              >
                Driver License Number
              </label>
              <input
                type="text"
                id="licenseNumber"
                name="licenseNumber"
                value={driverForm.licenseNumber}
                onChange={handleDriverFormChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                placeholder="Enter your license number"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="vehicleType"
                className="block text-gray-700 font-semibold mb-2"
              >
                Vehicle Type
              </label>
              <select
                id="vehicleType"
                name="vehicleType"
                value={driverForm.vehicleType}
                onChange={handleDriverFormChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
              >
                <option value="">Select vehicle type</option>
                <option value="Standard Ambulance">Standard Ambulance</option>
                <option value="Advanced Life Support">
                  Advanced Life Support
                </option>
                <option value="Neonatal Ambulance">Neonatal Ambulance</option>
              </select>
            </div>
            <div className="mb-6">
              <label
                htmlFor="vehicleRegistration"
                className="block text-gray-700 font-semibold mb-2"
              >
                Vehicle Registration Number
              </label>
              <input
                type="text"
                id="vehicleRegistration"
                name="vehicleRegistration"
                value={driverForm.vehicleRegistration}
                onChange={handleDriverFormChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                placeholder="Enter vehicle registration number"
              />
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
                Submit Application
              </button>
            </motion.div>
          </form>
          <p className="text-center text-gray-600 mt-4">
            Already registered?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.section>

      
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
