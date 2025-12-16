export interface Place {
  id: number;
  name: string;
  address: string;
}

export interface Level {
  levelId: number;
  colorNameKo: string;
  colorNameEn: string;
  colorCode: string;
}

export interface SearchPlaceParams {
  keyword: string;
}
