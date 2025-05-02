"use client";
import React from "react";

import { motion } from "framer-motion";
function Testimonials() {
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
    <div>
      <motion.section
        className="py-16 bg-white"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah M.",
                role: "Customer",
                text: "The app was a lifesaver! I booked an ambulance in minutes, and the tracking feature kept me informed.",
                avatar: "/sarah.jpg",
              },
              {
                name: "John D.",
                role: "Driver",
                text: "Being part of this network is rewarding. The app makes it easy to respond to emergencies quickly.",
                avatar: "/john.jpg",
              },
              {
                name: "Emily R.",
                role: "Customer",
                text: "The 24/7 support team was incredibly helpful during a stressful situation. Highly recommend!",
                avatar: "/emily.jpg",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default Testimonials;
