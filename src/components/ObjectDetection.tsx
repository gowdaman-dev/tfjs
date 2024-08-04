"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import { loadGraphModel } from "@tensorflow/tfjs";

const ObjectDetection: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<tf.GraphModel | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await loadGraphModel("/yolov8n_web_model/model.json");
      setModel(loadedModel);
    };

    loadModel();
  }, []);

  const detectObjects = useCallback(async () => {
    if (webcamRef.current && model) {
      const video = webcamRef.current.video;
      if (video && video.readyState === 4) {
        // Capture the video frame as a tensor
        let videoTensor = tf.browser.fromPixels(video);

        // Resize the tensor to the expected input shape [1, 640, 640, 3]
        videoTensor = tf.image.resizeBilinear(videoTensor, [640, 640]);
        videoTensor = videoTensor.expandDims(0); // Add batch dimension

        // Run inference using the model
        const predictions = await model.executeAsync(videoTensor);

        // Process the predictions as needed
        drawPredictions(predictions);

        // Dispose the tensor to release memory
        videoTensor.dispose();
      }
    }
  }, [model]);

  const drawPredictions = (predictions: any) => {
    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;
    if (canvas && video) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Assuming predictions is an array of objects with bbox and class properties
        predictions.forEach((prediction: any) => {
          const [x, y, width, height] = prediction.bbox;
          ctx.beginPath();
          ctx.rect(x, y, width, height);
          ctx.lineWidth = 1;
          ctx.strokeStyle = "red";
          ctx.fillStyle = "red";
          ctx.stroke();
          ctx.fillText(prediction.class, x, y > 10 ? y - 5 : 10);
        });
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(detectObjects, 100);
    return () => clearInterval(interval);
  }, [detectObjects]);

  return (
    <div className="relative flex justify-center items-center min-h-screen w-full bg-gray-100">
      <Webcam
        ref={webcamRef}
        className="absolute top-0 left-0 w-full h-full md:w-fit md:h-screen object-cover z-0"
        audio={false}
        width="600"
        height="450"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full md:w-fit md:h-screen object-cover z-10"
        width="600"
        height="450"
      />
    </div>
  );
};

export default ObjectDetection;
