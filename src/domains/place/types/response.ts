export interface PlaceResponse {
  id: number;
  name: string;
  address: string;
  zipCode?: string;
}

export interface LevelResponse {
  levelId: number;
  colorNameKo: string;
  colorNameEn: string;
  colorCode: string;
}
