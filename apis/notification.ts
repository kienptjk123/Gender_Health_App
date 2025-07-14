import { NotificationListResponse } from "@/models/notification";
import { apiService } from "@/utils/fetcher";

export const notificationApi = {
  getNotifications: async (): Promise<NotificationListResponse> => {
    const res = await apiService.get("/notifications");
    return res.data as NotificationListResponse;
  },

  markAsRead: async (notificationId: number): Promise<{ message: string }> => {
    const res = await apiService.put(
      `/notifications/mark-as-read/${notificationId}`
    );
    return res.data as { message: string };
  },

  markAllAsRead: async (): Promise<{ message: string }> => {
    const res = await apiService.put("/notifications/mark-all-as-read");
    return res.data as { message: string };
  },
};
