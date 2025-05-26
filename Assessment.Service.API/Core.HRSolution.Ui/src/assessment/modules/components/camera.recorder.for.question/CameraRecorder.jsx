import { useEffect, useState, useRef } from 'react';
import Webcam from "react-webcam";

const CameraRecorder = ({ onVideoBlob, maxDuration }) => {
  const webcamRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isReadyForNextQuestion, setReady] = useState(false);

  useEffect(() => {
    const getDevices = async () => {
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = mediaDevices.filter((device) => device.kind === "videoinput");
      setDevices(videoDevices);

      if (videoDevices.length > 0) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    };

    getDevices();
  }, []);

  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev + 1 >= maxDuration) {
            stopRecording(); // Automatically stop recording when maxDuration is reached
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(timer);
      setRecordingTime(0);
    }
    return () => clearInterval(timer);
  }, [isRecording, maxDuration]);

  const startRecording = async () => {
    if (webcamRef.current) {
      const stream = webcamRef.current.video.srcObject;

      // Ensure the stream is valid and ready
      if (!stream) {
        console.error("Webcam stream is not available");
        return;
      }

      const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

      // Bind the ondataavailable event before starting recording
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      // recorder.onstop = () => {
      //   if (recordedChunks.length > 0) {
      //     const blob = new Blob(recordedChunks, { type: "video/webm" });
      //     if (onVideoBlob) {
      //       onVideoBlob(blob);
      //     }
      //   }
      //   setIsRecording(false);
      //   setMediaRecorder(null);
      // };

      // Clear recordedChunks before starting the recording
      setRecordedChunks([]);

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const downloadVideo = () => {
    if (recordedChunks.length > 0) {
      // const blob = new Blob(recordedChunks, { type: "video/webm" });
      // const url = URL.createObjectURL(blob);

      // const a = document.createElement("a");
      // a.href = url;
      // a.download = "recorded_video.mp4"; // Save as .mp4 (consider saving as .webm too for compatibility)
      // a.click();
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      // URL.revokeObjectURL(url);
      onVideoBlob(blob)
      setRecordedChunks([]);
      setReady(true)
    }
  };

  return (
    <div className="app-container">
      <div className="row">
        <div className="col" style={{ position: "relative" }}>
          <div style={{ textAlign: "center" }}>
            {selectedDeviceId && (
              <Webcam
                className="border rounded"
                audio={true}
                ref={webcamRef}
                videoConstraints={{ deviceId: selectedDeviceId }}
                screenshotFormat="image/jpeg"
                // width={490}
                // height={368}
                width="100%"   // Full width of its parent container
                height="auto"  // Maintain aspect ratio automatically
              />
            )}
            {/* Overlay recording time */}
            {isRecording && (
              <div className='ms-10' style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                color: "red",
                fontSize: "20px",
                fontWeight: "bold",
                // backgroundColor: "rgba(0, 0, 0, 0.5)",
                padding: "5px",
                borderRadius: "5px"
              }}>
                Recording: {recordingTime} seconds
              </div>
            )}
          </div>
          <div className="mt-4" style={{ textAlign: "center" }}>
            {!isReadyForNextQuestion && !isRecording &&
            <button
              className="btn btn-primary me-2"
              onClick={startRecording}
              disabled={isRecording}
            >
              Start Recording
            </button>
            }
            { isRecording && 
            <button
              className="btn btn-danger me-2"
              onClick={stopRecording}
              disabled={!isRecording}
            >
              Stop Recording
            </button>
            }
            {isReadyForNextQuestion && <span>Proceed to Next Question</span>}
            {!isReadyForNextQuestion &&
            <button
              className="btn btn-success"
              onClick={downloadVideo}
              disabled={recordedChunks.length === 0}
            >
              Submit Video
            </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export { CameraRecorder };