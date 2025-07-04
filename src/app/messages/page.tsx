// app/messages/page.tsx
'use client';

import React from 'react'; // Only React is needed, no useState, useEffect, etc. for a static page
import Link from 'next/link'; // Still useful if you want to link back to home or profile

// You don't need these interfaces if you're not displaying conversations yet
// interface UserProfile { /* ... */ }
// interface Message { /* ... */ }
// interface Conversation { /* ... */ }

export default function ConversationsPage() {
    // No state, effects, or services needed if it's just a placeholder

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 pt-20 px-4">
            <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-200 max-w-md w-full">
                <h1 className="text-4xl font-extrabold text-purple-700 mb-4">
                    Messages
                </h1>
                <p className="text-xl text-gray-700 mb-6">
                    This feature is currently
                    <br />
                    <span className="font-bold text-red-500">Under Construction!</span>
                </p>
                <p className="text-gray-600 mb-8">
                    We're diligently working to bring you the best messaging experience.
                    Please check back soon!
                </p>
                <Link href="/dashboard" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200">
                    Go to Home
                    <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}