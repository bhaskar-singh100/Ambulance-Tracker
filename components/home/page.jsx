"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
// import useAuthCheck from "@/hooks/useAuthCheck";
import About from "../About/page";
import Testimonials from "../Testimonials/page";
import Features from "../Features/page";
import { jwtDecode } from "jwt-decode";
export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const { isLoggedIn, userName } = useAuthCheck();
  const token = sessionStorage.getItem("access_token");
  const [role, setRole] = useState("");
  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, []);

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

  const cardVariants = {
    hover: { y: -10, boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)" },
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <motion.section
        className="pt-24 pb-12 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Emergency Ambulance Services at Your Fingertips
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Book an ambulance instantly or join as a driver to save lives.
          </p>
          {(!token || role === "customer") && (
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                href="/book"
                className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
              >
                Book an Ambulance Now
              </Link>
            </motion.div>
          )}
          {token && role === "driver" && (
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                href="/driver-duty"
                className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
              >
                Go to Duty
              </Link>
            </motion.div>
          )}
        </div>
      </motion.section>

      <Features />

      <Testimonials />

      <About />

      {/* CTA Section */}
      <motion.section
        className="py-16 bg-blue-600 text-white text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg mb-8">
            Book an ambulance or join our driver network today.
          </p>
          <div className="flex justify-center space-x-4">
            {(!token || role === "customer") && (
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  href="/book"
                  className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
                >
                  Book Now
                </Link>
              </motion.div>
            )}
            {(!token || role !== "customer") && (
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  href="/driver-register"
                  className="border border-white text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-300"
                >
                  Become a Driver
                </Link>
              </motion.div>
            )}
            {token && role === "driver" && (
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  href="/driver-duty"
                  className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
                >
                  Go to Duty
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
