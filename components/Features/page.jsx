"use client";

import { motion } from "framer-motion";
function Features() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hover: { y: -10, boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)" },
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
    </div>
  );
}

export default Features;
