import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export interface ProfileUpdateData {
  name: string;
  bio: string;
  location: string;
  website: string;
  username: string;
  avatar: string;
  coverPhoto: string;
}
type RootStackParamList = {
  Profile: undefined;
};

export type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  website: string;
  avatar: string;
}

export interface ProfileOption {
  id: string;
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
}

export interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
}

export interface EditProfileModalProps {
  visible: boolean;
  userProfile: UserProfile;
  onClose: () => void;
  onSave: (
    updatedProfile: UserProfile,
    changedFields: Partial<UserProfile>
  ) => void;
  colors: {
    primary: string;
    primaryLight: string;
    secondary: string;
    text: string;
    textLight: string;
    white: string;
  };
}

export interface historyConsultingData {
  id: number;
  consultantProfileId: number;
  customerProfileId: number;
  scheduleAt: string;
  startedAt: string;
  endedAt: string;
  status: string;
  rating: string;
  feedback: string;
  consultantNote: string;
  customerNote: string;
  meetingLink: string;
  meetingPlatform: string;
  createdAt: string;
  updatedAt: string;
  consultantProfile: ConsultantProfile;
  customerProfile: UserProfile;
}
export interface ConsultantProfile {
  id: number;
  name: string;
  bio: string;
  location: string;
  username: string;
  avatar: string;
  coverPhoto: string;
  description: string;
  phoneNumber: string;
  dateOfBirth: string;
  website: string;
  rating: number;
  totalReviews: string;
  experience: string;
  specialties: string[];
  languages: string[];
  responseTime: string;
  degree: string;
  hospital: string;
  userId: number;
}
