import { Prediction } from "@/models/MenstrualModels/summary.type";
import { addDays, differenceInDays } from "date-fns";
import { useMemo } from "react";

export const useCycle = (predictionData: Prediction | null) => {
  return useMemo(() => {
    if (!predictionData?.data) {
      return {
        chartData: [],
        currentDay: 1,
        daysUntilMenstrual: 0,
        phases: {},
      };
    }

    const { prediction, pregnancyAbility } = predictionData.data;

    const today = new Date();
    const cycleStart = new Date(prediction.predictedStartDate);
    const cycleEnd = new Date(prediction.predictedEndDate);
    const fertileStart = new Date(pregnancyAbility.fertileWindowStart);
    const fertileEnd = new Date(pregnancyAbility.fertileWindowEnd);

    const cycleLength = prediction.cycleLength;
    const menstrualDays = differenceInDays(cycleEnd, cycleStart) + 1;

    const menstrualPhase = {
      start: 1,
      end: menstrualDays,
      color: "#ec4899",
      name: "Menstrual",
      startDate: cycleStart,
      endDate: cycleEnd,
    };

    const follicularStartDate = addDays(cycleEnd, 1);
    const follicularEndDate = addDays(fertileStart, -1);
    const follicularDays = Math.max(
      1,
      differenceInDays(follicularEndDate, follicularStartDate) + 1
    );

    const follicularPhase = {
      start: menstrualPhase.end + 1,
      end: menstrualPhase.end + follicularDays,
      color: "#f472b6",
      name: "Follicular",
      startDate: follicularStartDate,
      endDate: follicularEndDate,
    };

    const ovulationDays = differenceInDays(fertileEnd, fertileStart) + 1;
    const ovulationPhase = {
      start: follicularPhase.end + 1,
      end: follicularPhase.end + ovulationDays,
      color: "#f97316",
      name: "Ovulation",
      startDate: fertileStart,
      endDate: fertileEnd,
    };

    const lutealStartDate = addDays(fertileEnd, 1);
    const lutealEndDate = addDays(cycleStart, cycleLength - 1);

    const lutealPhase = {
      start: ovulationPhase.end + 1,
      end: cycleLength,
      color: "#a78bfa",
      name: "Luteal",
      startDate: lutealStartDate,
      endDate: lutealEndDate,
    };

    const daysSinceCycleStart = differenceInDays(today, cycleStart);
    let currentDay = 1;

    if (daysSinceCycleStart >= 0 && daysSinceCycleStart < cycleLength) {
      currentDay = daysSinceCycleStart + 1;
    } else if (daysSinceCycleStart < 0) {
      currentDay = cycleLength + daysSinceCycleStart + 1;
    } else {
      currentDay = (daysSinceCycleStart % cycleLength) + 1;
    }

    const getCurrentPhase = (day: number) => {
      if (day <= menstrualPhase.end) return menstrualPhase;
      if (day <= follicularPhase.end) return follicularPhase;
      if (day <= ovulationPhase.end) return ovulationPhase;
      return lutealPhase;
    };

    const getDateForDay = (day: number) => addDays(cycleStart, day - 1);

    const chartData = [];
    for (let day = 1; day <= cycleLength; day++) {
      const phase = getCurrentPhase(day);
      const date = getDateForDay(day);

      let intensity = 0.7;
      if (phase.name === "Menstrual") intensity = 0.9;
      if (phase.name === "Ovulation") intensity = 1.0;
      if (phase.name === "Luteal") intensity = 0.8;

      chartData.push({
        day,
        phase: phase.name,
        color: phase.color,
        intensity,
        isCurrent: day === currentDay,
        date,
        phaseInfo: phase,
      });
    }

    return {
      chartData,
      currentDay,
      daysUntilMenstrual: Math.max(0, differenceInDays(cycleStart, today)),
      phases: {
        menstrual: menstrualPhase,
        follicular: follicularPhase,
        ovulation: ovulationPhase,
        luteal: lutealPhase,
      },
    };
  }, [predictionData]);
};
