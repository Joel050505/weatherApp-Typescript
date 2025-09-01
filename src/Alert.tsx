import { useState } from "react";

export default function AlertBox({ message = "Please enter a city" }) {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl shadow-lg">
        <span className="font-medium">{message}</span>
        <button
          onClick={() => setShow(false)}
          className="ml-2 text-sm font-bold text-red-600 hover:text-red-800"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
