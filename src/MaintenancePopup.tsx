import React from "react";

const MaintenancePopup = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
      <div className="bg-white rounded-3xl p-8 max-w-md text-center shadow-xl">

        <div className="text-5xl mb-4">
          ⚠️
        </div>

        <h2 className="text-2xl font-bold mb-3">
          Website Access Suspended
        </h2>

        <p className="text-gray-600 mb-6">
         This website is currently undergoing final setup and activation. 
          Please complete the pending payment to activate the full website service. 
          <br /><br />
          Thank you for your understanding.
        </p>

        <button
          className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold"
          onClick={() => window.location.reload()}
        >
          Continue Browsing
        </button>

      </div>
    </div>
  );
};

export default MaintenancePopup;
