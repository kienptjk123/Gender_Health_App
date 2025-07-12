export type ResultOfTestReq = ResultOfTestForm[];

export interface ResultOfTestForm {
  testCode: string;
  value: number;
  abbreviation: string;
  stisTrackingId: number;
}

export interface ResultOfTestResponse {
  message: string;
  data: ResultOfTestData[];
}

export interface ResultOfTestData {
  id: number;
  testCode: string;
  value: number;
  abbreviation: string;
  result: string;
  stisTrackingId: number;
  createdAt: string;
  updatedAt: string;
}

export interface StiTrackingByIdResponse {
  message: string;
  data: StiTrackingByIdData;
}

export interface StiTrackingByIdData {
  stisTracking: StisTracking;
  testPackages: TestPackages;
}

export interface StisTracking {
  id: number;
  name: string;
  pscVisited: string;
  collectedDate: string;
  reportDate: string;
  resultAvailable: string;
  status: string;
  orderItemId: number;
  createdAt: string;
  updatedAt: string;
  orderItem: OrderItem;
}

export interface OrderItem {
  id: number;
  code: string;
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

export interface TestPackages {
  id: number;
  code: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  staffId: number;
  tests: Tests[];
}

export interface Tests {
  test: Test;
}

export interface Test {
  id: number;
  name: string;
  code: string;
  description: string;
  type_of_test: TypeOfTest;
}

export interface TypeOfTest {
  id: number;
  name: string;
}
