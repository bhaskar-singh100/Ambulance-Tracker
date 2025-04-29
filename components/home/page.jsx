"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-16 bg-gray-50"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                title: "Instant Booking",
                description:
                  "Book an ambulance in seconds with our easy-to-use platform.",
                icon: "🚑",
              },
              {
                title: "Real-Time Tracking",
                description:
                  "Track your ambulance’s location in real-time for peace of mind.",
                icon: "📍",
              },
              {
                title: "Driver Portal",
                description:
                  "Join our network of drivers to respond to emergencies efficiently.",
                icon: "👨‍🚒",
              },
              {
                title: "24/7 Support",
                description:
                  "Our support team is available round-the-clock to assist you.",
                icon: "📞",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
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

      {/* About Section */}
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
          </div>
        </div>
      </motion.section>
    </div>
  );
}
