"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiUrls } from "@/apis/urls";
import usePutQuery from "@/hooks/putQuery.hook";
import { jwtDecode } from "jwt-decode";

export default function DriverDuty() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOnDuty, setIsOnDuty] = useState(false);
  const { putQuery } = usePutQuery();

  const token = sessionStorage.getItem("access_token");
  const [id, setId] = useState();
  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log(decoded, "decoded-tokenn");
        setId(decoded._id);
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

  const handleDutyToggle = async () => {
    await putQuery({
      url: apiUrls.toggleDuty,
      putData: { id },
      onSuccess: (data) => {
        console.log("Duty status updated successfully", data);
        toast.success(`Duty status updated to ${!isOnDuty ? "On" : "Off"}`);
      },
      onFail: (error) => {
        console.error("Failed to update duty status", error);
        toast.error("Failed to update duty status. Please try again.");
      },
    });
    setIsOnDuty(!isOnDuty);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Duty Toggle Section */}
      <motion.section
        className="pt-24 pb-16 flex items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Driver Duty Status
          </h2>
          <div className="flex items-center justify-between mb-6">
            <span className="text-lg font-semibold text-gray-700">
              Duty Status: {isOnDuty ? "On" : "Off"}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isOnDuty}
                onChange={handleDutyToggle}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition duration-300"></div>
              <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 left-0.5 peer-checked:translate-x-5 transition duration-300"></div>
            </label>
          </div>
          <p className="text-gray-600 text-center">
            Toggle your duty status to start or stop receiving booking requests.
          </p>
          {isOnDuty && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
            >
              <p className="text-blue-700 text-center font-medium">
                You are now on duty! You will receive service requests soon.
                Stay tuned for incoming bookings.
              </p>
            </motion.div>
          )}
        </div>
      </motion.section>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
