import React from "react";
import ObjectDetection from "@/components/ObjectDetection";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 w-screen">
      <ObjectDetection />
    </div>
  );
};

export default Home;
