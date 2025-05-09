"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

export default function Profile() {
  const router = useRouter();
  const { isLoggedIn, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      toast.error("Please login to book an ambulance");
      router.push("/login");
    }
  }, [isLoggedIn, loading, router]);

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     router.push("/login");
  //   }
  // }, [isLoggedIn, router]);

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

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-700">
  //       Loading...
  //     </div>
  //   );
  // }

  if (!isLoggedIn) {
    return null; // Redirect handled by useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <motion.section
        className="pt-24 pb-12 bg-gradient-to-r from-[#df4040] to-[#df4040] text-white text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome, {userName || "User"}!
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Manage your profile and view your booking history.
          </p>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Link
              href="/book"
              className="bg-white text-[#df4040] px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
            >
              Book an Ambulance
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Profile Section */}
      <motion.section
        className="py-16 bg-white"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Your Profile
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-6">
              <img
                src={`https://ui-avatars.com/api/?name=${userName}&size=64`}
                alt="Profile"
                className="h-16 w-16 rounded-full mr-4"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {userName || "User"}
                </h3>
                <p className="text-gray-600">
                  {/* Placeholder email; replace with real data */}
                  {userName.toLowerCase().replace(/\s+/g, ".")}@example.com
                </p>
              </div>
            </div>
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Account Details
              </h4>
              <p className="text-gray-600">
                {/* Placeholder; fetch from backend or allow editing */}
                Phone: +1 (555) 123-4567
              </p>
              <p className="text-gray-600">
                Address: 123 Main St, City, Country
              </p>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="mt-4"
              >
                <Link
                  href="/profile/edit"
                  className="bg-[#df4040] text-white px-4 py-2 rounded-full hover:bg-[#df4040] transition duration-300"
                >
                  Edit Profile
                </Link>
              </motion.div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Booking History
              </h4>
              <p className="text-gray-600">
                {/* Placeholder; replace with real booking data */}
                No recent bookings. Book an ambulance to get started!
              </p>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="mt-4"
              >
                <Link
                  href="/book"
                  className="border border-[#df4040] text-[#df4040] px-4 py-2 rounded-full hover:bg-blue-50 transition duration-300"
                >
                  Book Now
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
