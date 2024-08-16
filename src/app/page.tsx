// pages/index.js
"use client";
import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import WebcamCapture from "@/components/ObjectDetection";

const IndexPage = () => {
  const [model, setModel] = useState<any>(null);

  useEffect(() => {
    const loadModel = async () => {
      const model = await tf.loadGraphModel("/best_web_model/model.json");
      setModel(model);
    };

    loadModel();
  }, []);

  const handleFrame = async (video: HTMLVideoElement) => {
    if (model && video.readyState >= 2) {
      // READY_STATE_HAVE_CURRENT_DATA
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        try {
          const tensor = tf.browser.fromPixels(video);
          const predictions = await model.executeAsync(tensor.expandDims(0));
          // Process and display predictions
          console.log(predictions);
        } catch (error) {
          console.error("Error during object detection:", error);
        }
      } else {
        console.log("Video dimensions are invalid.");
      }
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
