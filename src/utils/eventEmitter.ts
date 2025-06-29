import mitt, { Emitter } from "mitt";

// 이벤트 종류 유니온 타입
export type EventType = "unAuthorized"; // 필요시 '...' 추가

// 이벤트 핸들러 타입
export type EventHandler = (payload?: unknown) => void;

const emitter: Emitter<Record<EventType, unknown>> =
  mitt<Record<EventType, unknown>>();
const handlers: Map<EventType, Set<EventHandler>> = new Map();

export const eventEmitter = {
  set(event: EventType, handler: EventHandler) {
    this.delete(event);
    emitter.on(event, handler);
    if (!handlers.has(event)) {
      handlers.set(event, new Set());
    }
    handlers.get(event)!.add(handler);
  },
  get(event: EventType): Set<EventHandler> | undefined {
    return handlers.get(event);
  },
  delete(event: EventType) {
    const hs = handlers.get(event);
    if (hs) {
      hs.forEach((handler) => {
        emitter.off(event, handler);
      });
      handlers.delete(event);
    }
  },
  emit(event: EventType, data?: unknown) {
    emitter.emit(event, data);
  },
  clear() {
    handlers.forEach((hs, event) => {
      hs.forEach((handler) => {
        emitter.off(event, handler);
      });
    });
    handlers.clear();
  },
};
