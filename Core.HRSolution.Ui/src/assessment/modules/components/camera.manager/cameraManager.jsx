import React, { useRef } from "react";
import Webcam from "react-webcam";

const CameraManager = ({ onSnapshot }) => {
  const webcamRef = useRef(null);

  const captureSnapshot = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (onSnapshot) onSnapshot(imageSrc);
    }
  };

  return (
    <Webcam
      ref={webcamRef}
      audio={false}
      screenshotFormat="image/jpeg"
      videoConstraints={{ facingMode: "user" }}
      style={{ display: "none" }} // Keep camera running but hidden
    />
  );
};

export default CameraManager;