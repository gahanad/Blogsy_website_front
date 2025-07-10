// frontend_next/app/forgotpassword/page.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import authService from '@/services/authService';

export default function ForgotPasswordPageContent() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const response = await authService.forgotPassword(email);
        alert(response.message); // Show message from backend
        router.push('/login');   // Redirect to login
    } catch (error: any) {
        console.error('Forgot password error:', error);
        alert(error.response?.data?.message || 'Failed to send reset link');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-custom-bg-multi">
      <div className="bg-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md
                      backdrop-filter backdrop-blur-lg border border-white/20
                      transform transition-all duration-300 hover:scale-[1.05]">

        <h2 className="text-3xl font-extrabold text-center text-white mb-8">
          Forgot Password
        </h2>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-white text-sm font-semibold mb-2">
              Enter your registered email:
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/30 bg-white/20
                           focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent
                           transition-all duration-200 text-white placeholder-gray-200"
                placeholder="your.email@example.com"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">📧</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full text-white font-bold py-3 px-6 rounded-lg text-lg
                       bg-gradient-to-r from-pink-600 to-purple-500
                       hover:from-purple-700 hover:to-pink-600
                       focus:outline-none focus:ring-4 focus:ring-purple-300
                       transition-all duration-300 transform hover:scale-[1.02]
                       shadow-lg hover:shadow-xl"
          >
            Send Reset Link
          </button>
        </form>

        <p className="mt-6 text-center text-white text-sm">
          Remember your password?{' '}
          <Link href="/login" className="text-white font-semibold hover:underline hover:text-purple-300">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
