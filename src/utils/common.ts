import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";

export const fromNowFormat = (timestamp: string) => {
  dayjs.locale("ko");
  dayjs.extend(relativeTime);

  return dayjs(timestamp).fromNow();
};

export const cloneDeep = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));
