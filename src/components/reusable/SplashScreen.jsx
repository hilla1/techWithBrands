import React, { useEffect, useRef, useState } from 'react';
import animatedLogo from '/src/assets/animatedLogo.mp4'; // Import the video
import loadingLogo from '/src/assets/twbFalcon.png'; // Import the logo

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
    <div className="w-full h-screen flex items-center justify-center bg-black relative">
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
        <div className="absolute inset-0 flex items-center justify-center">
          <img src={loadingLogo} alt="Loading Logo" className="w-24 h-24" />
        </div>
      )}
    </div>
  );
};

export default SplashScreen;
