import axios from 'axios';
import authService from './authService';
import apiClient from '@/utils/axiosConfig';
import {User} from '@/app/types/message';

// const API_URL = "http://localhost:5000/api/users/";

const getAuthHeaders = () =>{
    const token = authService.getToken();
    return{
        headers:{
            Authorization: token? `Bearer ${token}`:'',
        },
    };
};

interface UpdateEditProfile{
    username?: string;
    email?: string;
    bio?: string;
    avatar?: string; 
}

const updateUserProfile = async(userData: UpdateEditProfile): Promise<User>=>{
    const response = await apiClient.put('/users/me', userData);
    return response.data;
}
const followUser = async(userId: string)=>{
    const response = await apiClient.put(`/users/${userId}/follow`, {});
    return response.data;
}

const unfollowUser = async(userId: string)=>{
    const response = await apiClient.put(`/users/${userId}/unfollow`, {});
    return response.data;
}

const getCurrentUserProfile = async()=>{
    const response = await apiClient.get('/users/profile/me');
    return response.data;
}

const getUserByUsername = async(username: string)=>{
    const response = await apiClient.get(`/users/username/${username}`);
    return response.data;
}
const userService = {
    followUser,
    unfollowUser,
    getCurrentUserProfile,
    getUserByUsername,
    updateUserProfile,
}

export default userService;
