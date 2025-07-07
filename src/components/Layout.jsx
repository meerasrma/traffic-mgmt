import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
    const [systemStatus, setSystemStatus] = useState('operational');

    useEffect(() => {
        const interval = setInterval(() => {
            const statuses = ['operational', 'operational', 'warning'];
            setSystemStatus(statuses[Math.floor(Math.random() * statuses.length)]);
        }, 15000);
        return () => clearInterval(interval);

    }, []);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar - fixed height, non-scrollable */}
            <div className="w-64 h-screen flex-shrink-0 border-r border-gray-200 bg-white">
                <Sidebar />
            </div>

            {/* Main layout */}
            <div className="flex-1 flex flex-col min-w-0">
                <Header systemStatus={systemStatus} />

                <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
