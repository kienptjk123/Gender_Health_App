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
  image?: string; // Changed from File to string for React Native
}

export interface QuestionResponse {
  message: string;
  data: QuestionData[];
}

export interface QuestionCreateResponse {
  message: string;
  data: QuestionData;
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
  question_id: number;
  author_type?: "CUSTOMER" | "ADMIN"; // Added to match API
  parent_id?: number;
}

export interface VoteData {
  id: number;
  customerProfileId: number; // Changed from userId to match API
  questionId?: number;
  replyId?: number;
  voteType: "UP" | "DOWN";
  createdAt: string;
}

export interface VoteRequest {
  vote_type: "UP" | "DOWN";
  question_id?: number;
  reply_id?: number;
}

export interface CreateVoteReqBody {
  vote_type: "UP" | "DOWN";
  question_id?: number;
  reply_id?: number;
}

export interface UpdateVoteReqBody {
  vote_type: "UP" | "DOWN";
}

export interface VoteParams {
  id: string;
}

// Enhanced VoteData to include user's current vote
export interface UserVoteState {
  hasVoted: boolean;
  userVoteType?: "UP" | "DOWN";
  userVoteId?: number;
  totalVotes: number;
}

export interface VoteResponse {
  data: VoteData[];
  message: string;
  status: number;
}

export interface VoteResponseCreate {
  data: VoteData;
  message: string;
  status: number;
}
