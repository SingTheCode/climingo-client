import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";

String.prototype.fromNowFormat = function () {
  dayjs.locale("ko");
  dayjs.extend(relativeTime);
  const timestamp = this.toString();

  return dayjs(timestamp).fromNow();
};
