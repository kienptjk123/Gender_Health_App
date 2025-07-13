export interface StiTrackingResponse {
  message: string;
  data: Data[];
}

export interface StiTrackingPostResponse {
  message: string;
  data: Data;
}

export interface Data {
  id: number;
  name: string;
  pscVisited: any;
  collectedDate: any;
  reportDate: any;
  resultAvailable: any;
  status: string;
  orderItemId: number;
  createdAt: string;
  updatedAt: string;
  orderItem: OrderItem;
}

export interface OrderItem {
  id: number;
  name: string;
  description: string;
  order: Order;
}

export interface Order {
  id: number;
  customerProfile: CustomerProfile;
}

export interface CustomerProfile {
  id: number;
  name: string;
  bio: any;
  location: any;
  username: string;
  avatar: string;
  coverPhoto: string;
  description: any;
  phoneNumber: any;
  dateOfBirth: any;
  website: any;
  userId: number;
}
