import React from 'react';
import ReactDOM from 'react-dom';
import { useToast } from '../contexts/ToastContext';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ToastMessage: React.FC<{ toast: import('../types').Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
    const icons = {
        success: <CheckCircle className="text-green-500" />,
        error: <XCircle className="text-red-500" />,
        info: <Info className="text-blue-500" />,
    };

    const bgColors = {
        success: 'bg-green-800/90 border-green-600',
        error: 'bg-red-800/90 border-red-600',
        info: 'bg-blue-800/90 border-blue-600',
    }

    return (
        <div className={`flex items-start gap-4 w-full max-w-sm p-4 text-white rounded-lg shadow-lg border-l-4 ${bgColors[toast.type]} backdrop-blur-sm animate-fade-in`}>
            <div className="flex-shrink-0 mt-1">{icons[toast.type]}</div>
            <p className="flex-grow">{toast.message}</p>
            <button onClick={() => onRemove(toast.id)} className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-white/10">
                <X size={18} />
            </button>
        </div>
    );
};


const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();
    const toastRoot = document.getElementById('toast-root');

    if (!toastRoot) return null;

    return ReactDOM.createPortal(
        <div className="fixed top-4 right-4 z-[100] space-y-3">
            {toasts.map(toast => (
                <ToastMessage key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>,
        toastRoot
    );
};

export default ToastContainer;
