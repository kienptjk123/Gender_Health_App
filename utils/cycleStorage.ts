import AsyncStorage from "@react-native-async-storage/async-storage";

const STEP_KEY = "menstrual_step";
const ID_KEY = "menstrual_cycle_id";
const COMPLETED_KEY = "menstrual_cycle_completed";

const makeKey = (key: string, userId: string) => `${key}_${userId}`;

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

export const getCycleProgress = async (userId: string) => {
  const step = await AsyncStorage.getItem(makeKey(STEP_KEY, userId));
  const id = await AsyncStorage.getItem(makeKey(ID_KEY, userId));
  return {
    step: step ? Number(step) : null,
    cycleId: id ? Number(id) : null,
  };
};

export const clearCycleProgress = async (userId: string) => {
  await AsyncStorage.multiRemove([
    makeKey(STEP_KEY, userId),
    makeKey(ID_KEY, userId),
    makeKey(COMPLETED_KEY, userId),
  ]);
};

export const setCycleCompleted = async (userId: string, value: boolean) => {
  await AsyncStorage.setItem(
    makeKey(COMPLETED_KEY, userId),
    JSON.stringify(value)
  );
};

export const getCycleCompleted = async (userId: string): Promise<boolean> => {
  const val = await AsyncStorage.getItem(makeKey(COMPLETED_KEY, userId));
  return val === "true";
};
