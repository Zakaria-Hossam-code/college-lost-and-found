import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export const ToastContainer = () => {
  const { toasts, removeToast } = useNotification();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`toast ${isSuccess ? 'toast-success' : isError ? 'toast-error' : 'toast-info'}`}
          >
            {isSuccess && <CheckCircle2 size={18} style={{ flexShrink: 0 }} />}
            {isError && <AlertCircle size={18} style={{ flexShrink: 0 }} />}
            {!isSuccess && !isError && <Info size={18} style={{ flexShrink: 0 }} />}

            <span style={{ flex: 1 }}>{toast.message}</span>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              style={{ color: '#ffffff', opacity: 0.8, cursor: 'pointer', padding: '2px' }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
