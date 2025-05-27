export type GunsoleOptions = {
  enabled?: boolean;
};

export type GunsoleTab<T extends Record<string, unknown> = any> = {
  name: string;
  type: "log" | "html";
  entryShell: string;
  globalShell?: string;
};

export type Gunsole = {
  send: {
    (tabId: string, object: Record<string, unknown>): void;
  };
  registerTab: <T extends Record<string, unknown>>(
    id: string,
    params: GunsoleTab<T>
  ) => void;
};
