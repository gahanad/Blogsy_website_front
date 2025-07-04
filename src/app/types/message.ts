// src/types/message.ts

export interface UserProfile {
  _id: string; // or string | number if your backend returns numbers
  username: string;
  profilePicture?: string;
}

export interface Message {
  _id: string;
  conversation: string;
  sender: UserProfile;
  content: string;
  createdAt: string;
  updatedAt: string;
}


export interface User {
  _id: string;             // Unique identifier for the user
  username: string;        // User's chosen username
  email: string;           // User's email address
  avatar?: string;         // Optional: URL to the user's profile picture. Could be `profilePicture` in your backend
  bio?: string;            // Optional: A short biography or description about the user
  followers: string[];     // Array of user IDs who are following this user
  following: string[];     // Array of user IDs this user is following
  postsCount: number;      // Number of posts created by this user
  createdAt: string;       // Timestamp when the user account was created (ISO 8601 format)
  updatedAt: string;       // Timestamp when the user account was last updated (ISO 8601 format)
  isActive?: boolean;   
}