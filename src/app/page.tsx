// pages/index.js
"use client";
import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import WebcamCapture from "@/components/ObjectDetection";

const IndexPage = () => {
  const [model, setModel] = useState<any>(null);

  useEffect(() => {
    const loadModel = async () => {
      const model = await tf.loadGraphModel(
        "https://raw.githubusercontent.com/gowdaman-dev/mymodels/main/model.json",
      );
      setModel(model);
    };

    loadModel();
  }, []);

  const handleFrame = async (video: HTMLVideoElement) => {
    if (model && video.videoWidth > 0 && video.videoHeight > 0) {
      try {
        // Create tensor from video frame
        let tensor = tf.browser.fromPixels(video);

        // Resize tensor to match model input shape
        tensor = tf.image.resizeBilinear(tensor, [640, 640]);

        // Add batch dimension
        tensor = tensor.expandDims(0);

        // Make predictions
        const predictions = await model.executeAsync(tensor);

        // Process and display predictions
        console.log(predictions);

        // Dispose tensor to free up memory
        tensor.dispose();
      } catch (error) {
        console.error("Error during object detection:", error);
      }
    } else {
      console.log("Video dimensions are invalid.");
    }
  };

  return (
    <div>
      <h1>Object Detection with Webcam</h1>
      <WebcamCapture onFrame={handleFrame} />
    </div>
  );
};

export default IndexPage;
