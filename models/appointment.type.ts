export interface ConsultantProfile {
  id: number;
  name: string;
  bio: string;
  location: string;
  username: string;
  avatar: string;
}

export interface Appointment {
  id: number;
  consultantProfileId: number;
  customerProfileId: number;
  scheduledAt: string;
  startedAt: string | null;
  endedAt: string | null;
  status: string;
  rating: number | null;
  feedback: string | null;
  consultantNote: string | null;
  customerNote: string | null;
  meetingPlatform: string;
  meetingLink: string;
  createdAt: string;
  updatedAt: string;
  consultantProfile: ConsultantProfile;
}
