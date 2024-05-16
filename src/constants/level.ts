import { LevelColor } from "@/types/record";

export const BOULDER_LEVELS = [
  {
    id: 1,
    colorName: "노랑",
    colorCode: "#ffff00",
  },
  {
    id: 2,
    colorName: "핑크",
    colorCode: "#ff6666",
  },
  {
    id: 3,
    colorName: "파랑",
    colorCode: "#0000ff",
  },
  {
    id: 4,
    colorName: "빨강",
    colorCode: "#ff0000",
  },
  {
    id: 5,
    colorName: "보라",
    colorCode: "#b266ff",
  },
  {
    id: 6,
    colorName: "갈색",
    colorCode: "#cc6600",
  },
  {
    id: 7,
    colorName: "회색",
    colorCode: "#a0a0a0",
  },
  {
    id: 8,
    colorName: "검정",
    colorCode: "#000000",
  },
  {
    id: 9,
    colorName: "흰색",
    colorCode: "#ffffff",
  },
];

export const LEVEL_COLOR: Record<LevelColor, string> = {
  red: "bg-level-red",
  orange: "bg-level-orange",
  yellow: "bg-level-yellow",
  green: "bg-level-green",
  blue: "bg-level-blue",
  navy: "bg-level-navy",
  purple: "bg-level-purple",
  pink: "bg-level-pink",
  brown: "bg-level-brown",
  gray: "bg-level-gray",
  white: "bg-level-white",
  black: "bg-level-black",
} as const;
