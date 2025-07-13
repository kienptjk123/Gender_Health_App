// Individual test detail
export interface TestDetail {
  id: number;
  name: string;
  code: string;
  description: string;
}

// Test package from API
export interface TestPackageItem {
  id: number;
  name: string;
  code: string;
  description: string;
  price: number;
  tests: TestDetail[];
  // UI-specific properties (will be added by our app)
  bgColor?: string;
  checkColor?: string;
  duration?: string;
  questions?: number;
  category?: string;
  icon?: string;
}

// Type of test from API
export interface TypeOfTest {
  id: number;
  code: string;
  name: string;
  description: string;
  tests: TestDetail[];
}

// UI-enhanced test package for display
export interface EnhancedTestPackage extends TestPackageItem {
  bgColor: string;
  checkColor: string;
  category: string;
  icon: string;
  duration: string;
  questions: number;
}

export interface TestPackageItemResponse {
  message: string;
  data: TestPackageItem;
}

export interface TestPackageResponse {
  message: string;
  data: TestPackageItem[];
}

export interface TypeOfTestResponse {
  message: string;
  data: TypeOfTest[];
}

export interface OrderFormData {
  address: string;
  phone: string;
  note?: string;
  test_date: Date | undefined;
}

export interface OrderFormRequest {
  address: string;
  phone: string;
  note: string;
  test_date: string;
  test_package_id: number;
  customer_profile_id: number;
}

export interface OrderResponse {
  message: string;
  data: {
    id: number;
    order_date: string;
    status: string;
    total_amount: number;
  };
}

export interface PaymentRequest {
  order_id: number;
  amount: number;
}

export interface PaymentResponse {
  message: string;
  data: {
    payment_url: string;
    payment_id: string;
  };
}

export interface PaymentListResponse {
  message: string;
  data: PaymentResponse[];
}

export interface OrderListResponse {
  message: string;
  data: OrderResponse[];
}
