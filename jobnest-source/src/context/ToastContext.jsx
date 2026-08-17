import { createContext, useCallback, useContext, useRef, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "success", duration = 3500) => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-stack">
        {toasts.map((t) => (
          <div key={t.id} className={`app-toast app-toast-${t.type}`} role="alert">
            <span className="app-toast-icon">
              {t.type === "success" && <i className="bi bi-check-circle-fill" />}
              {t.type === "error" && <i className="bi bi-x-circle-fill" />}
              {t.type === "info" && <i className="bi bi-info-circle-fill" />}
              {t.type === "warning" && <i className="bi bi-exclamation-triangle-fill" />}
            </span>
            <span className="app-toast-msg">{t.message}</span>
            <button className="app-toast-close" onClick={() => removeToast(t.id)}>
              <i className="bi bi-x" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
