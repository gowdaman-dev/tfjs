"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import Webcam from "react-webcam";

const ObjectDetection: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
    };

    loadModel();
  }, []);

  const detectObjects = useCallback(async () => {
    if (webcamRef.current && model) {
      const video = webcamRef.current.video;
      if (video && video.readyState === 4) {
        const predictions = await model.detect(video);
        drawPredictions(predictions);
      }
    }
  }, [model]);

  const drawPredictions = (predictions: cocoSsd.DetectedObject[]) => {
    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;
    if (canvas && video) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        predictions.forEach((prediction) => {
          ctx.beginPath();
          ctx.rect(...prediction.bbox);
          ctx.lineWidth = 1;
          ctx.strokeStyle = "red";
          ctx.fillStyle = "red";
          ctx.stroke();
          ctx.fillText(
            prediction.class,
            prediction.bbox[0],
            prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10,
          );
        });
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(detectObjects, 10);
    return () => clearInterval(interval);
  }, [detectObjects]);

  return (
    <div className="flex justify-center items-center max-h-screen w-full bg-gray-100">
      <Webcam ref={webcamRef} audio={false} width="600" height="450" />
      <canvas ref={canvasRef} width="600" height="450" />
    </div>
  );
};

export default ObjectDetection;
