import React, { useState, useRef } from "react";
import { Camera } from "react-camera-pro";
import "tailwindcss/tailwind.css";

const SelfieUI = ({ setSelfie }) => {
  const [image, setImage] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const cameraRef = useRef(null);

  const handleTakePhoto = () => {
    setImage(cameraRef.current.takePhoto());
    setConfirm(true);
  };

  const handleConfirm = async (setSelfie) => {
    await fetch("/api/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image, timestamp: new Date().toISOString() }),
    });
    setConfirm(false);
    setImage(null);
    setSelfie(false);
  };

  const handleRetake = () => {
    setConfirm(false);
    setImage(null);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full h-full">
        <Camera ref={cameraRef} isMaxResolution />
        {confirm && (
          <div className="absolute bottom-0 w-full p-4 bg-white">
            <img src={image} alt="Preview" className="mb-4" />
            <div className="flex justify-between">
              <button
                className="btn btn-primary"
                onClick={() => handleConfirm(setSelfie)}
              >
                Confirm
              </button>
              <button className="btn btn-error" onClick={handleRetake}>
                Retake
              </button>
            </div>
          </div>
        )}
        {!confirm && (
          <button
            className="absolute bottom-0 right-0 m-4 btn btn-primary"
            onClick={handleTakePhoto}
          >
            Take Photo
          </button>
        )}
      </div>
    </div>
  );
};

export default SelfieUI;
