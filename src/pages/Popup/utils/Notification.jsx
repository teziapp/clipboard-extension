import { AlertCircle, CircleCheck, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSnippets } from "../SnippetContext";

export function Notification() {
    const { notificationState, setNotificationState } = useSnippets();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (notificationState.show) {
            // Reset animation before starting
            setIsVisible(false);

            // Delay to trigger reflow (ensures animation works)
            const delay = setTimeout(() => setIsVisible(true), 50);

            if (notificationState.duration) {
                const timer = setTimeout(() => closeNotification(), notificationState.duration);
                return () => {
                    clearTimeout(timer);
                    clearTimeout(delay);
                };
            }

            return () => clearTimeout(delay);
        }
    }, [notificationState.show, notificationState.duration]);

    const closeNotification = () => {
        setIsVisible(false);
        setTimeout(() => setNotificationState({ show: false }), 300); // Wait for animation to finish
    };

    if (!notificationState.show && !isVisible) return null;

    return (
        <div
            className={`fixed top-5 left-1/2 transform -translate-x-1/2 w-64 bg-gray-200 text-gray-800 text-sm rounded-lg shadow-lg px-4 py-3 flex items-center justify-between
                transition-all duration-300 ease-in-out ${isVisible ? "opacity-100 translate-y-2" : "opacity-0 -translate-y-5"}
            `}
        >
            {/* Close Button */}
            <button onClick={closeNotification} className="absolute right-0 top-0 p-1 rounded-full text-gray-600 hover:bg-gray-300 transition">
                <X size={13} />
            </button>

            {notificationState.type === "warning" && <AlertCircle size={18} className="mr-2 text-gray-700" />}
            {notificationState.type === "success" && <CircleCheck size={18} className="mr-2 text-green-700" />}
            {notificationState.type === "failure" && <AlertCircle size={18} className="mr-2 text-red-700" />}

            <span className="flex-1 text-left text-xs font-semibold">{notificationState.text}</span>

            {notificationState.action && (
                <button onClick={notificationState.doAction} className="px-2 py-2 rounded-md font-medium transition duration-200 bg-gray-700 hover:bg-gray-800 text-white">
                    {notificationState.action}
                </button>
            )}
        </div>
    );
}
