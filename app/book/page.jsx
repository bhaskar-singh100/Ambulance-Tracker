"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";
import { loadGoogleMapsScript } from "@/lib/googleMaps";
import { useAuth } from "@/contexts/AuthContext";

export default function Booking() {
  const mapRef = useRef(null);
  const sidebarRef = useRef(null);
  const pickupRef = useRef(null);
  const dropRef = useRef(null);
  const [mapData, setMapData] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [startLoc, setStartLoc] = useState("");
  const [endLoc, setEndLoc] = useState("");
  const [bookingType, setBookingType] = useState("emergency");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fare, setFare] = useState("");
  const [driverInfo, setDriverInfo] = useState(null);
  const [bookingId, setBookingId] = useState("");
  const driverMarkerRef = useRef(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const { isLoggedIn, loading } = useAuth();

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
  const buttonVariants = { hover: { scale: 1.05 }, tap: { scale: 0.95 } };

  const initMap = () => {
    if (!window.google || !mapRef.current) {
      console.error("Google Maps or mapRef not available");
      return;
    }
    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center: { lat: 28.6692, lng: 77.4538 },
    });
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      map,
      panel: sidebarRef.current,
    });
    const pickupAutocomplete = new window.google.maps.places.Autocomplete(
      pickupRef.current
    );
    const dropAutocomplete = new window.google.maps.places.Autocomplete(
      dropRef.current
    );
    pickupAutocomplete.setFields(["formatted_address", "geometry"]);
    dropAutocomplete.setFields(["formatted_address"]);
    pickupAutocomplete.addListener("place_changed", () => {
      const place = pickupAutocomplete.getPlace();
      if (place && place.formatted_address) {
        console.log("Pickup location set:", place.formatted_address);
        setStartLoc(place.formatted_address);
      }
    });
    dropAutocomplete.addListener("place_changed", () => {
      const place = dropAutocomplete.getPlace();
      if (place && place.formatted_address) {
        console.log("Drop-off location set:", place.formatted_address);
        setEndLoc(place.formatted_address);
      }
    });
    setMapData({ map, directionsService, directionsRenderer });
    setIsMapLoading(false);
  };

  const calculateRoute = () => {
    if (!mapData || !mapData.directionsService || !startLoc || !endLoc) {
      console.log("Cannot calculate route:", {
        mapData: !!mapData,
        directionsService: !!(mapData && mapData.directionsService),
        startLoc,
        endLoc,
      });
      toast.error("Route calculation failed: Missing map data or locations");
      return;
    }
    console.log("Calculating route from", startLoc, "to", endLoc);
    mapData.directionsService
      .route({
        origin: startLoc,
        destination: endLoc,
        travelMode: window.google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        console.log("Route calculation successful:", response);
        mapData.directionsRenderer.setDirections(response);
        const leg = response.routes[0].legs[0];
        setDistance(leg.distance.text);
        setDuration(leg.duration.text);
        const distanceKm =
          parseFloat(leg.distance.text.replace(" km", "")) || 0;
        const fare =
          bookingType === "emergency"
            ? (5 + distanceKm * 2).toFixed(2)
            : (3 + distanceKm * 1.5).toFixed(2);
        setFare(fare);
      })
      .catch((error) => {
        console.error("Route request failed:", error);
        toast.error("Route request failed: " + error.message);
      });
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const geocoder = new window.google.maps.Geocoder();
        const latlng = { lat: latitude, lng: longitude };
        geocoder.geocode({ location: latlng }, (results, status) => {
          if (status === "OK" && results[0]) {
            const address = results[0].formatted_address;
            console.log("Current location address:", address);
            setStartLoc(address);
            if (pickupRef.current) pickupRef.current.value = address;
          } else {
            toast.error("Unable to retrieve address for current location");
          }
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Location permission denied. Please allow access.");
        } else {
          toast.error("Unable to fetch current location");
        }
      }
    );
  };

  const handleBooking = (e) => {
    e.preventDefault();
    if (!startLoc || !endLoc) {
      toast.error("Please enter both pickup and drop-off locations");
      return;
    }
    if (!distance || !duration) {
      toast.error("Please wait for route calculation to complete");
      return;
    }
    const newBookingId = uuidv4();
    setBookingId(newBookingId);
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: startLoc }, (results, status) => {
      if (status === "OK" && results[0]) {
        const pickupLatLng = results[0].geometry.location;
        const bookingDetails = {
          bookingId: newBookingId,
          pickupCoordinates: {
            lat: pickupLatLng.lat(),
            lng: pickupLatLng.lng(),
          },
        };
        console.log("Emitting booking request:", bookingDetails);
        socket.emit("newBooking", bookingDetails);
      } else {
        toast.error("Unable to geocode pickup location");
      }
    });
  };

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setId(decoded._id);
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, []);

  useEffect(() => {
    console.log("Booking component socket ID:", socket.id);
    const handleDriverAccepted = ({ driverName, driverCoordinates }) => {
      console.log("Driver accepted:", { driverName, driverCoordinates });
      setDriverInfo({ name: driverName, coordinates: driverCoordinates });
      setShowPopup(true);
      toast.success(
        `${driverName} accepted your request, he will be coming soon!`
      );
      if (mapData && mapData.map) {
        if (driverMarkerRef.current) driverMarkerRef.current.setMap(null);
        const newMarker = new window.google.maps.Marker({
          position: driverCoordinates,
          map: mapData.map,
          title: driverName,
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
          },
        });
        driverMarkerRef.current = newMarker;
        mapData.map.panTo(driverCoordinates);
      }
    };

    const handleDriverLocationUpdate = ({ coordinates }) => {
      console.log("Driver location update in Booking:", coordinates);
      if (mapData && mapData.map) {
        if (driverMarkerRef.current) {
          driverMarkerRef.current.setPosition(coordinates);
        } else if (driverInfo) {
          const newMarker = new window.google.maps.Marker({
            position: coordinates,
            map: mapData.map,
            title: driverInfo.name || "Driver",
            icon: {
              url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
            },
          });
          driverMarkerRef.current = newMarker;
        }
        mapData.map.panTo(coordinates);
      }
    };

    const handleDriverReached = ({ bookingId, driverId }) => {
      console.log("Driver reached", bookingId, driverId);
      toast.success("Your driver has arrived!");
      if (driverMarkerRef.current) driverMarkerRef.current.setMap(null);
    };

    socket.on("driverAccepted", handleDriverAccepted);
    socket.on("driverLocationUpdate", handleDriverLocationUpdate);
    socket.on("driverReached", handleDriverReached);

    return () => {
      socket.off("driverAccepted", handleDriverAccepted);
      socket.off("driverLocationUpdate", handleDriverLocationUpdate);
      socket.off("driverReached", handleDriverReached);
      if (driverMarkerRef.current) driverMarkerRef.current.setMap(null);
    };
  }, [mapData, driverInfo]);

  useEffect(() => {
    if (startLoc && endLoc && mapData) {
      console.log("useEffect triggering route calculation");
      const timeout = setTimeout(calculateRoute, 500);
      return () => clearTimeout(timeout);
    }
  }, [startLoc, endLoc, mapData]);

  useEffect(() => {
    const apiKey =
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      "AIzaSyAsvRqj6OdubkF9917Kk236prfI35kZqBo";
    loadGoogleMapsScript(apiKey, ["places", "marker"])
      .then(() => {
        console.log("Google Maps script loaded");
        initMap();
      })
      .catch((err) => {
        console.error("Google Maps load error:", err);
        toast.error("Failed to load Google Maps");
        setIsMapLoading(false);
      });
    return () => {
      if (driverMarkerRef.current) driverMarkerRef.current.setMap(null);
    };
  }, []);

  const handleTrackDriver = () => {
    setShowPopup(false);
    router.push(
      `/track-driver?bookingId=${bookingId}&driverName=${encodeURIComponent(
        driverInfo.name
      )}&lat=${driverInfo.coordinates.lat}&lng=${driverInfo.coordinates.lng}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {showPopup && driverInfo && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Booking Confirmed
            </h3>
            <p className="text-gray-700 mb-2">
              Driver <strong>{driverInfo.name}</strong> has accepted your
              request.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Location:</strong> Lat: {driverInfo.coordinates.lat}, Lng:{" "}
              {driverInfo.coordinates.lng}
            </p>
            <motion.button
              onClick={handleTrackDriver}
              className="w-full bg-[#df4040] text-white px-4 py-2 rounded-full hover:bg-[#df4040] transition duration-300"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Track Driver
            </motion.button>
            <motion.button
              onClick={() => setShowPopup(false)}
              className="w-full mt-2 text-gray-600 hover:text-gray-800 transition duration-300"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}
      <motion.section
        className="pt-24 pb-16 flex flex-col lg:flex-row"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="lg:w-1/3 bg-white p-8 shadow-lg lg:sticky lg:top-24 mx-4 lg:mx-0 rounded-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Book an Ambulance
          </h2>
          <form onSubmit={handleBooking}>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Booking Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="bookingType"
                    value="emergency"
                    checked={bookingType === "emergency"}
                    onChange={() => setBookingType("emergency")}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Emergency</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="bookingType"
                    value="non-emergency"
                    checked={bookingType === "non-emergency"}
                    onChange={() => setBookingType("non-emergency")}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Non-Emergency</span>
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="pickup"
                className="block text-gray-700 font-semibold mb-2"
              >
                Pickup Location
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="pickup"
                  ref={pickupRef}
                  placeholder="Enter pickup location"
                  className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#df4040] text-gray-900"
                />
                <motion.button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="bg-[#df4040] text-white px-4 py-2 rounded-lg hover:bg-[#df4040] transition duration-300"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Use Current Location
                </motion.button>
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="drop"
                className="block text-gray-700 font-semibold mb-2"
              >
                Drop-off Location
              </label>
              <input
                type="text"
                id="drop"
                ref={dropRef}
                placeholder="Enter drop-off location"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#df4040] text-gray-900"
              />
            </div>
            {distance && duration && fare && (
              <div className="mb-6">
                <p className="text-gray-700">
                  <strong>Distance:</strong> {distance}
                </p>
                <p className="text-gray-700">
                  <strong>Duration:</strong> {duration}
                </p>
                <p className="text-gray-700">
                  <strong>Fare:</strong> ${fare}
                </p>
              </div>
            )}
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <button
                type="submit"
                className="w-full bg-[#df4040] text-white px-4 py-2 rounded-full hover:bg-[#df4040] transition duration-300"
              >
                Confirm Booking
              </button>
            </motion.div>
          </form>
        </div>
        <div className="lg:w-2/3 flex flex-col">
          <div ref={mapRef} className="h-[60vh] lg:h-[80vh] w-full"></div>
          <div
            ref={sidebarRef}
            className="bg-white p-4 overflow-auto border-t border-gray-200 lg:border-l lg:border-t-0"
          ></div>
        </div>
      </motion.section>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
