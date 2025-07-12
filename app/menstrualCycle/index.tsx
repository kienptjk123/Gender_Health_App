import { authService } from "@/apis";
import CycleInput from "@/components/CycleInput";
import Fertility from "@/components/Fertility";
import Medication from "@/components/Medication";
import Mood from "@/components/Mood";
import SummaryScreen from "@/components/SummaryScreen";
import Symptoms from "@/components/Symptoms";
import {
  clearCycleProgress,
  getCycleProgress,
  setCycleProgress,
} from "@/utils/cycleStorage";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import CycleStartScreen from "./start";

export default function MenstrualCycleIndex() {
  const [step, setStep] = useState<number | null>(null);
  const [cycleId, setCycleId] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const res = await authService.getUserProfile();
        const profile = res.result;
        const uid = String(profile.id);
        setUserId(uid);

        const { step, cycleId } = await getCycleProgress(uid);

        setStep(step);
        setCycleId(cycleId ?? null);
      } catch (err) {
        console.error("❌ Failed to fetch progress", err);
      } finally {
        setLoading(false);
      }
    };

    restore();
  }, []);

  const next = async () => {
    if (!userId) return;
    const nextStep = (step ?? 1) + 1;
    setStep(nextStep);
    await setCycleProgress(userId, nextStep, cycleId ?? undefined);
  };

  const handleCycleCreated = async (id: number) => {
    if (!userId) return;
    setCycleId(id);
    setStep(2);
    await setCycleProgress(userId, 2, id);
  };

  const handleReset = async () => {
    if (!userId) return;
    await clearCycleProgress(userId);
    setCycleId(null);
    setStep(null); // ✅ quay về StartScreen
  };

  const renderStep = () => {
    if (step === null) {
      return <CycleStartScreen onStart={() => setStep(1)} />;
    }

    if (step === 1) {
      return <CycleInput onNext={handleCycleCreated} />;
    }

    if (!cycleId) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#ec4899" />
        </View>
      );
    }

    switch (step) {
      case 2:
        return (
          <Symptoms menstrualCycleId={cycleId} onNext={next} onSkipAll={next} />
        );
      case 3:
        return (
          <Fertility
            menstrualCycleId={cycleId}
            onNext={next}
            onSkipAll={next}
          />
        );
      case 4:
        return (
          <Medication
            menstrualCycleId={cycleId}
            onNext={next}
            onSkipAll={next}
          />
        );
      case 5:
        return (
          <Mood menstrualCycleId={cycleId} onNext={next} onSkipAll={next} />
        );
      case 6:
        return (
          <SummaryScreen
            menstrualCycleId={cycleId}
            userId={userId!}
            onReset={handleReset}
          />
        );
      default:
        return <CycleStartScreen onStart={() => setStep(1)} />;
    }
  };

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#ec4899" />
      </View>
    );
  }

  return <View className="flex-1">{renderStep()}</View>;
}
