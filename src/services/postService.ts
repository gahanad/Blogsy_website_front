import apiClient from '@/utils/axiosConfig';





export interface ApiPost {
  _id: string;
  author: {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
    bio?: string;
    followers: string[];
    following: string[];
    postsCount: number;
  };
  title: string;
  content: string;
  image?: string;
  likes: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comments: any[];
  createdAt: string;
}


// To get all posts
const getAllPosts = async (): Promise<{ posts: ApiPost[] }> => {
  const response = await apiClient.get('/posts/');
  return response.data;
};


// To create a new post
const createPost = async(postData: {title: string, content: string})=>{
    const response = await apiClient.post('/posts/', postData);
    return response.data;
}

// To like a post
const likePost = async(postId: string)=>{
    const response = await apiClient.put(`/posts/${postId}/like`, {});
    return response.data;
}

const commentPost = async(postId: string)=>{
    const response = await apiClient.put(`/posts/${postId}/comment`, {});
    return response.data;
}

const getPostsByUserId = async(_id: string)=>{
    const response = await apiClient.get(`/posts/user/${_id}`);
    return response.data;
}

const postService = {
    getAllPosts,
    createPost,
    likePost,
    commentPost,
    getPostsByUserId,
}

export default postService;


