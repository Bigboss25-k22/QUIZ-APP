import React from "react";

/**
 * Popup Notification component for showing success and error messages in center screen.
 * @param {Object} props
 * @param {string} props.message - The message to display
 * @param {('success'|'error'|'info')} props.type - Type of notification
 * @param {function} [props.onClose] - Optional close handler
 */
export default function Notification({ message, type = "info", onClose, className = "" }) {
  if (!message) return null;
  let color = "";
  let icon = null;
  switch (type) {
    case "success":
      color = "bg-green-100 border-green-400 text-green-700";
      icon = (
        <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
      );
      break;
    case "error":
      color = "bg-red-100 border-red-400 text-red-700";
      icon = (
        <svg className="w-6 h-6 mr-2 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      );
      break;
    default:
      color = "bg-blue-100 border-blue-400 text-blue-700";
      icon = (
        <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" /></svg>
      );
  }
  // Toast ở góc phải trên màn hình
  return (
    <div className={`fixed top-6 right-6 z-50 min-w-[260px] max-w-xs flex items-center px-4 py-3 border-l-4 rounded-xl shadow-lg ${color} animate-fade-in-up ${className}`} role="alert">
      {icon}
      <span className="flex-1 text-base font-medium">{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-3 text-xl font-bold text-gray-400 hover:text-gray-700">&times;</button>
      )}
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp .3s cubic-bezier(.39,.575,.565,1) both;
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
