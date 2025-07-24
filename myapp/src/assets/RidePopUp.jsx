import React from "react";

export default function RidePopUp({ ride, onClose }) {
  if (!ride) return null; // Don't render if no ride

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      aria-modal="true"
      role="dialog"
    >
      <div
        style={{
          position: "relative",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "600px",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            fontSize: "28px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#333",
            lineHeight: "1",
          }}
        >
          &times;
        </button>

        <h2 style={{ marginTop: 0 }}>Ride Details</h2>
        <p><strong>From:</strong> {ride.from}</p>
        <p><strong>To:</strong> {ride.to}</p>
        <p><strong>Date:</strong> {new Date(ride.rideDate).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
