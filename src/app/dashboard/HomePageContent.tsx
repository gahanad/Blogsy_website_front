'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import postService from '@/services/postService';
import userService from '@/services/userService';
import authService from '@/services/authService';

// Interfaces
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

interface Post {
  _id: string;
  user: User;
  title: string;
  caption: string;
  imageUrl?: string;
  likes: string[];
  comments: { user: User; text: string; _id: string }[];
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  // Fetch user + posts
  useEffect(() => {
    (async () => {
      try {
        const userProfile = await userService.getCurrentUserProfile();
        setCurrentUser(userProfile);

        const apiResponse = await postService.getAllPosts();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformed = apiResponse.posts.map((apiPost: any): Post => ({
          _id: apiPost._id,
          user: {
            _id: apiPost.author._id,
            username: apiPost.author.username,
            email: apiPost.author.email,
            avatar: apiPost.author.avatar || '/images/Logo_enter.png',
            bio: apiPost.author.bio || '',
            followers: apiPost.author.followers || [],
            following: apiPost.author.following || [],
            postsCount: apiPost.author.postsCount || 0,
          },
          title: apiPost.title,
          caption: apiPost.content,
          imageUrl: apiPost.image || undefined,
          likes: apiPost.likes || [],
          comments: apiPost.comments || [],
          createdAt: apiPost.createdAt,
        }));

        setPosts(transformed);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load data. Please try again.');
        if (err.response?.status === 401) {
          authService.logout();
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const handlePostSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !newPostContent) {
      alert('Please enter both title and content to proceed');
      return;
    }
    try {
      const apiResponse = await postService.createPost({
        title,
        content: newPostContent,
      });

      const apiPost = apiResponse.post;
      const newPost: Post = {
        _id: apiPost._id,
        user: {
          _id: apiPost.author._id,
          username: apiPost.author.username,
          email: apiPost.author.email,
          avatar: apiPost.author.avatar || '/images/Logo_enter.png',
          bio: apiPost.author.bio || '',
          followers: apiPost.author.followers || [],
          following: apiPost.author.following || [],
          postsCount: apiPost.author.postsCount || 0,
        },
        title: apiPost.title,
        caption: apiPost.content,
        imageUrl: apiPost.image || undefined,
        likes: [],
        comments: [],
        createdAt: apiPost.createdAt,
      };

      setPosts(prev => [newPost, ...prev]);
      setTitle('');
      setNewPostContent('');

      // Refresh profile to update postsCount
      const updatedProfile = await userService.getCurrentUserProfile();
      setCurrentUser(updatedProfile);

      alert('Post created successfully!');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error creating post:', err);
      alert(err.response?.data?.message || 'Failed to create post.');
    }
  }, [title, newPostContent]);

  const handleLike = useCallback(async (postId: string) => {
    if (!currentUser) return;
    try {
      await postService.likePost(postId);
      setPosts(prev =>
        prev.map(p =>
          p._id === postId
            ? {
                ...p,
                likes: p.likes.includes(currentUser._id)
                  ? p.likes.filter(id => id !== currentUser._id)
                  : [...p.likes, currentUser._id],
              }
            : p
        )
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error liking post:', err);
      alert(err.response?.data?.message || 'Failed to like post.');
    }
  }, [currentUser]);




  const handleLogout = useCallback(() => {
    authService.logout();
    router.push('/login');
  }, [router]);

    const handleSearch = useCallback((e: React.KeyboardEvent<HTMLInputElement>)=>{
    if(e.key === 'Enter' && searchQuery.trim()){
        router.push(`/profile/${searchQuery.trim()}`);
    }
  },[searchQuery, router]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;



  return (
        <>
                <div className="flex flex-col min-h-screen bg-gray-50">

                {/* 1. Top Navigation Bar (Header) */}
                <header className="fixed top-0 left-0 w-full bg-white shadow-sm p-4 z-20 flex items-center justify-between border-b border-gray-200">
                    <div className="text-2xl font-semibold italic text-purple-700">Blogsy</div>
                    
                    {/* Search Bar */}
                    <div className="relative flex-grow mx-4 max-w-lg">
                    <input
                        type="text"
                        placeholder="Search posts or users..."
                        className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 border border-gray-300
                                focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-800"
                        onChange={(e)=>setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
                    </div>

                    {/* Right Icons/Buttons */}
                    <div className="flex items-center space-x-5">
                    
                    <Link href={`/profile/${currentUser?.username || currentUser?._id}`}>
                        <Image
                        src={currentUser?.avatar || '/images/Logo_enter.png'}
                        alt="Your Avatar"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover border-2 border-purple-400 cursor-pointer"
                        />
                    </Link>
                    </div>
                </header>

                {/* Main Content Area: Sidebars and Feed */}
                <div className="flex flex-grow max-w-7xl mx-auto w-full mt-20 p-4">

                    {/* 2. Left Sidebar (User Profile Summary & Main Navigation) */}
                    <aside className="hidden lg:block w-64 mr-8 p-6 bg-white rounded-xl shadow-md self-start sticky top-20">
                    {/* User Profile Summary */}
                    {currentUser && (
                        <div className="flex flex-col items-center mb-6">
                        <Image
                            src={currentUser.avatar || '/images/Logo_enter.png'}
                            alt="Your Avatar"
                            width={80}
                            height={80}
                            className="w-20 h-20 rounded-full object-cover border-4 border-pink-500 shadow-md"
                        />
                        <h3 className="mt-4 text-xl font-semibold text-gray-800">{currentUser.username}</h3>
                        <p className="text-sm text-gray-500">{currentUser.bio || 'No bio yet.'}</p>
                        <div className="flex justify-around w-full mt-4 text-gray-700">
                            <div className="text-center">
                            <span className="block font-bold">{currentUser.postsCount || 0}</span>
                            <span className="text-xs">Posts</span>
                            </div>
                            <div className="text-center">
                            <span className="block font-bold">{currentUser.followers?.length || 0}</span> {/* Assuming array of follower IDs */}
                            <span className="text-xs">Followers</span>
                            </div>
                            <div className="text-center">
                            <span className="block font-bold">{currentUser.following?.length || 0}</span> {/* Assuming array of following IDs */}
                            <span className="text-xs">Following</span>
                            </div>
                        </div>
                        <Link href={`/profile/${currentUser.username}`} className="mt-6 w-full text-center py-2 px-4 rounded-full
                                                        bg-purple-600 text-white font-medium hover:bg-purple-700
                                                        transition-colors duration-200">
                            View Profile
                        </Link>
                        </div>
                    )}

                    <hr className="border-gray-200 mb-6"/>

                    {/* Main Navigation Links */}
                    <nav>
                        <ul className="space-y-3">
                        <li>
                            <Link href="/dashboard" className="flex items-center space-x-3 p-2 rounded-lg bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200 transition-colors duration-200">
                            <span className="text-xl">🏠</span><span>Home</span>
                            </Link>
                        </li>
                        
                        <li>
                            <Link href="/messages" className="flex items-center space-x-3 p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                            <span className="text-xl">💬</span><span>Messages</span>
                            </Link>
                        </li>
                        
                        <li>
                            <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                            >
                            <span className="text-xl">👋</span><span>Logout</span>
                            </button>
                        </li>
                        </ul>
                    </nav>
                    </aside>

                    {/* 3. Central Feed Area */}
                    <main className="flex-1 min-w-0">
                    {/* "What's on your mind?" / Create Post Input */}
                    <div className="bg-white p-5 rounded-xl shadow-md mb-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Create new post</h3>
                        <form onSubmit={handlePostSubmit}>
                            <input
                                type="text"
                                placeholder="Post Title"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none
                                        focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-800 bg-gray-50 mb-3"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none
                                        focus:ring-2 focus:ring-pink-400 focus:border-transparent
                                        transition-all duration-200 text-gray-800 bg-gray-50 resize-y"
                                rows={3}
                                placeholder="What's on your mind, Blogsy user?"
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                            ></textarea>
                        <div className="flex justify-between items-center mt-3">
                            <div className="flex space-x-4 text-gray-500">
                            <button type="button" className="hover:text-pink-500 transition-colors duration-200 text-xl">🖼️ {/* Image icon */}</button>
                            </div>
                            <button
                            type="submit"
                            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold px-6 py-2 rounded-lg
                                            hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-purple-300
                                            transition-all duration-300 shadow-md"
                            >
                            Post
                            </button>
                        </div>
                        </form>
                    </div>

                    {/* Feed of Posts */}
                    <section className="space-y-8">
                    {posts.length === 0 ? (
                        <p
                        key="no-posts-found"
                        className="text-center text-gray-500 text-sm"
                        >
                        No posts available. Be the first to post!
                        </p>
                    ) : (
                        posts
                        .filter((post): post is Post => !!post && !!post._id)
                        .map(post => (
                            <div
                            key={post._id}
                            className="bg-white p-6 rounded-2xl shadow border border-gray-200 transition hover:shadow-lg"
                            >
                            {/* Post Header */}
                            <div className="flex items-center mb-4">
                                <Image
                                src={post.user?.avatar || '/images/Logo_enter.png'}
                                alt={post.user?.username || 'User'}
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded-full object-cover mr-4 border border-gray-200"
                                />
                                <div>
                                <Link
                                    href={`/profile/${post.user?.username || post.user?._id}`}
                                    className="font-semibold text-gray-900 hover:text-purple-600 transition"
                                >
                                    {post.user?.username || 'Unknown User'}
                                </Link>
                                <p className="text-xs text-gray-500">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                                </div>
                                <span className="ml-auto text-gray-400 text-xl cursor-pointer hover:text-gray-600">
                                ...
                                </span>
                            </div>

                            {/* Post Image */}
                            {post.imageUrl && (
                                <div className="w-full h-64 relative rounded-lg overflow-hidden mb-4 bg-gray-100">
                                <Image
                                    src={post.imageUrl}
                                    alt="Post content"
                                    fill
                                    className="object-cover"
                                />
                                </div>
                            )}

                            {/* Post title */}
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                {post.title}
                            </h4>
                            {/* Post Caption */}
                            <p className="text-gray-800 mb-4">
                                <Link
                                href={`/profile/${post.user?.username || post.user?._id}`}
                                className="font-semibold hover:text-purple-600"
                                >
                                {post.user?.username || 'Unknown User'}
                                </Link>{' '}
                                {post.caption}
                            </p>

                            {/* Post Actions */}
                            <div className="flex items-center space-x-6 text-xl text-gray-500 mb-3">
                                <button
                                onClick={() => handleLike(post._id)}
                                className={`flex items-center space-x-1 ${
                                    currentUser && post.likes.includes(currentUser._id)
                                    ? 'text-pink-500'
                                    : 'hover:text-pink-500'
                                } transition`}
                                >
                                ❤️ <span className="text-base">{post.likes.length}</span>
                                </button>
                                <button className="flex items-center space-x-1 hover:text-purple-500 transition">
                                💬 <span className="text-base">{post.comments.length}</span>
                                </button>
                                <button className="hover:text-blue-500 transition">✈️</button>
                                <button className="ml-auto hover:text-green-500 transition">
                                🔖
                                </button>
                            </div>

                           

                            </div>
                        ))
                    )}
                    </section>

                    </main>
                </div>
                </div>
        </>
    )
}


