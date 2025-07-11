export interface Schedule {
  id: number;
  consultantProfileId: number;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "AVAILABLE" | "BOOKED";
  createdAt: string;
  acceptedAt: string;
  acceptedBy: number;
  bookedBy: number | null;
  bookedAt: string | null;
}

export interface ConsultantProfile {
  id: number;
  name: string;
  bio: string;
  location: string;
  username: string;
  avatar: string;
  coverPhoto: string;
  consultant_profile_id: number;
  description: string;
  phoneNumber: string;
  dateOfBirth: string;
  website: string;
  rating: number;
  totalReviews: number;
  experience: string;
  specialties: string[];
  languages: string[];
  responseTime: string;
  degree: string;
  hospital: string;
  userId: number;
}

export interface Consultant {
  consultantProfile: ConsultantProfile;
  schedulesByDate: Record<string, Schedule[]>;
}

export interface ConsultantsData {
  message: string;
  data: Consultant[];
}

export interface BookingResponse {
  message: string;
  data: dataBookingResponse;
}

export interface dataBookingResponse {
  id: number;
  consultantProfileId: number;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
  acceptedAt: string;
  acceptedBy: number;
  bookedBy: number;
}
export interface allConsultantResponse {
  message: string;
  result: ConsultantProfile[];
}
