import { useEffect, useState } from "react";

function formatTime(date: Date) {
  return [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

function Clock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <time className="hidden sm:block" dateTime={currentTime.toISOString()}>
      {formatTime(currentTime)}
    </time>
  );
}

export default Clock;
