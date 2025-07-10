'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import authService from '@/services/authService'; // Adjust path if necessary

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '', // Reverting to 'email' as per your initial login form
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await authService.login(formData);
      router.push('/dashboard');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Login Error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Login failed!'); //
    }
  };

  return (
    // Outer container with your desired full-page gradient background
    <div className="min-h-screen flex items-center justify-center p-4
                    gradient-custom-bg-multi2"> {/* background */}
      {/* Centered form container with blur and transparency (glassmorphism) */}
      <div className="bg-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md
                      backdrop-filter backdrop-blur-lg border border-white/20
                      transform transition-all duration-300 hover:scale-[1.05]"> {/* Glassmorphism effect */}

        <h1 className="text-4xl font-extrabold text-center text-white mb-8 tracking-tight">
          Welcome Back!
        </h1>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-white text-sm font-semibold mb-2">
              Email:
            </label>
            <div className="relative">
              <input
                type="email" // Changed back to email
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/30 bg-white/20
                           focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent
                           transition-all duration-200 text-white placeholder-gray-200"
                placeholder="your.email@example.com"
              />
              {/* Icon for Email */}
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
                📧 {/* Using an email icon placeholder */}
              </span>
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-white text-sm font-semibold mb-2">
              Password:
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/30 bg-white/20
                           focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent
                           transition-all duration-200 text-white placeholder-gray-200"
                placeholder="••••••••"
              />
              {/* Icon for Password */}
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
                🔒
              </span>
            </div>
          </div>

          {/* Remember Me / Forgot Password - Optional, added as per previous glassmorphism example */}
          <div className="flex justify-between items-center text-sm">
            <Link href="/forgotpassword" className="text-white hover:underline hover:text-purple-300 transition-colors duration-200 mr-0">
              Forgot password?
            </Link>
          </div>

          {/* Login Button with Gradient (from your attractive design) */}
          <button
            type="submit"
            className="w-full text-white font-bold py-3 px-6 rounded-lg text-lg
                       bg-gradient-to-r from-pink-600 to-purple-500
                       hover:from-purple-700 hover:to-pink-600
                       focus:outline-none focus:ring-4 focus:ring-purple-300
                       transition-all duration-300 transform hover:scale-[1.02]
                       shadow-lg hover:shadow-xl"
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-8 text-center text-white text-sm">
          Don$apos;t have an account?{' '}
          <Link href="/register" className="text-white font-semibold hover:underline
                                          hover:text-purple-300 transition-colors duration-200">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}