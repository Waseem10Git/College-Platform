import React, { useEffect, useRef, useState } from "react";
import useIsTab from "../../hooks/useIsTab";
import useIsMobile from "../../hooks/useIsMobile";
import { useLoading, Bars } from "@agney/react-loading"; // Import Bars loader

const WaitingToJoinScreen = () => {
  const waitingMessages = [
    { index: 0, text: "" },
    { index: 1, text: "" },
  ];
  const [message, setMessage] = useState(waitingMessages[0]);

  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setMessage((s) =>
        s.index === waitingMessages.length - 1
          ? s
          : waitingMessages[s.index + 1]
      );
    }, 3000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  const isTab = useIsTab();
  const isMobile = useIsMobile();

  // Use Bars loader from @agney/react-loading
  const { containerProps, indicatorEl } = useLoading({
    loading: true,
    indicator: <Bars width="50" height="50" color="white" />, // Customize loader here
  });

  return (
    <div
      className="bg-gray-800"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div className="flex flex-col">
        <div {...containerProps}>
          {" "}
          {/* Apply container props from useLoading */}
          {indicatorEl} {/* Render loader */}
        </div>
        <h1 className="text-white text-center font-bold mt-1 text-xl">
          {message.text}
        </h1>
      </div>
    </div>
  );
};

export default WaitingToJoinScreen;
