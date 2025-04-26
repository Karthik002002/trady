import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message) => {
    const id = toastId++;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const toast = {
    success: (msg) => addToast("success", msg),
    error: (msg) => addToast("error", msg),
    custom: (msg) => addToast("custom", msg),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-5 right-5 space-y-2 z-[1009050]">
        {toasts.map(({ id, type, message }) => (
          <div
            key={id}
            className={`rounded-md px-4 py-2 text-white shadow-lg transition-all
              ${type === "success" && "bg-green-500"}
              ${type === "error" && "bg-red-500"}
              ${type === "custom" && "bg-blue-500"}`}
          >
            {message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
