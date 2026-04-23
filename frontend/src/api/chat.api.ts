import apiClient from './client';

export interface Conversation {
  user_id: string;
  full_name: string;
  avatar_url?: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  reference_type?: string;
  reference_id?: string;
  is_read: boolean;
  created_at: string;
}

export const chatApi = {
  conversations: () => apiClient.get<{ conversations: Conversation[] }>('/chat/conversations'),

  messages: (userId: string) =>
    apiClient.get<{ messages: ChatMessage[] }>(`/chat/${userId}`),

  send: (
    userId: string,
    message: string,
    referenceType?: string,
    referenceId?: string
  ) =>
    apiClient.post<{ message: ChatMessage }>(`/chat/${userId}`, {
      message,
      reference_type: referenceType,
      reference_id: referenceId,
    }),
};
