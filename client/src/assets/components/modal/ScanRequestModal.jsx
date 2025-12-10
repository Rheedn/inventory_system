import { QrReader } from "react-qr-reader";
import { useEffect, useRef, useState } from "react";

export default function ScannerModal({ isOpen, onClose }) {
  const readerRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Start or stop the camera depending on modal state
  useEffect(() => {
    if (isOpen) {
      setCameraActive(true);
    } else {
      stopCamera();
      setCameraActive(false);
    }
  }, [isOpen]);

  const stopCamera = () => {
    try {
      const videoEl = readerRef.current?.videoRef?.current;

      if (videoEl && videoEl.srcObject) {
        videoEl.srcObject.getTracks().forEach((track) => track.stop());
        videoEl.srcObject = null;
        console.log("Camera stopped");
      }
    } catch (err) {
      console.log("Error stopping camera:", err);
    }
  };

  const handleQrResult = (result, error) => {
    if (!!result) {
      console.log("SCAN RESULT:", result.text);

      // Stop the camera immediately after successful scan
      stopCamera();
      setCameraActive(false);

      // Close modal after 1 second (optional)
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  return (
    <div>
      {isOpen && (
        <div className="modal">
          <h2>Scan QR Code</h2>

          {cameraActive && (
            // <QrReader
            //   ref={readerRef}
            //   constraints={{ facingMode: "environment" }}
            //   scanDelay={500}
            //   onResult={handleQrResult}
            //   videoStyle={{ width: "100%" }}
            // />
            <></>
          )}

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
