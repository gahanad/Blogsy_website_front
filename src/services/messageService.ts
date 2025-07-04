import apiClient from "@/utils/axiosConfig";
import { Message } from "@/app/types/message";





const getUserConversations = async () => {
    const response = await apiClient.get('/messages/conversations');
    return response.data;
};

const getConversationMessages = async (
  conversationId: string,
  page: number = 1,
  limit: number = 20
): Promise<{
  messages: Message[];
  currentPage: number;
  totalPages: number;
  totalMessages: number;
}> => {
  const response = await apiClient.get(`/messages/conversations/${conversationId}/messages`, {
    params: { page, limit },
  });

  // Normalize sender._id to string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages = response.data.messages.map((m: any) => ({
    ...m,
    sender: {
      ...m.sender,
      _id: String(m.sender._id),
    },
  }));

  return {
    ...response.data,
    messages,
  };
};



const createConversationAndSendMessage = async (recipientId: string, content: string): Promise<{
        statusmessage: string;
        conversationId: string;
        message: Message; 
}> => {
    const response = await apiClient.post('/messages/conversations', { recipientId, content });
    return response.data;
};

const markMessagesAsRead = async (conversationId: string): Promise<{ message: string }> => {
    const response = await apiClient.put(`/messages/conversations/${conversationId}/read`);
    return response.data;
};

const softDeleteConversation = async (conversationId: string): Promise<{ message: string }> => {
    const response = await apiClient.put(`/messages/conversations/${conversationId}/delete`);
    return response.data;
};

const sendMessage = async (
    conversationId: string,
    content: string,
): Promise<{ message: Message }> => {
    const response = await apiClient.post(
        `/messages/conversations/${conversationId}/messages`,
        { content }
    );
    return response.data;
};


const messageService = {
    getUserConversations,
    getConversationMessages,
    createConversationAndSendMessage,
    markMessagesAsRead,
    softDeleteConversation,
    sendMessage,
}

export default messageService;