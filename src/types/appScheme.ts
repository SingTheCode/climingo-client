export type ShareData = {
  title?: string;
  text?: string;
  url: string;
};

export type ShareParams = ShareData | string;

export interface WebkitMessageHandler {
  postMessage(message: ShareParams): void;
}

export interface WebkitMessageHandlers {
  share: WebkitMessageHandler;
}

export interface WebkitNamespace {
  messageHandlers: WebkitMessageHandlers;
}

declare global {
  interface Window {
    webkit?: WebkitNamespace;
  }
}