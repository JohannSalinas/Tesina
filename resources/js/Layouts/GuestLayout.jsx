import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gradient-to-r from-blue-500 via-teal-500 to-purple-500 pt-6 sm:justify-center sm:pt-0">
            <div>
                
            </div>

            <div className="mt-6 w-full max-w-md overflow-hidden bg-white px-6 py-4 shadow-lg sm:rounded-xl dark:bg-gray-800">
                {children}
            </div>
        </div>
    );
}