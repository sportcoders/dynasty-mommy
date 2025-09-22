import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface StatusIndicatorProps {
    status: 'online' | 'offline' | 'warning';
    text: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, text }) => {
    const getIcon = () => {
        switch (status) {
            case 'online':
                return <CheckCircle className="w-4 h-4 text-green-400" />;
            case 'offline':
                return <XCircle className="w-4 h-4 text-red-400" />;
            case 'warning':
                return <AlertCircle className="w-4 h-4 text-yellow-400" />;
        }
    };

    const getTextColor = () => {
        switch (status) {
            case 'online':
                return 'text-green-400';
            case 'offline':
                return 'text-red-400';
            case 'warning':
                return 'text-yellow-400';
        }
    };

    return (
        <div className="flex items-center gap-2">
            {getIcon()}
            <span className={getTextColor()}>{text}</span>
        </div>
    );
};