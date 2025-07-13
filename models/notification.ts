export type NotificationStatus = "UNREAD" | "READ";

export type NotificationType =
  | "PAYMENT_SUCCESS"
  | "SYSTEM"
  | "REMINDER"
  | "CUSTOM"; // thêm các loại khác nếu cần

export interface NotificationMeta {
  paymentId?: number;
  orderId?: number;
  questionId?: number;
  replyId?: number;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  recipientId: number;
  orderId?: number | null;
  paymentId?: number | null;
  questionId?: number | null;
  replyId?: number | null;
  metadata?: NotificationMeta;
  createdAt: string;
  readAt?: string | null;
}

export interface NotificationListResponse {
  message: string;
  data: NotificationItem[];
}
