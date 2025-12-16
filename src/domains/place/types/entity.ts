export interface Place {
  id: number;
  name: string;
  address: string;
}

// types/common.ts에서 이동
export interface ClimbingPlace {
  id: number;
  address: string;
  zipCode?: string;
  name: string;
}

// types/record.ts에서 이동
export interface Gym {
  gymId: number;
  gymName: string;
}

export type LevelColor =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'navy'
  | 'purple'
  | 'pink'
  | 'brown'
  | 'grey'
  | 'white'
  | 'black';

export interface Level {
  levelId: number;
  colorNameKo: string;
  colorNameEn: LevelColor;
  colorCode: string;
}

export interface SearchPlaceParams {
  keyword: string;
}
