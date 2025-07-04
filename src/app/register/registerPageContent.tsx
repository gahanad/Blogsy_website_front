// frontend_next/app/register/RegisterPageContent.tsx

'use client'; // This directive marks this component as a Client Component.

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // For navigation in App Router
import Link from 'next/link';                 // For client-side navigation links
import authService from '@/services/authService';// Using relative path as per your preference

export default function RegisterPageContent() {
  // State to manage form input values
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '', // For password confirmation
  });

  // Destructure form data for easier access
  const { username, email, password, password2 } = formData;

  // Initialize Next.js router for programmatic navigation
  const router = useRouter();

  // Handle input changes (generic handler for all form fields)
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value, // Update the specific field by its 'name' attribute
    }));
  };

  // Handle form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior (page reload)

    // Basic client-side password matching validation
    if (password !== password2) {
      alert('Passwords do not match'); // Use a more sophisticated notification system (e.g., toast library) in a real app
      return; // Stop the submission process
    }

    // Prepare user data to send to the backend
    const userData = {
      username,
      email,
      password,
    };

    try {
      // Call the register service function
      await authService.register(userData);
      
      alert('Registration successful!'); // Use better notification
      router.push('/login'); // Redirect to the login page after successful registration
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Log the full error for debugging
      console.error('Registration error:', error.response?.data || error.message);
      // Display a user-friendly error message from the backend, or a generic one
      alert(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    // Outer container with your desired full-page gradient background
    <div className="min-h-screen flex items-center justify-center p-4
                    gradient-custom-bg-multi">
      {/* Centered form container with blur and transparency (glassmorphism) */}
      <div className="bg-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md
                      backdrop-filter backdrop-blur-lg border border-white/20
                      transform transition-all duration-300 hover:scale-[1.1]">

        <h2 className="text-4xl font-extrabold text-center text-white mb-8 tracking-tight">
          Register Account
        </h2>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Username Input */}
          <div>
            <label htmlFor="username" className="block text-white text-sm font-semibold mb-2">
              Username:
            </label>
            <div className="relative"> {/* For icon positioning */}
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={onChange}
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/30 bg-white/20
                           focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent
                           transition-all duration-200 text-white placeholder-gray-200"
                placeholder="Choose a username"
              />
              {/* Icon for Username */}
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
                👤 {/* User icon placeholder */}
              </span>
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-white text-sm font-semibold mb-2">
              Email:
            </label>
            <div className="relative"> {/* For icon positioning */}
              <input
                type="email"
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
                📧 {/* Email icon placeholder */}
              </span>
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-white text-sm font-semibold mb-2">
              Password:
            </label>
            <div className="relative"> {/* For icon positioning */}
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
                🔒 {/* Lock icon placeholder */}
              </span>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="password2" className="block text-white text-sm font-semibold mb-2">
              Confirm Password:
            </label>
            <div className="relative"> {/* For icon positioning */}
              <input
                type="password"
                id="password2"
                name="password2"
                value={password2}
                onChange={onChange}
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/30 bg-white/20
                           focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent
                           transition-all duration-200 text-white placeholder-gray-200"
                placeholder="••••••••"
              />
              {/* Icon for Confirm Password (e.g., a lock with a checkmark) */}
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
                ✅ {/* Using checkmark lock as placeholder */}
              </span>
            </div>
          </div>

          {/* Register Button with Gradient */}
          <button
            type="submit"
            className="w-full text-white font-bold py-3 px-6 rounded-lg text-lg
                       bg-gradient-to-r from-pink-600 to-purple-500
                       hover:from-purple-700 hover:to-pink-600
                       focus:outline-none focus:ring-4 focus:ring-purple-300
                       transition-all duration-300 transform hover:scale-[1.02]
                       shadow-lg hover:shadow-xl"
          >
            Register
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-8 text-center text-white text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-white font-semibold hover:underline
                                          hover:text-purple-300 transition-colors duration-200">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}