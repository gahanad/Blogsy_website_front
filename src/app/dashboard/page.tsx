'use client'

import DashboardPage from "./HomePageContent";

export default DashboardPage;

// DashboardPage.tsx
// 'use client';
// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import postService from '@/services/postService';
// import userService from '@/services/userService';
// import authService from '@/services/authService';
// import { useRouter } from 'next/navigation';

// interface User {
//   _id: string;
//   username: string;
//   email: string;
//   avatar?: string;
//   bio: string;
//   followers: [];
//   following: [];
//   postsCount: number;
// }

// interface Comment {
//   _id: string;
//   user: User;
//   text: string;
// }

// interface Post {
//   _id: string;
//   user: User;
//   caption: string;
//   imageUrl?: string;
//   likes: string[];
//   comments: Comment[];
//   createdAt: string;
// }

// export default function DashboardPage() {
//   const router = useRouter();
//   const [currentUser, setcurrentUser] = useState<User | null>(null);
//   const [newPostContent, setNewPostContent] = useState('');
//   const [title, setTitle] = useState('');
//   const [posts, setPost] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const userProfile = await userService.getCurrentUserProfile();
//         setcurrentUser(userProfile);

//         const userPosts = await postService.getAllPosts();
//         setPost(userPosts.posts);
//         setLoading(false);
//       } catch (err: any) {
//         console.error('Failed to fetch dashboard data:', err);
//         setError('Failed to load data. Please try again.');
//         setLoading(false);
//         if (err.response?.status === 401) {
//           authService.logout();
//           router.push('/login');
//         }
//       }
//     };
//     fetchData();
//   }, [router]);

//   const handlePostSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!title.trim() || !newPostContent.trim()) {
//       alert('Please enter both title and content');
//       return;
//     }
//     try {
//       const newPost = await postService.createPost({
//         title,
//         content: newPostContent,
//       });
//       setPost([newPost, ...posts]);
//       setNewPostContent('');
//       setTitle('');
//       alert('Successfully created the post');
//     } catch (err: any) {
//       console.error('Error creating post:', err);
//       alert(err.response?.data?.message || 'Failed to create post');
//     }
//   };

//   const handleLike = async (postId: string) => {
//     if (!currentUser) return;
//     try {
//       await postService.likePost(postId);
//       setPost(
//         posts.map((post) =>
//           post._id === postId
//             ? {
//                 ...post,
//                 likes: post.likes.includes(currentUser._id)
//                   ? post.likes.filter((id) => id !== currentUser._id)
//                   : [...post.likes, currentUser._id],
//               }
//             : post
//         )
//       );
//     } catch (err: any) {
//       console.error('Error liking the post:', err);
//       alert(err.response?.data?.message || 'Failed to like this post');
//     }
//   };

//   const handleAddComment = async (postId: string, comment: string) => {
//     if (!comment.trim()) return;
//     try {
//       const updatedPost = await postService.commentPost(postId, comment);
//       setPost(posts.map((post) => (post._id === postId ? updatedPost : post)));
//     } catch (err: any) {
//       console.error('Error adding comment:', err);
//       alert(err.response?.data?.message || 'Failed to add comment');
//     }
//   };

//   if (loading) return <div className="text-center mt-10">Loading...</div>;
//   if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

//   return (
//     <div className="p-4 max-w-3xl mx-auto">
//       <form onSubmit={handlePostSubmit} className="mb-6 space-y-2">
//         <input
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="Post title"
//           className="w-full p-2 border"
//         />
//         <textarea
//           value={newPostContent}
//           onChange={(e) => setNewPostContent(e.target.value)}
//           placeholder="Post content"
//           className="w-full p-2 border"
//         />
//         <button
//           type="submit"
//           className="bg-purple-500 text-white px-4 py-2 rounded"
//         >
//           Post
//         </button>
//       </form>

//       {posts.length === 0 ? (
//         <p key="no-posts-found">No posts yet.</p>
//       ) : (
//         posts.map((post) => (
//           <div key={post._id} className="border p-4 mb-4">
//             <div className="flex items-center mb-2">
//               <Image
//                 src={post.user?.avatar || '/images/Logo_enter.png'}
//                 alt="This is my post"
//                 width={32}
//                 height={32}
//                 className="rounded-full mr-2"
//               />
//               <span>{post.user?.username}</span>
//             </div>
//             <p className="font-bold">{post.caption}</p>
//             <div className="mt-2 flex space-x-4">
//               <button onClick={() => handleLike(post._id)}>
//                 ❤️ {post.likes?.length}
//               </button>
//               <span>💬 {post.comments?.length}</span>
//             </div>
//             {post.comments?.length > 0 && (
//               <ul className="mt-2 space-y-1">
//                 {post.comments.map((c) => (
//                   <li
//                     key={c._id || `${post._id}-comment-${Math.random()}`}
//                     className="text-sm text-gray-600"
//                   >
//                     <strong>{c.user?.username}:</strong> {c.text}
//                   </li>
//                 ))}
//               </ul>
//             )}
//             <input
//               type="text"
//               placeholder="Add a comment..."
//               className="mt-2 w-full border p-1"
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter') {
//                   handleAddComment(post._id, e.currentTarget.value);
//                   e.currentTarget.value = '';
//                 }
//               }}
//             />
//           </div>
//         ))
//       )}
//     </div>
//   );
// }
