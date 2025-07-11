import { Appointment } from "@/models/appointment.type";
import { apiService } from "@/utils/fetcher";

export const appointmentApi = {
  getAppointmentsByCustomerId: async (
    customerId: number
  ): Promise<Appointment[]> => {
    const res = await apiService.get<{ data: Appointment[] }>(
      `/consulting-history/customer/${customerId}`
    );
    return res.data.data;
  },
};
