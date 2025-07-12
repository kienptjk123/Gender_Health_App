import AsyncStorage from "@react-native-async-storage/async-storage";

// Keys cố định
const STEP_KEY = "menstrual_step";
const ID_KEY = "menstrual_cycle_id";
const COMPLETED_KEY = "menstrual_cycle_completed";

// Tạo key có userId để phân biệt người dùng
const makeKey = (key: string, userId: string) => `${key}_${userId}`;

// ✅ Ghi tiến trình (step và cycleId)
export const setCycleProgress = async (
  userId: string,
  step: number,
  id?: number
) => {
  await AsyncStorage.setItem(makeKey(STEP_KEY, userId), String(step));
  if (id !== undefined) {
    await AsyncStorage.setItem(makeKey(ID_KEY, userId), String(id));
  }
};

// ✅ Lấy tiến trình hiện tại
export const getCycleProgress = async (userId: string) => {
  const step = await AsyncStorage.getItem(makeKey(STEP_KEY, userId));
  const id = await AsyncStorage.getItem(makeKey(ID_KEY, userId));
  return {
    step: step ? Number(step) : null,
    cycleId: id ? Number(id) : null,
  };
};

// ✅ Xoá tiến trình
export const clearCycleProgress = async (userId: string) => {
  await AsyncStorage.multiRemove([
    makeKey(STEP_KEY, userId),
    makeKey(ID_KEY, userId),
    makeKey(COMPLETED_KEY, userId),
  ]);
};

// ✅ Ghi trạng thái hoàn thành
export const setCycleCompleted = async (userId: string, value: boolean) => {
  await AsyncStorage.setItem(
    makeKey(COMPLETED_KEY, userId),
    JSON.stringify(value)
  );
};

// ✅ Kiểm tra đã hoàn thành chưa
export const getCycleCompleted = async (userId: string): Promise<boolean> => {
  const val = await AsyncStorage.getItem(makeKey(COMPLETED_KEY, userId));
  return val === "true";
};
