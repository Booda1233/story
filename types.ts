export interface Comment {
  id: string;
  author: string;
  text: string;
}

export interface Story {
  id:string;
  title: string;
  author: string;
  category: string;
  coverImage: string;
  content: string;
  likedBy: string[];
  comments: Comment[];
}