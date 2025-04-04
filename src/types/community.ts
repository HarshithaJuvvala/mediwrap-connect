
export interface Discussion {
  id: number | string;
  author: string;
  authorType: string;
  avatar: string;
  topic: string;
  title: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  verified: boolean;
  liked?: boolean;
  showComments?: boolean;
}

export interface NewPostFormData {
  title: string;
  content: string;
  topic: string;
}
