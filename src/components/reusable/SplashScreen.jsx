import React, { useEffect, useRef, useState } from 'react';
import animatedLogo from '/src/assets/animatedLogo.mp4'; // Import the video

const SplashScreen = ({ onFinish }) => {
  const videoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    // Set a timeout to skip the video after 5 seconds if not loaded
    const timeoutId = setTimeout(() => {
      onFinish();
    }, 3000);

    if (video) {
      video.playbackRate = 1.5; // Increase the video speed

      // Clear the timeout if the video loads before 3 seconds
      video.addEventListener('loadeddata', () => {
        clearTimeout(timeoutId);
        setIsVideoLoaded(true);
      });
    }

    // Clean up the timeout on unmount
    return () => clearTimeout(timeoutId);
  }, [onFinish]);

  const handleVideoEnded = () => {
    onFinish(); // Call the onFinish prop to switch to the landing page
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={animatedLogo} // Use the imported video
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnded}
      >
        Your browser does not support the video tag.
      </video>
      {!isVideoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          Loading...
        </div>
      )}
    </div>
  );
};

export default SplashScreen;
