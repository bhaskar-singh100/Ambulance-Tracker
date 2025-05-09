export const loadGoogleMapsScript = (apiKey, libraries = ["places"]) => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      console.log("Google Maps API already loaded");
      resolve();
      return;
    }
    const script = document.createElement("script");
    const librariesParam =
      libraries.length > 0 ? `&libraries=${libraries.join(",")}` : "";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}${librariesParam}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && window.google.maps) {
        console.log("Google Maps API loaded successfully");
        resolve();
      } else {
        console.error("Google Maps API failed to initialize");
        reject(new Error("Google Maps API failed to initialize"));
      }
    };
    script.onerror = () => {
      console.error("Failed to load Google Maps script");
      reject(new Error("Failed to load Google Maps script"));
    };
    document.head.appendChild(script);
  });
};
