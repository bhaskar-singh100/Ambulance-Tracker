"use client";
import Link from "next/link";
import React, { useState } from "react";
import { motion } from "framer-motion";
import useAuthCheck from "@/hooks/useAuthCheck";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoggedIn, userName } = useAuthCheck({
    redirectOnUnauthenticated: false,
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

  const modalVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  const handleLogout = () => {
    sessionStorage.removeItem("access_token");
    setIsMenuOpen(false);
    setIsModalOpen(false);
    window.location.href = "/login";
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
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
              {isLoggedIn ? (
                <div className="relative flex items-center">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={toggleModal}
                  >
                    <img
                      src="https://placehold.co/32x32"
                      alt="Profile"
                      className="h-8 w-8 rounded-full mr-2"
                    />
                    <span className="text-gray-700 font-medium">
                      {userName || "User"}
                    </span>
                  </div>
                  {isModalOpen && (
                    <motion.div
                      className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md z-20"
                      variants={modalVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-300"
                          onClick={closeModal}
                        >
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition duration-300"
                        >
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
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
              )}
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
              {isLoggedIn ? (
                <>
                  <Link
                    href="/profile"
                    className="block border border-blue-600 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-50 transition duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {userName ? `${userName}'s Profile` : "Profile"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block border border-red-600 text-red-600 px-4 py-2 rounded-full hover:bg-red-50 transition duration-300 w-full text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block border border-blue-600 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-50 transition duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
