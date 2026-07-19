'use client';

import { FaTrash, FaTimes, FaSpinner } from 'react-icons/fa';

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Resume',
  message = 'Are you sure you want to delete this resume? This action cannot be undone.',
  loading = false,
  itemName = '',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          disabled={loading}
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Icon */}
        <div className="text-center mb-4">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <FaTrash className="text-4xl text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-center text-sm mb-2">
          {message}
        </p>

        {/* Item Name Highlight */}
        {itemName && (
          <div className="bg-gray-50 rounded-lg p-3 mb-6 text-center">
            <p className="text-sm font-medium text-gray-700">
              "<span className="text-red-600">{itemName}</span>"
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <FaTrash className="text-sm" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>

      {/* Animation CSS */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default DeleteModal;