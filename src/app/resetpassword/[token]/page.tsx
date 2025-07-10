'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import authService from '@/services/authService';

export default function ResetPasswordPage() {
  const { token } = useParams(); // Token from URL
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const res = await authService.resetPassword(token as string, password);
      alert(res.message || 'Password reset successful');
      router.push('/login');
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Password reset failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-purple-900 to-pink-700">
      <div className="bg-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md
                      backdrop-filter backdrop-blur-lg border border-white/20
                      transform transition-all duration-300 hover:scale-[1.05]">
        <h2 className="text-3xl font-extrabold text-center text-white mb-8">
          Reset Your Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              New Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full pl-4 pr-4 py-3 rounded-lg border border-white/30 bg-white/20
                         focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent
                         transition-all duration-200 text-white placeholder-gray-200"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Confirm Password:
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full pl-4 pr-4 py-3 rounded-lg border border-white/30 bg-white/20
                         focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent
                         transition-all duration-200 text-white placeholder-gray-200"
            />
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
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
