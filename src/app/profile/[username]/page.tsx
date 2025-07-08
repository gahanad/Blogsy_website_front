// app/profile/[userIdentifier]/page.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import userService from '@/services/userService'; // Assuming you have this
import messageService from '@/services/messageService'; // NEW: Your message service
import authService from '@/services/authService'; // To get current user ID/info
import Link from 'next/link';
import {UserProfile} from "@/app/types/message";

// Assuming User interface is similar to DashboardPage
interface User {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
    bio: string;
    followers: string[];
    following: string[];
    postsCount: number;
}

export default function UserProfilePage() {
    const params = useParams();
    console.log("Raw params from useParams():", params); 
     // Could be username or ID
    const router = useRouter();
    // To check if userIdentifier is present or not
    // const userIdentifier = params.username as string;
    const [profileUser, setProfileUser] = useState<User | null>(null); // The user whose profile is being viewed
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null); // The logged-in user
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                // Fetch the profile of the user being viewed
                const userIdentifier = params.username as string;
                const profile = await userService.getUserByUsername(userIdentifier); // Assuming this function exists
                setProfileUser(profile);

                // Fetch the current logged-in user's profile (needed for messaging/follow logic)
                const loggedInUser = await authService.getCurrentUser();
                if(loggedInUser){
                  setCurrentUser(loggedInUser.user);
                } // Assuming this function returns current user
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                console.error('Failed to fetch user profile:', err);
                setError('Failed to load profile. Please try again.');
                if (err.response?.status === 401) {
                    authService.logout();
                    router.push('/login');
                } else if (err.response?.status === 404) {
                    setError('User not found.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [params.username, router]); // Re-fetch if userIdentifier changes

    // ---- NEW: Handle initiating a conversation ----
    const handleStartConversation = useCallback(async () => {
        if (!currentUser || !profileUser || currentUser._id === profileUser._id) {
            // Prevent messaging self or if user data is missing
            return;
        }

        try {
            // Call the createConversationAndSendMessage API
            // The `content` here is the *first* message in the conversation.
            // You might make this an empty string or a default "Hello!"
            // Or you could open a small modal to ask for the first message content.
            const firstMessageContent = "Hello!"; // Or prompt user
            const response = await messageService.createConversationAndSendMessage(
                profileUser._id, // The recipient is the user whose profile you are viewing
                firstMessageContent
            );

            // If successful, navigate to the newly created/found conversation's page
            router.push(`/messages/${response.conversationId}`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error('Error starting conversation:', err);
            alert(err.response?.data?.message || 'Failed to start conversation.');
        }
    }, [currentUser, profileUser, router]);

    if (loading) return <div className="p-6 text-center">Loading profile...</div>;
    if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;
    if (!profileUser) return <div className="p-6 text-center">Profile data not available.</div>;

    return (
        <div className="min-h-screen w-full p-4 pt-30 gradient-custom-bg-multi4 "> {/* Add pt-20 for header */}
            <h1 className="text-3xl font-bold mb-6 text-center text-white">User Profile: {profileUser.username}</h1>

            <div className="bg-white/10 rounded-xl p-7 border border-transparent h-full w-full max-w-[95%] sm:max-w-2xl md:max-w-3xl lg:max-w-5xl mx-auto flex flex-col items-center backdrop:filter backdrop-blur()  glowing-border">

                <Image
                    src={profileUser.avatar || '/images/Logo_enter.png'}
                    alt={profileUser.username}
                    width={120}
                    height={120}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mb-4"
                />
                <h2 className="text-2xl font-semibold text-white mb-2">{profileUser.username}</h2>
                <p className="text-white mb-4">{profileUser.bio || 'No bio provided.'}</p>

                <div className="flex space-x-6 text-white mb-6">
                    <div className="text-center">
                        <span className="block font-bold">{profileUser.postsCount || 0}</span>
                        <span className="text-sm">Posts</span>
                    </div>
                    <div className="text-center">
                        <span className="block font-bold">{profileUser.followers?.length || 0}</span>
                        <span className="text-sm">Followers</span>
                    </div>
                    <div className="text-center">
                        <span className="block font-bold">{profileUser.following?.length || 0}</span>
                        <span className="text-sm">Following</span>
                    </div>
                </div>

                {/* Action Buttons: Follow/Unfollow, Message */}
                <div className="flex space-x-4">
                    {/* Assuming you have follow/unfollow logic */}
                    {currentUser && currentUser._id !== profileUser._id && (
                        <>
                            {/* <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                                {profileUser.followers.includes(currentUser._id) ? 'Unfollow' : 'Follow'}
                            </button> */}

                            {/* NEW: Message Button */}
                            <button
                                onClick={handleStartConversation}
                                className="bg-gray-100 text-black px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                            >
                                Message
                            </button>
                        </>
                    )}
                    {/* Optionally, if it's the current user's profile */}
                    {currentUser && currentUser._id === profileUser._id && (
                         <Link href="/settings" className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold px-6 py-2 rounded-lg
                                            hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-purple-300
                                            transition-all duration-300 shadow-md">
                            Edit Profile
                        </Link>
                    )}
                </div>

                {/* You might display the user's posts here as well */}
                <section className="mt-8 w-full">
                    <h3 className="text-xl font-semibold text-white mb-4">Posts by {profileUser.username}</h3>
                    {/* Add logic to fetch and display posts by this user */}
                    {/* Example:
                    {profileUser.posts && profileUser.posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {profileUser.posts.map(post => (
                                <div key={post._id} className="bg-gray-50 p-4 rounded-lg shadow">
                                    <h4 className="font-bold">{post.title}</h4>
                                    <p className="text-sm text-gray-700">{post.caption}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No posts yet.</p>
                    )}
                    */}
                </section>
            </div>
        </div>
    );
}
