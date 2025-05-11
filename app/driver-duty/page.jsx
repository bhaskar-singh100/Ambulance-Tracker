"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiUrls } from "@/apis/urls";
import usePutQuery from "@/hooks/putQuery.hook";
import { jwtDecode } from "jwt-decode";
import io from "socket.io-client";
import useGetQuery from "@/hooks/getQuery.hook";
import { loadGoogleMapsScript } from "@/lib/googleMaps";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function DriverDuty() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [data, setData] = useState({});
  const [booking, setBooking] = useState(null);
  const [acceptedBooking, setAcceptedBooking] = useState(null);
  const socketRef = useRef(null);
  const locationIntervalRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [hasReached, setHasReached] = useState(false);

  const { putQuery } = usePutQuery();
  const { getQuery } = useGetQuery();
  const [id, setId] = useState();
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      toast.error("Please login to book an ambulance");
      router.push("/login");
    }
  }, [isLoggedIn, loading, router]);

  useEffect(() => {
    const apiKey =
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      "AIzaSyAsvRqj6OdubkF9917Kk236prfI35kZqBo";
    loadGoogleMapsScript(apiKey)
      .then(() => {
        console.log("Google Maps API loaded");
        setIsGoogleMapsLoaded(true);
      })
      .catch((err) => {
        console.error("Failed to load Google Maps API:", err);
        toast.error("Failed to load Google Maps API");
      });
  }, []);

  useEffect(() => {
    socketRef.current = io("https://ambulance-tracker-backend.onrender.com", {
      transports: ["websocket", "polling"], // Allow polling fallback
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    });
    if (id) {
      socketRef.current.emit("registerDriver", id);
      console.log(`Driver ${id} registered with Socket.IO`);
    }
    socketRef.current.on("bookingNotification", (bookingDetails) => {
      console.log("Booking notification received:", bookingDetails);
      if (isOnDuty && !acceptedBooking) {
        if (isGoogleMapsLoaded && window.google) {
          const geocoder = new window.google.maps.Geocoder();
          const latlng = {
            lat: bookingDetails.pickupCoordinates.lat,
            lng: bookingDetails.pickupCoordinates.lng,
          };
          geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === "OK" && results[0]) {
              const address = results[0].formatted_address;
              console.log("Pickup address fetched:", address);
              setBooking({ ...bookingDetails, pickupAddress: address });
            } else {
              console.error("Geocoding failed:", status);
              setBooking({
                ...bookingDetails,
                pickupAddress: "Address unavailable",
              });
            }
            toast.info(`New booking available: ID ${bookingDetails.bookingId}`);
          });
        } else {
          setBooking({
            ...bookingDetails,
            pickupAddress: "Loading address...",
          });
          toast.info(`New booking available: ID ${bookingDetails.bookingId}`);
        }
      }
    });
    socketRef.current.on("closeBookingPopup", ({ bookingId }) => {
      if (booking && booking.bookingId === bookingId) {
        console.log(`Booking ${bookingId} accepted by another driver`);
        setBooking(null);
        toast.info("Booking was accepted by another driver");
      }
    });
    return () => {
      socketRef.current.disconnect();
      if (locationIntervalRef.current)
        clearInterval(locationIntervalRef.current);
    };
  }, [id, isOnDuty, acceptedBooking, isGoogleMapsLoaded]);

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);
        setId(decoded._id);
      } catch (err) {
        console.error("Invalid token:", err);
        toast.error("Invalid authentication token");
      }
    }
  }, []);

  useEffect(() => {
    if (id) {
      getQuery({
        url: apiUrls.getAllDrivers,
        onSuccess: (data) => {
          console.log("Driver data fetched successfully", data);
          const driver = data.find((driver) => driver._id === id);
          if (driver) {
            setData(driver);
            setIsOnDuty(driver.isOnDuty || false);
          } else {
            console.error("Driver not found in the list");
            toast.error("Driver data not found");
          }
        },
        onFail: (error) => {
          console.error("Failed to fetch driver data", error);
          toast.error("Failed to fetch driver data");
        },
      });
    }
  }, [id]);

  useEffect(() => {
    if (acceptedBooking && navigator.geolocation && !hasReached) {
      locationIntervalRef.current = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            const coordinates = { lat: latitude, lng: longitude };
            setCurrentLocation(coordinates);
            console.log("Sending driver location:", coordinates);
            socketRef.current.emit("driverLocation", {
              driverId: id,
              coordinates,
            });
          },
          (error) => {
            console.error("Geolocation error:", error);
            toast.error("Unable to fetch location");
          },
          { enableHighAccuracy: true }
        );
      }, 2000);
      return () => clearInterval(locationIntervalRef.current);
    }
  }, [acceptedBooking, hasReached, id]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };
  const buttonVariants = { hover: { scale: 1.05 }, tap: { scale: 0.95 } };

  const handleDutyToggle = async () => {
    await putQuery({
      url: apiUrls.toggleDuty,
      putData: { id },
      onSuccess: (data) => {
        console.log("Duty status updated:", data);
        setIsOnDuty(!isOnDuty);
        toast.success(`Duty status updated to ${!isOnDuty ? "On" : "Off"}`);
        if (!isOnDuty) {
          setBooking(null);
        } else {
          if (locationIntervalRef.current)
            clearInterval(locationIntervalRef.current);
          setAcceptedBooking(null);
          setHasReached(false);
        }
      },
      onFail: (error) => {
        console.error("Failed to update duty status:", error);
        toast.error("Failed to update duty status");
      },
    });
  };

  const handleAcceptBooking = () => {
    if (!booking || !data) return;
    const driverDetails = {
      name: data.name || userName || "Unknown Driver",
      phone: data.phone || "N/A",
      coordinates: {
        lat: data.coordinates?.lat || 28.6692,
        lng: data.coordinates?.lng || 77.4538,
      },
    };
    console.log("Accepting booking:", {
      bookingId: booking.bookingId,
      driverDetails,
    });
    socketRef.current.emit("acceptBooking", {
      bookingId: booking.bookingId,
      driverId: id,
      driverDetails,
    });
    setAcceptedBooking(booking);
    setBooking(null);
    setHasReached(false);
    toast.success("Booking accepted!");
  };

  const handleSkipBooking = () => {
    if (!booking) return;
    console.log(`Skipping booking: ${booking.bookingId}`);
    socketRef.current.emit("skipBooking", {
      bookingId: booking.bookingId,
      driverId: id,
    });
    setBooking(null);
    toast.info("Booking skipped");
  };

  const handleGoToPickup = () => {
    if (!acceptedBooking || !currentLocation) {
      toast.error("Current location or booking details unavailable");
      return;
    }
    const pickupLat = acceptedBooking.pickupCoordinates.lat;
    const pickupLng = acceptedBooking.pickupCoordinates.lng;
    const currentLat = currentLocation.lat;
    const currentLng = currentLocation.lng;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${currentLat},${currentLng}&destination=${pickupLat},${pickupLng}&travelmode=driving`;
    window.open(googleMapsUrl, "_blank");
  };

  const handleReached = () => {
    if (!acceptedBooking) return;
    console.log(`Driver reached for booking: ${acceptedBooking.bookingId}`);
    socketRef.current.emit("driverReached", {
      bookingId: acceptedBooking.bookingId,
      driverId: id,
    });
    if (locationIntervalRef.current) clearInterval(locationIntervalRef.current);
    setHasReached(true);
    toast.success("Notified customer of arrival!");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white shadow-lg fixed w-full z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <img
                  src="/ambulance-logo.png"
                  alt="Ambulance Tracker"
                  className="h-10 w-10"
                />
                <span className="ml-2 text-xl font-bold text-[#df4040]">
                  Ambulance Tracker
                </span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/services"
                className="text-gray-700 hover:text-[#df4040] transition duration-300"
              >
                Services
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-[#df4040] transition duration-300"
              >
                About
              </Link>
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
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  href="/login"
                  className="border border-[#df4040] text-[#df4040] px-4 py-2 rounded-full hover:bg-blue-50 transition duration-300"
                >
                  Login
                </Link>
              </motion.div>
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
              <Link
                href="/services"
                className="block text-gray-700 hover:text-[#df4040] transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/about"
                className="block text-gray-700 hover:text-[#df4040] transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/book"
                className="block bg-[#df4040] text-white px-4 py-2 rounded-full hover:bg-[#df4040] transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Book Now
              </Link>
              <Link
                href="/login"
                className="block border border-[#df4040] text-[#df4040] px-4 py-2 rounded-full hover:bg-blue-50 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </nav>
      <motion.section
        className="pt-24 pb-16 flex items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
            {acceptedBooking ? "Active Booking" : "Driver Duty Status"}
          </h2>
          {!acceptedBooking ? (
            <>
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
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#df4040] transition duration-300"></div>
                  <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 left-0.5 peer-checked:translate-x-5 transition duration-300"></div>
                </label>
              </div>
              <p className="text-gray-600 text-center">
                Toggle your duty status to start or stop receiving booking
                requests.
              </p>
              {isOnDuty && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <p className="text-[#df4040] text-center font-medium">
                    You are now on duty! You will receive service requests soon.
                    Stay tuned for incoming bookings.
                  </p>
                </motion.div>
              )}
            </>
          ) : hasReached ? (
            <div className="space-y-4">
              <p className="text-gray-700 text-center">
                <strong>Booking ID:</strong> {acceptedBooking.bookingId}
              </p>
              <p className="text-gray-700 text-center">
                <strong>Pickup Address:</strong> {acceptedBooking.pickupAddress}
              </p>
              <p className="text-green-600 text-center font-medium">
                You have reached the pickup location!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-700 text-center">
                <strong>Booking ID:</strong> {acceptedBooking.bookingId}
              </p>
              <p className="text-gray-700 text-center">
                <strong>Pickup Address:</strong> {acceptedBooking.pickupAddress}
              </p>
              <motion.button
                onClick={handleGoToPickup}
                className="w-full bg-[#df4040] text-white px-4 py-2 rounded-full hover:bg-[#df4040] transition duration-300"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                disabled={!currentLocation}
              >
                Go to Pickup
              </motion.button>
              <motion.button
                onClick={handleReached}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition duration-300"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Reached
              </motion.button>
            </div>
          )}
        </div>
      </motion.section>
      {booking && isOnDuty && !acceptedBooking && (
        <motion.div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50 max-w-sm w-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            New Booking Request
          </h3>
          <p className="text-gray-700 mb-2">
            <strong>Booking ID:</strong> {booking.bookingId}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Pickup Address:</strong> {booking.pickupAddress}
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Pickup Coordinates:</strong> Lat:{" "}
            {booking.pickupCoordinates.lat.toFixed(4)}, Lng:{" "}
            {booking.pickupCoordinates.lng.toFixed(4)}
          </p>
          <div className="flex space-x-2">
            <motion.button
              onClick={handleAcceptBooking}
              className="flex-1 bg-[#df4040] text-white px-4 py-2 rounded-full hover:bg-[#df4040] transition duration-300"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Accept Booking
            </motion.button>
            <motion.button
              onClick={handleSkipBooking}
              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition duration-300"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Skip
            </motion.button>
          </div>
        </motion.div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
