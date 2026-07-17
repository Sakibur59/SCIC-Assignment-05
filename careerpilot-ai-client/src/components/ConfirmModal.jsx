'use client';

import { FaTimes, FaTrash } from 'react-icons/fa';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  icon = 'trash',
  loading = false
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (icon) {
      case 'trash':
        return <FaTrash className="text-4xl text-red-500" />;
      default:
        return <FaTrash className="text-4xl text-red-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Icon */}
        <div className="text-center mb-4">
          <div className={`w-20 h-20 bg-${icon === 'trash' ? 'red' : 'blue'}-50 rounded-full flex items-center justify-center mx-auto`}>
            {getIcon()}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-center text-sm mb-6">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 bg-${icon === 'trash' ? 'red' : 'blue'}-500 text-white rounded-lg hover:bg-${icon === 'trash' ? 'red' : 'blue'}-600 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50`}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;