import React from "react";
import { useNotification } from "@hooks/useNotification";

const MyComponent: React.FC = () => {
  const { showSuccess, showError, showInfo, showWarning, showNotification } =
    useNotification();

  return (
    <div>
      <button onClick={() => showSuccess("Success! Operation completed.")}>
        Show Success
      </button>
      <button onClick={() => showError("Error! Something went wrong.")}>
        Show Error
      </button>
      <button onClick={() => showInfo("Info: This is some information.")}>
        Show Info
      </button>
      <button onClick={() => showWarning("Warning! Check your input.")}>
        Show Warning
      </button>
      <button onClick={() => showNotification("Default notification")}>
        Show Default
      </button>
    </div>
  );
};

export default MyComponent;
