import React, { useState, useEffect } from "react";

export default function GlassClock(): React.JSX.Element {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer: number = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className=" p-4">
        <div className="text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent mb-1 font-mono tracking-wider">
            {formatTime(time)}
          </div>
          <div className="text-sm text-white/70 font-medium">
            {formatDate(time)}
          </div>
        </div>

        {/* Subtle pulse animation */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r animate-pulse"></div>
      </div>
    </div>
  );
}
