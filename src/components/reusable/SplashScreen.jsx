import React, { useEffect, useRef, useState } from 'react';
import animatedLogo from '/src/assets/animatedLogo.mp4'; // Import the video

const SplashScreen = ({ onFinish }) => {
  const videoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = 1.5; // Increase the video speed
    }
  }, []);

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
  };

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
        onLoadedData={handleVideoLoaded}
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
