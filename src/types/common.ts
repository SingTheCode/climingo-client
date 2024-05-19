declare global {
  interface String {
    fromNowFormat(): string;
  }
}

export interface ClimbingPlace {
  id: number;
  address: string;
  zipCode?: string | null;
  name?: string;
}

export type Level = {
  id: number;
  colorName: string;
  colorCode?: string;
};
