import React, { useState, useEffect } from 'react';
import { ToastMessage } from '../../types';

interface ToastProps {
    message: string;
    type: ToastMessage['type'];
    onClose: () => void;
}

const toastStyles = {
    success: { bg: 'bg-green-600', icon: '✅' },
    error: { bg: 'bg-red-600', icon: '❌' },
    info: { bg: 'bg-blue-600', icon: 'ℹ️' },
};

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300); // Allow for fade-out animation
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    const style = toastStyles[type];

    return (
        <div 
            className={`flex items-center p-4 rounded-lg text-white shadow-lg transition-all duration-300 ${style.bg} ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}
        >
            <span className="mr-3 text-xl">{style.icon}</span>
            <p className="flex-grow">{message}</p>
            <button onClick={handleClose} className="ml-4 text-white font-bold">&times;</button>
        </div>
    );
};

export default Toast;
