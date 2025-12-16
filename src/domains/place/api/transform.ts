import type { PlaceResponse, LevelResponse } from '@/domains/place/types/response';
import type { Place, Level, LevelColor } from '@/domains/place/types/entity';

export const transformPlaceResponseToEntity = (response: PlaceResponse): Place => ({
  id: response.gymId,
  name: response.gymName ?? '',
  address: response.address ?? '',
});

export const transformLevelResponseToEntity = (response: LevelResponse): Level => ({
  levelId: response.levelId,
  colorNameKo: response.colorNameKo ?? '',
  colorNameEn: (response.colorNameEn ?? 'grey') as LevelColor,
  colorCode: response.colorCode ?? '',
});
