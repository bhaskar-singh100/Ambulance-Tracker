'use client";';
import Link from "next/link";
import React from "react";

function Footer() {
  const navItems = [
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
  ];
  return (
    <div>
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Ambulance Tracker</h3>
              <p className="text-gray-400">
                Connecting you to emergency services, anytime, anywhere.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-400 hover:text-white transition duration-300"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-white transition duration-300"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p className="text-gray-400">
                Email: support@ambulancetracker.com
                <br />
                Phone: +1-800-123-4567
              </p>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400">
            © 2025 Ambulance Tracker. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
