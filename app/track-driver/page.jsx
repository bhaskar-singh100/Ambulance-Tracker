"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, useSearchParams } from "next/navigation";
import socket from "@/lib/socket";
import { useAuth } from "@/contexts/AuthContext";

export default function TrackDriver() {
  const mapRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const [mapData, setMapData] = useState(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [driverInfo, setDriverInfo] = useState(null);
  const [containerError, setContainerError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [locationQueue, setLocationQueue] = useState([]);
  const [hasReached, setHasReached] = useState(false);
  const searchParams = useSearchParams();

  const bookingId = searchParams.get("bookingId");
  const driverName = searchParams.get("driverName");
  const lat = parseFloat(searchParams.get("lat"));
  const lng = parseFloat(searchParams.get("lng"));
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
  const buttonVariants = { hover: { scale: 1.05 }, tap: { scale: 0.95 } };

  const loadScript = (url, retries = 5, delay = 1000) => {
    return new Promise((resolve, reject) => {
      const attemptLoad = (attempt) => {
        const existingScript = document.querySelector(`script[src^="${url}"]`);
        if (existingScript) {
          console.log("Google Maps script already loaded");
          return resolve();
        }
        const script = document.createElement("script");
        script.src = url;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log(`Google Maps script loaded (attempt ${attempt})`);
          resolve();
        };
        script.onerror = () => {
          console.error(`Google Maps script load failed (attempt ${attempt})`);
          if (attempt < retries) {
            setTimeout(() => attemptLoad(attempt + 1), delay * attempt);
          } else {
            reject(
              new Error("Failed to load Google Maps script after retries")
            );
          }
        };
        document.body.appendChild(script);
      };
      attemptLoad(1);
    });
  };

  const initMap = () => {
    if (!mapRef.current) {
      console.error("Map container not found");
      toast.error("Map initialization failed: Container not found");
      setContainerError(true);
      setIsMapLoading(false);
      return;
    }
    if (!window.google || !window.google.maps) {
      console.error("Google Maps API not available");
      toast.error("Map initialization failed: Google Maps API not loaded");
      setContainerError(true);
      setIsMapLoading(false);
      return;
    }
    try {
      const center = {
        lat: isNaN(lat) ? 28.6692 : lat,
        lng: isNaN(lng) ? 77.4538 : lng,
      };
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 14,
        center,
      });
      setMapData({ map });
      setIsMapLoading(false);
      setContainerError(false);
      console.log("Map initialized successfully");
      if (driverName && !isNaN(lat) && !isNaN(lng)) {
        setDriverInfo({ name: driverName, coordinates: { lat, lng } });
        const marker = new window.google.maps.Marker({
          position: { lat, lng },
          map,
          title: driverName,
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
          },
        });
        driverMarkerRef.current = marker;
      }
    } catch (error) {
      console.error("Map initialization error:", error);
      toast.error(`Map initialization error: ${error.message}`);
      setIsMapLoading(false);
      setContainerError(true);
    }
  };

  useEffect(() => {
    if (mapData && mapData.map && locationQueue.length > 0) {
      console.log("Processing queued location updates:", locationQueue);
      locationQueue.forEach(({ coordinates }) => {
        setDriverInfo((prev) => ({ ...prev, coordinates }));
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
      });
      setLocationQueue([]);
    }
  }, [mapData, locationQueue, driverInfo]);

  useEffect(() => {
    setIsMounted(true);
    console.log("TrackDriver mounted, socket ID:", socket.id);
    return () => {
      console.log("TrackDriver unmounted");
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    console.log("Setting up socket listeners, socket ID:", socket.id);
    if (bookingId) {
      console.log("Emitting joinBooking for booking:", bookingId);
      socket.emit("joinBooking", { bookingId });
    }

    const handleDriverLocationUpdate = ({ coordinates }) => {
      console.log("Driver location update received:", coordinates);
      if (!hasReached) {
        if (mapData && mapData.map) {
          setDriverInfo((prev) => ({ ...prev, coordinates }));
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
        } else {
          setLocationQueue((prev) => [...prev, { coordinates }]);
        }
      }
    };

    const handleDriverReached = ({ driverId, bookingId }) => {
      console.log(`Driver ${driverId} reached for booking ${bookingId}`);
      setHasReached(true);
      toast.success("Your driver has arrived!");
      if (driverMarkerRef.current) driverMarkerRef.current.setMap(null);
    };

    socket.on("driverLocationUpdate", handleDriverLocationUpdate);
    socket.on("driverReached", handleDriverReached);

    socket.on("connect", () => {
      console.log("Socket reconnected, ID:", socket.id);
      if (bookingId) {
        console.log("Re-emitting joinBooking for booking:", bookingId);
        socket.emit("joinBooking", { bookingId });
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      toast.error("Failed to connect to server");
    });

    socket.on("error", ({ message }) => {
      console.error("Server error:", message);
      toast.error(message);
    });

    return () => {
      console.log("Cleaning up socket listeners");
      socket.off("driverLocationUpdate", handleDriverLocationUpdate);
      socket.off("driverReached", handleDriverReached);
      if (driverMarkerRef.current) driverMarkerRef.current.setMap(null);
    };
  }, [mapData, driverInfo, bookingId, hasReached]);

  useEffect(() => {
    if (!isMounted) {
      console.log("Waiting for component to mount");
      return;
    }
    let retryCount = 0;
    const maxRetries = 5;
    const retryDelay = 1000;

    const tryInitMap = () => {
      console.log(`tryInitMap (retry ${retryCount + 1}/${maxRetries})`);
      if (!mapRef.current) {
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(tryInitMap, retryDelay);
        } else {
          console.error("Map container not ready after retries");
          toast.error("Map container not ready. Please try refreshing.");
          setContainerError(true);
          setIsMapLoading(false);
        }
        return;
      }
      window.initMap = () => {
        console.log("Global initMap callback triggered");
        initMap();
        delete window.initMap;
      };
      const url = `https://maps.googleapis.com/maps/api/js?key=${
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
        "AIzaSyAsvRqj6OdubkF9917Kk236prfI35kZqBo"
      }&libraries=places,marker&callback=initMap`;
      loadScript(url)
        .then(() => {
          if (!window.google || !window.google.maps) {
            throw new Error("Google Maps API not loaded");
          }
        })
        .catch((err) => {
          console.error("Google Maps load error:", err);
          toast.error("Failed to load Google Maps");
          setIsMapLoading(false);
          setContainerError(true);
        });
    };
    tryInitMap();
    return () => {
      delete window.initMap;
    };
  }, [isMounted]);

  const handleRetry = () => {
    console.log("Retry button clicked");
    setIsMapLoading(true);
    setContainerError(false);
    setTimeout(() => {
      if (mapRef.current) {
        window.initMap && window.initMap();
      } else {
        console.error("Retry failed: Map container still not ready");
        toast.error("Map container still not ready. Please refresh the page.");
        setContainerError(true);
        setIsMapLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <style jsx global>{`
        #map {
          height: 100% !important;
          width: 100% !important;
        }
        .map-container {
          position: relative;
          height: 60vh;
          width: 100%;
          max-width: 1280px;
          min-height: 400px;
        }
        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(229, 231, 235, 0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }
      `}</style>
      <motion.section
        className="pt-8 pb-16 flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Track Your Driver
        </h2>
        {driverInfo ? (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6 max-w-md w-full">
            <p className="text-gray-700">
              <strong>Driver:</strong> {driverInfo.name}
            </p>
            <p className="text-gray-700">
              <strong>Location:</strong> Lat: {driverInfo.coordinates.lat}, Lng:{" "}
              {driverInfo.coordinates.lng}
            </p>
            <p className="text-gray-700">
              <strong>Booking ID:</strong> {bookingId}
            </p>
            {hasReached && (
              <p className="text-green-600 font-medium mt-2">
                Driver has arrived!
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-600 mb-6">Loading driver information...</p>
        )}
        <div className="map-container">
          <div id="map" ref={mapRef} className="h-full w-full"></div>
          {isMapLoading && (
            <div className="loading-overlay">
              <p className="text-gray-600 text-lg">Loading map...</p>
              {containerError && (
                <motion.button
                  onClick={handleRetry}
                  className="mt-4 bg-[#df4040] text-white px-4 py-2 rounded-lg hover:bg-[#df4040] transition duration-300"
                  variants={intronVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Retry
                </motion.button>
              )}
            </div>
          )}
        </div>
      </motion.section>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
