// app/settings/page.tsx
'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import userService from '@/services/userService';
import authService from '@/services/authService';
import { User } from '@/app/types/message'; // Import your User interface
import Image from 'next/image';

export default function SettingsPage() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(''); // If you allow email change
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState(''); // For current avatar display
    const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null); // For new avatar upload
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const user = await userService.getCurrentUserProfile();
                setCurrentUser(user);
                setUsername(user.username);
                setEmail(user.email); // Set initial email
                setBio(user.bio || ''); // Ensure bio is not undefined
                setAvatar(user.avatar || '/images/Logo_enter.png'); // Set initial avatar
            } catch (err: any) {
                console.error('Failed to fetch user profile for settings:', err);
                setError(err.response?.data?.message || 'Failed to load profile data.');
                if (err.response?.status === 401) {
                    authService.logout();
                    router.push('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [router]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewAvatarFile(e.target.files[0]);
            // Optional: Display a preview of the new image
            const reader = new FileReader();
            reader.onload = (event) => {
                setAvatar(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            // Append fields only if they have changed or are being set
            if (username !== currentUser?.username) {
                formData.append('username', username);
            }
            if (email !== currentUser?.email) { // If email is editable
                formData.append('email', email);
            }
            if (bio !== currentUser?.bio) {
                formData.append('bio', bio);
            }
            if (newAvatarFile) {
                formData.append('profilePicture', newAvatarFile); // 'profilePicture' is the field name your backend expects for file upload
            }

            // Note: For file uploads, it's often a separate endpoint or a FormData submission.
            // If `updateUserProfile` (PUT /users/me) expects JSON, you'll need a separate
            // `uploadProfilePicture` call for the file, then update the avatar URL via `updateUserProfile`.
            // The current `updateUserProfile` in userService.ts expects JSON, so for file upload,
            // we'd typically use `userService.uploadProfilePicture(newAvatarFile)`.

            // For now, let's assume you're sending JSON (no file upload in this specific call)
            // If profile picture upload is separate, remove `if (newAvatarFile)` from here.
            const updatePayload: Partial<User> = {
                username: username,
                // email: email, // Uncomment if email is editable
                bio: bio,
                // avatar: avatar, // Only if you're sending a URL, not a file
            };

            // Call the service to update profile
            const updatedUser = await userService.updateUserProfile(updatePayload);

            // Handle avatar file upload separately if your backend requires it (recommended pattern)
            // if (newAvatarFile) {
            //     await userService.uploadProfilePicture(newAvatarFile); // Assuming this function exists in userService
            // }


            setCurrentUser(updatedUser); // Update local state with new data
            setUsername(updatedUser.username); // Re-set state from updated user for consistency
            setBio(updatedUser.bio || '');
            setAvatar(updatedUser.avatar || '/images/Logo_enter.png'); // Update avatar state

            setSuccessMessage('Profile updated successfully!');
            // Optional: router.push(`/profile/${updatedUser.username}`); // Redirect to profile page
        } catch (err: any) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="p-6 text-center pt-20">Loading profile settings...</div>;
    if (error && !currentUser) return <div className="p-6 text-red-500 text-center pt-20">{error}</div>;
    if (!currentUser) return <div className="p-6 text-center pt-20">No user data available. Please log in.</div>;

    return (
        <div className="container mx-auto p-4 pt-20">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Edit Profile</h1>

            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200 max-w-xl mx-auto">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center mb-6">
                        <Image
                            src={avatar}
                            alt="Profile Avatar"
                            width={150}
                            height={150}
                            className="w-36 h-36 rounded-full object-cover border-4 border-purple-500 shadow-lg mb-4"
                        />
                        <label htmlFor="avatar-upload" className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
                            Change Avatar
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>

                    {/* Username Field */}
                    <div>
                        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-purple-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    {/* Email Field (Optional, uncomment if you want to allow email change) */}
                    {/*
                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-purple-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    */}

                    {/* Bio Field */}
                    <div>
                        <label htmlFor="bio" className="block text-gray-700 text-sm font-bold mb-2">
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            maxLength={160} // Common bio length limit
                        />
                        <p className="text-xs text-gray-500 mt-1">{bio.length}/160 characters</p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}