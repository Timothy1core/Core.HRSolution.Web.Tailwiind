import { useEffect, useState, useRef } from 'react';
import Webcam from "react-webcam";

const Step4Div = ({ handleStartAssessment, startCamera }) => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]); // Array to store snapshots
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [intervalId, setIntervalId] = useState(null); // To store interval ID

  // Fetch the available media devices
  useEffect(() => {
    const getDevices = async () => {
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = mediaDevices.filter((device) => device.kind === "videoinput");
      setDevices(videoDevices);

      if (videoDevices.length > 0) {
        setSelectedDeviceId(videoDevices[0].deviceId); // Default to the first camera
      }
    };

    getDevices();
  }, []);

  // Function to capture a snapshot
  const captureSnapshot = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc); // Save the captured image (optional)
      setImages((prevImages) => [...prevImages, imageSrc]); // Add the image to the array
    }
  };

  // Start capturing snapshots every 30 minutes
  useEffect(() => {
    // startCamera(true)

    if (selectedDeviceId) {
      const id = setInterval(captureSnapshot, 3000 ); // 30 minutes in milliseconds
      setIntervalId(id);
    }

    return () => {
      // Clear the interval when the component unmounts
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [selectedDeviceId]);

  return (
    <div className="app-container py-7 shadow-sm border border-gray-300 border-1 rounded mb-10">
      {/* Camera Setup Section */}
      <div className="row">
        <div className="col-md-6">
          <h2>Camera Setup</h2>
          <div className="separator border-3 my-8 border-danger"></div>
          <span className="fs-5">
            We use camera images to ensure fairness for everyone. Make sure that you are in front of your camera.
          </span>
          <div className="separator border-1 my-8 border-danger"></div>
          {/* Dropdown to select camera */}
          <div style={{ marginBottom: "20px" }}>
            <label className="fs-5" htmlFor="cameraSelect">Camera:</label>
            <select
              className="form-select form-select-solid w-50"
              id="cameraSelect"
              onChange={(e) => setSelectedDeviceId(e.target.value)}
            >
              {devices.map((device, index) => (
                <option key={index} value={device.deviceId}>
                  {device.label || `Camera ${index + 1}`}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <div style={{ textAlign: "center" }}>
            {/* Webcam feed */}
            {selectedDeviceId && (
              <Webcam
                className="border rounded"
                audio={false}
                ref={webcamRef}
                videoConstraints={{ deviceId: selectedDeviceId }}
                screenshotFormat="image/jpeg"
                width={490}
                height={368}
              />
            )}
          </div>
          {/* Troubleshooting Section */}
          <div className="border rounded bg-light-danger border-danger p-3">
            <h5>Trouble with your webcam?</h5>
            <ul>
              <li className="fs-5">
                Ensure you have granted permission for your browser to access your camera.
              </li>
              <li className="fs-5">
                Ensure you are using a supported browser.
              </li>
              <li className="fs-5">
                If you have multiple camera devices, ensure you have given your browser and our website permission to use the right device.
              </li>
              <li className="fs-5">
                Try launching the assessment in incognito mode or in a private window.
              </li>
              <li className="fs-5">
                Ensure that your camera drivers and web browser are up to date.
              </li>
              <li className="fs-5">
                Restart your device and try accessing the assessment again using the link in the invitation email.
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Button to start the assessment */}
      <div className="text-end mt-5">
        <button
          className="btn btn-danger rounded-pill"
          onClick={handleStartAssessment}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export { Step4Div };
