"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import React from "react";

function About() {
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

  return (
    <div>
      <motion.section
        className="py-16 bg-gray-50"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <img
                src="/ambulance-team.jpg"
                alt="Ambulance Team"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                About Us
              </h2>
              <p className="text-gray-600 mb-6">
                At Ambulance Tracker, we are dedicated to providing fast and
                reliable emergency services. Our platform connects customers
                with ambulances and empowers drivers to respond swiftly. With
                cutting-edge technology and a commitment to saving lives, we’re
                here 24/7.
              </p>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  href="/about"
                  className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-300"
                >
                  Learn More
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default About;
