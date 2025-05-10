"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Services() {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      toast.error("Please login to book an ambulance");
      router.push("/login");
    }
  }, [isLoggedIn, loading, router]);
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

  const cardVariants = {
    hover: { y: -10, boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)" },
  };

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-lg md:text-xl mb-8">
            Discover how we make emergency medical transport accessible and
            efficient.
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
              Book an Ambulance Now
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section
        className="py-16 bg-white"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Service 1: Book an Ambulance */}
            <motion.div
              className="bg-gray-50 p-6 rounded-lg shadow-md"
              variants={cardVariants}
              whileHover="hover"
            >
              <h3 className="text-xl font-semibold text-[#df4040] mb-4">
                Book an Ambulance
              </h3>
              <p className="text-gray-600 mb-6">
                Instantly book an ambulance with real-time tracking and
                estimated arrival times. Our service ensures quick response for
                emergencies, with trained medical staff on board.
              </p>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  href="/book"
                  className="bg-[#df4040] text-white px-4 py-2 rounded-full hover:bg-[#df4040] transition duration-300"
                >
                  Book Now
                </Link>
              </motion.div>
            </motion.div>

            {/* Service 2: Become a Driver */}
            <motion.div
              className="bg-gray-50 p-6 rounded-lg shadow-md"
              variants={cardVariants}
              whileHover="hover"
            >
              <h3 className="text-xl font-semibold text-[#df4040] mb-4">
                Become a Driver
              </h3>
              <p className="text-gray-600 mb-6">
                Join our network of ambulance drivers and make a difference.
                Register, get verified, and start responding to emergency calls
                in your area.
              </p>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  href="/driver-register"
                  className="border border-[#df4040] text-[#df4040] px-4 py-2 rounded-full hover:bg-blue-50 transition duration-300"
                >
                  Register as a Driver
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-16 bg-[#df4040] text-white text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Need Help Right Now?</h2>
          <p className="text-lg mb-8">
            Book an ambulance or join our driver network to save lives.
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
    </div>
  );
}
