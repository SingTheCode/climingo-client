"use client";

import { useState, useMemo } from "react";

import type { Profile } from "@/domains/profile/types/entity";

export const useProfileDetail = (profile: Profile) => {
  const [weight, setWeight] = useState<number | undefined>(
    profile.physicalInfo?.weight
  );
  const [height, setHeight] = useState<number | undefined>(
    profile.physicalInfo?.height
  );
  const [armSpan, setArmSpan] = useState<number | undefined>(
    profile.physicalInfo?.armSpan
  );

  const hasChanges = useMemo(() => {
    return (
      weight !== profile.physicalInfo?.weight ||
      height !== profile.physicalInfo?.height ||
      armSpan !== profile.physicalInfo?.armSpan
    );
  }, [weight, height, armSpan, profile.physicalInfo]);

  return {
    weight,
    height,
    armSpan,
    setWeight,
    setHeight,
    setArmSpan,
    hasChanges,
  };
};
