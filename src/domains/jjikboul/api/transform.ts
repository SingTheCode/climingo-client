import type {
  JjikboulResponse,
  JjikboulDetailResponse,
} from "@/domains/jjikboul/types/response";
import type { MemberInfoResponse } from "@/domains/auth/types/response";
import type {
  GymResponse,
  LevelResponse,
} from "@/domains/record/types/response";
import type {
  Jjikboul,
  MemberInfo,
  Gym,
  Level,
  JjikboulDetail,
} from "@/domains/jjikboul/types/entity";

export const transformJjikboulResponseToEntity = (
  response: JjikboulResponse
): Jjikboul => ({
  jjikboulId: response.jjikboulId,
  problemType: response.problemType ?? "",
  description: response.description ?? "",
  problemUrl: response.problemUrl ?? "",
});

export const transformMemberInfoResponseToEntity = (
  response: MemberInfoResponse
): MemberInfo => ({
  memberId: response.memberId,
  nickname: response.nickname ?? "익명",
  profileUrl: response.profileUrl ?? "",
});

export const transformGymResponseToEntity = (response: GymResponse): Gym => ({
  gymId: response.gymId,
  name: response.gymName ?? "",
  address: response.address ?? "",
});

export const transformLevelResponseToEntity = (
  response: LevelResponse
): Level => ({
  levelId: response.levelId,
  name: response.levelName ?? "",
  color: response.levelColor ?? "",
});

export const transformJjikboulDetailResponseToEntity = (
  response: JjikboulDetailResponse
): JjikboulDetail => ({
  jjikboul: transformJjikboulResponseToEntity(response.jjikboul),
  memberInfo: transformMemberInfoResponseToEntity(response.memberInfo),
  gym: transformGymResponseToEntity(response.gym),
  level: transformLevelResponseToEntity(response.level),
  isEditable: response.isEditable,
  isDeletable: response.isDeletable,
});
