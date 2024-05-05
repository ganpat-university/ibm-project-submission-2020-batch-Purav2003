"use client";
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";

const FaceDetector = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [responseData, setResponseData] = useState({ response: '' })
  const loadModel = async () => {
    try {
      const model = await blazeface.load({
        modelUrl: "https://tfhub.dev/tensorflow/tfjs-model/blazeface/1/default/1",
        model: "backbone",
        maxFaces: 1,
        mode:"no-cors"
      });      
      console.log("BlazeFace model loaded successfully:", model);
      return model;
    } catch (error) {
      console.error("Error loading BlazeFace model:", error);
    }
  };

  const drawFaceDetections = (ctx, predictions) => {
    if (predictions.length > 0) {
      predictions.forEach((prediction) => {
        const startX = prediction.topLeft[0];
        const startY = prediction.topLeft[1];
        const endX = prediction.bottomRight[0];
        const endY = prediction.bottomRight[1];
        const width = endX - startX;
        const height = endY - startY;

        // Get the canvas context
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, startY, width, height);

        const landmarks = prediction.landmarks;
        capturePhoto(ctx);
        // Draw the landmarks
        ctx.fillStyle = "blue";
        landmarks.forEach((landmark) => {
          ctx.fillRect(landmark[0], landmark[1], 2, 2);
        });
      });
    }
  };

  const sendPhotoToBackend = async () => {
    // Send the captured photo to the backend
    // console.log(capturedPhoto);
    if (capturedPhoto) {
      try {
        // Extract base64-encoded image data
        const base64Data = capturedPhoto?.split(',')[1];
        console.log(base64Data)
        let response = await fetch('http://127.0.0.1:8000/api/faceMatch/', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: base64Data }),
        });
        response = await response.json();
        console.log(response)
        setResponseData({ response: response.user })


      } catch (error) {
        console.error('Error sending photo to backend:', error);
      }
    }
    else{
      alert('nope')
    }
  };


  const capturePhoto = async (ctx) => {
    const video = webcamRef.current.video;
    const photo = document.createElement("canvas");
    photo.width = video.width;
    photo.height = video.height;
    const photoCtx = photo.getContext("2d");
    photoCtx.drawImage(video, 0, 0, video.width, video.height);
    setCapturedPhoto(photo.toDataURL("image/jpeg")); 
    // sendPhotoToBackend(photo.toDataURL("image/jpeg"));
  };

  const detectFaces = async (model, prevPrediction) => {
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
  
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
  
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
  
      const ctx = canvasRef.current.getContext("2d");
  
      // Draw the video on the canvas
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
  
      const predictions = await model.estimateFaces(video);
  
      drawFaceDetections(ctx, predictions);
  
      // Compare current face with previous face
      if (prevPrediction && predictions.length > 0) {
        const currentPrediction = predictions[0]; // Assuming only one face is detected
        const prevStartX = prevPrediction.topLeft[0];
        const prevStartY = prevPrediction.topLeft[1];
        const prevEndX = prevPrediction.bottomRight[0];
        const prevEndY = prevPrediction.bottomRight[1];
  
        const currStartX = currentPrediction.topLeft[0];
        const currStartY = currentPrediction.topLeft[1];
        const currEndX = currentPrediction.bottomRight[0];
        const currEndY = currentPrediction.bottomRight[1];
  
        // Compare the coordinates of the previous and current faces
        const match = (
          prevStartX === currStartX &&
          prevStartY === currStartY &&
          prevEndX === currEndX &&
          prevEndY === currEndY
        );
  
        // If faces don't match, send photo to backend
        if (!match) {
          capturePhoto(ctx);
        }
      }
  
      // Loop through the frames with a delay
      setTimeout(() => {
        requestAnimationFrame(() => {
          detectFaces(model, predictions.length > 0 ? predictions[0] : null);
        });
      }, 100); // Adjust the delay as needed
    }
  };
  

  useEffect(() => {
    loadModel().then((model) => {
      detectFaces(model);
    });
  }, []);

  return (
    <div className="items-center min-h-screen grid justify-center">
      <div style={{ textAlign: 'center' }}>
        <div style={{ position: 'relative', display: 'inline-block', width: "400px", height: "400px", borderRadius: '50%', overflow: 'hidden', margin: '20px' }} className="object-cover">
          <Webcam ref={webcamRef} style={{ borderRadius: '50%', width: "400px", height: "400px" }} className="object-cover" mirrored="false" />
          <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, borderRadius: '50%', width: "400px", height: "400px", transform: 'scaleX(-1)' }} className="object-cover" />
        </div>
      </div>
      <button id="myCheck" onClick={sendPhotoToBackend} className="bg-green-500 rounded-md text-white px-4 py-2 inline-block">Send</button>
      <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'white', background: 'red' }}>
        <p>{responseData.response}</p>
        <img src={capturePhoto} />
      </div>
    </div>
  );
};

export default FaceDetector;