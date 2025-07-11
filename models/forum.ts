export interface QuestionData {
  id: number;
  title: string;
  content: string;
  image?: string;
  customerProfileId: number; // Changed from userId to match API
  createdAt: string;
  updatedAt: string;
  customerProfile?: {
    id: number;
    name: string;
    username: string;
    avatar?: string;
  };
  replies?: ReplyData[];
  _count?: {
    replies: number;
    votes: number;
  };
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
  customerProfileId: number; // Changed from userId to match API
  parentId?: number;
  createdAt: string;
  updatedAt: string;
  customerProfile?: {
    id: number;
    name: string;
    username: string;
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
  customerProfileId: number; // Changed from userId to match API
  questionId: number;
  voteType: "UP" | "DOWN";
  createdAt: string;
}

export interface VoteRequest {
  vote_type: "UP" | "DOWN";
  question_id: number;
}
