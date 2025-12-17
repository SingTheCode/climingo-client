export type ShareData = {
  title?: string;
  text?: string;
  url: string;
};

export type ShareParams = ShareData | string;

export type ImageDownloadParams = {
  url: string;
};

export type ImageDownloadResult = {
  success: boolean;
  message: string;
};

export interface WebkitMessageHandler {
  postMessage(message: ShareParams): void;
}

export interface WebkitDownloadMessageHandler {
  postMessage(message: ImageDownloadParams): void;
}

export interface WebkitMessageHandlers {
  share: WebkitMessageHandler;
  downloadImage: WebkitDownloadMessageHandler;
}

export interface WebkitNamespace {
  messageHandlers: WebkitMessageHandlers;
}

declare global {
  interface Window {
    webkit?: WebkitNamespace;
    onImageDownloadStart?: () => void;
    onImageDownloadComplete?: (result: ImageDownloadResult) => void;
  }
}
