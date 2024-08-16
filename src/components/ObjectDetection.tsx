// components/WebcamCapture.js"use client"
import React, { useRef, useEffect } from "react";

const WebcamCapture = ({ onFrame }: { onFrame: any }) => {
  const videoRef = useRef<any>();

  useEffect(() => {
    const initWebcam = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    };

    initWebcam();

    const frame = () => {
      if (videoRef.current) {
        onFrame(videoRef.current);
      }
      requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track: any) => track.stop());
      }
    };
  }, [onFrame]);

  return <video ref={videoRef} style={{ width: "100%" }} />;
};

export default WebcamCapture;
