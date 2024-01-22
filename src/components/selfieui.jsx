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

  const handleConfirm = async () => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("timestamp", new Date().toISOString());

    await fetch("/api/age", {
      method: "POST",
      headers: {
        // Don't set Content-Type manually, the browser will do it for you
        // "Content-Type": "multipart/form-data",
      },
      body: formData,
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
        <button
          className="absolute text-black top-0 right-0 m-4 p-2 bg-white rounded-full z-10"
          onClick={() => setSelfie(false)}
        >
          X
        </button>
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
            className="absolute bottom-0 m-5 btn btn-primary"
            style={{
              position: "absolute",
              left: "50vw",
            }}
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
