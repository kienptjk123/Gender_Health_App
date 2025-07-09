export interface QuestionData {
  id: number;
  title: string;
  content: string;
  image?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    avatar?: string;
  };
  replies?: ReplyData[];
  voteCount?: number;
  hasVoted?: boolean;
}

export interface QuestionRequest {
  title: string;
  content: string;
  image?: File;
}

export interface ReplyData {
  id: number;
  content: string;
  questionId: number;
  userId: number;
  parentId?: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    avatar?: string;
  };
  replies?: ReplyData[];
}

export interface ReplyRequest {
  content: string;
  questionId: number;
  parentId?: number;
}

export interface VoteData {
  id: number;
  userId: number;
  questionId: number;
  voteType: "UP" | "DOWN";
  createdAt: string;
}

export interface VoteRequest {
  vote_type: "UP" | "DOWN";
  question_id: number;
}
