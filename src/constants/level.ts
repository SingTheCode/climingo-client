import { LevelColor } from "@/types/record";

export const BOULDER_LEVELS: {
  [key in LevelColor]: {
    colorName: string;
    colorCode: string;
  };
} = {
  red: {
    colorName: "빨강",
    colorCode: "#ff0000",
  },
  orange: {
    colorName: "주황",
    colorCode: "#f77f00",
  },
  yellow: {
    colorName: "노랑",
    colorCode: "#ffff00",
  },
  green: {
    colorName: "초록",
    colorCode: "#23C16B",
  },
  blue: {
    colorName: "파랑",
    colorCode: "#0000ff",
  },
  navy: {
    colorName: "남색",
    colorCode: "#003077",
  },
  purple: {
    colorName: "보라",
    colorCode: "#b266ff",
  },
  pink: {
    colorName: "핑크",
    colorCode: "#ff6666",
  },
  brown: {
    colorName: "갈색",
    colorCode: "#cc6600",
  },
  gray: {
    colorName: "회색",
    colorCode: "#a0a0a0",
  },
  white: {
    colorName: "흰색",
    colorCode: "#ffffff",
  },
  black: {
    colorName: "검정",
    colorCode: "#000000",
  },
};
