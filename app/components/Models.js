import React from "react";
import ModelCard from "./modelComponents/ModelCard";

function Models() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-20 p-4">
      <ModelCard />
      <ModelCard />
      <ModelCard />
      <ModelCard />
    </div>
  );
}

export default Models;
