import React from "react";

function DeployModeSelector({ deployMode, setDeployMode }) {
  return (
    <div className="flex justify-center mb-4">
      <label className="mr-4">
        <input
          type="radio"
          value="url"
          checked={deployMode === "url"}
          onChange={() => setDeployMode("url")}
        />
        Deploy by URL
      </label>
      <label>
        <input
          type="radio"
          value="custom"
          checked={deployMode === "custom"}
          onChange={() => setDeployMode("custom")}
        />
        Partial Deploy
      </label>
    </div>
  );
}

export default DeployModeSelector;
