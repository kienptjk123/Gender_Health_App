export interface BlogPost {
  id: number;
  title: string;
  content: string;
  date: string;
  image: string;
  tags?: {
    tag: {
      id: number;
      name: string;
    };
  }[];
  staff?: {
    id: number;
    name: string;
    avatar: string;
    coverPhoto: string;
  };
}

export interface BlogRequest {
  title: string;
  content: string;
  tags: number[];
  date: string;
  image: File;
}

export interface BlogResponse {
  data: BlogPost[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface BlogMessageResponse {
  message: string;
}
