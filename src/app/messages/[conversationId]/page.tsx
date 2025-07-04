// app/messages/[conversationId]/page.tsx
'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import messageService from '@/services/messageService';
import authService from '@/services/authService';
import {Message, UserProfile} from "@/app/types/message";



export default function ConversationMessagesPage() {
    const params = useParams();
    const conversationId = params.conversationId as string;
    const router = useRouter();

    const [newmessages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newMessageContent, setNewMessageContent] = useState('');
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null); // To check current user for message styling
    // const [conversationId, setconversationId] = 

    const messagesEndRef = useRef<HTMLDivElement>(null); // For auto-scrolling to bottom

    // Fetch messages for the conversation
    useEffect(() => {
        const fetchAndMarkRead = async () => {
            try {
                setLoading(true);
                // Fetch messages
                const response = await messageService.getConversationMessages(conversationId);
                setMessages(response.messages);

                // Assuming you have current user details, mark messages as read
                if (localStorage.getItem('userId')) { // Use localStorage for current user ID for now
                    await messageService.markMessagesAsRead(conversationId);
                }
            } catch (err: any) {
                console.error('Failed to fetch messages or mark as read:', err);
                setError('Failed to load messages. Please try again.');
                if (err.response?.status === 401) {
                    authService.logout();
                    router.push('/login');
                } else if (err.response?.status === 403 || err.response?.status === 404) {
                    // Not authorized or conversation not found
                    router.push('/messages'); // Redirect back to conversations list
                }
            } finally {
                setLoading(false);
            }
        };

        const fetchCurrentUser = async () => {
            try {
                const userProfile = await authService.getCurrentUser(); // Assuming you have a way to get the logged-in user profile
                if(userProfile){
                    setCurrentUser(userProfile.user);
                }
            } catch (err) {
                console.error("Failed to fetch current user profile:", err);
            }
        };

        fetchCurrentUser();
        if (conversationId) { // Only fetch if conversationId is available
            fetchAndMarkRead();
        }
    }, [conversationId, router]);

    // Scroll to the latest message whenever messages load or change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [newmessages]);


    const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageContent.trim() || !conversationId || !currentUser) return;

    try {
        const response = await messageService.sendMessage(conversationId, newMessageContent);

        setMessages(prev => [...prev, response.message]); // Add new message to state
        setNewMessageContent('');
    } catch (err: any) {
        console.error('Failed to send message:', err);
        alert(err.response?.data?.message || 'Failed to send message.');
    }
    }, [newMessageContent, conversationId, currentUser]);


    if (loading) return <div className="p-6 text-center">Loading messages...</div>;
    if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

    // Determine the other participant's name/avatar for the header
    const otherParticipant = newmessages.length > 0
        ? newmessages[0].sender._id === currentUser?._id
            ? newmessages[0].sender // This would be incorrect, need the other participant from the conversation details
            : newmessages[0].sender // This assumes the first message sender is always the other party
        : null; // This logic needs to be based on the conversation participants, not just the first message

    // Better way to find other participant for header (needs conversation data, not just messages)
    // You might need to fetch the conversation details separately, or pass them from the conversations page.
    // For now, let's use a placeholder or assume you'll refine this.

    // To properly get the other participant's details for the header,
    // you would ideally fetch the specific conversation details here:
    // const [conversationDetails, setConversationDetails] = useState<Conversation | null>(null);
    // ... fetch it using messageService.getConversationDetails(conversationId) if you add that endpoint ...
    // const otherParticipantInHeader = conversationDetails?.participants.find(p => p._id !== currentUser?._id);


    return (
        <div className="flex flex-col h-screen bg-gray-50 pt-20"> {/* Padding for fixed header */}
            {/* Conversation Header */}
            <div className="fixed top-0 left-0 w-full bg-white shadow-sm p-4 z-10 flex items-center border-b border-gray-200">
                <button onClick={() => router.back()} className="mr-4 text-gray-600 hover:text-purple-600">← Back</button>
                {/* You need to pass the other participant's details to this page, or fetch them */}
                <Image
                    src={otherParticipant?.profilePicture || '/images/Logo_enter.png'} // Placeholder for now
                    alt={otherParticipant?.username || 'User'}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <h2 className="text-xl font-semibold text-gray-800">{otherParticipant?.username || 'Conversation'}</h2>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pt-16"> {/* Add padding for header */}
                {newmessages.length === 0 ? (
                    <p className="text-center text-gray-500">Start the conversation!</p>
                ) : (
                    newmessages.map(msg => (
                        <div
                            key={msg._id}
                            className={`flex ${msg.sender._id === currentUser?._id ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex items-end max-w-[70%] ${msg.sender._id === currentUser?._id ? 'flex-row-reverse' : 'flex-row'}`}>
                                <Image
                                    src={msg.sender.profilePicture || '/images/Logo_enter.png'}
                                    alt={msg.sender.username}
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 rounded-full object-cover mx-2"
                                />
                                <div className={`p-3 rounded-xl ${
                                    msg.sender._id === currentUser?._id
                                        ? 'bg-purple-600 text-white rounded-br-none'
                                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                }`}>
                                    <p className="font-medium text-sm">{msg.sender.username}</p>
                                    <p>{msg.content}</p>
                                    <span className="block text-xs mt-1 opacity-75 text-right">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} /> {/* For auto-scrolling */}
            </div>

            {/* Message Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 flex items-center">
                <textarea
                    className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
                    rows={1}
                    placeholder="Type your message..."
                    value={newMessageContent}
                    onChange={(e) => setNewMessageContent(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                        }
                    }}
                />
                <button
                    type="submit"
                    className="ml-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold px-6 py-3 rounded-lg
                               hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-purple-300
                               transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!newMessageContent.trim()}
                >
                    Send
                </button>
            </form>
        </div>
    );
}