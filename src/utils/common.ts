import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";

import { authStorage } from "@/utils/webStorage";

export const fromNowFormat = (timestamp: string) => {
  dayjs.locale("ko");
  dayjs.extend(relativeTime);

  return dayjs(timestamp).fromNow();
};

export const cloneDeep = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const loginCheck = () => {
  const isAuthorized = !!authStorage.get();

  if (isAuthorized) {
    return true;
  }

  if (confirm("로그인이 필요한 서비스입니다. 로그인 하시겠습니까?")) {
    authStorage.remove();
    location.href = "/signIn";
    return false;
  } else if (location.pathname !== "/") {
    location.href = "/";
  }

  return false;
};
