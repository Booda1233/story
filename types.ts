export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Comment {
  id: string;
  text: string;
  user: User;
  createdAt: string;
}

export interface Like {
  userId: string;
  createdAt: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  author: User;
  category: string;
  image?: string;
  createdAt: string;
  views: number;
  likes: Like[];
  comments: Comment[];
}

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}