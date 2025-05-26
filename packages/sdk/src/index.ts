import template from "lodash/template";

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

function renderLog<T extends Record<string, unknown>>(
  entryShell: string,
  data: T
) {
  const rendered = template(entryShell, {
    interpolate: /{([\s\S]+?)}/g,
  })(data);

  window.postMessage(
    {
      type: "GUNSOLE_SDK_MESSAGE",
      source: "gunsole-sdk",
      tab: "log", // default for now; can be dynamic later
      payload: rendered,
    },
    "*"
  );
}

export function createGunsole(options: GunsoleOptions = {}): Gunsole {
  const { enabled = true } = options;

  const tabs = new Map<string, GunsoleTab>();

  const noop = () => {};

  const send = enabled
    ? (tabId: string, object: Record<string, unknown>) => {
        const tab = tabs.get(tabId);

        if (tab) {
          renderLog(tab.entryShell, object);
        }
      }
    : noop;

  const registerTab = enabled
    ? (name: string, params: GunsoleTab) => {
        tabs.set(name, params);

        console.log(`[Gunsole] Tab registered: ${name}`);
      }
    : noop;

  // ? registering default tabs
  registerTab("log", {
    name: "log",
    type: "log",
    entryShell: `
      <div class="gunsole-basic-log">
        <div class="flex">
          <div>{type}</div>
          <div>{time}</div>
        </div>
        <div>{message}</div>
      </div>
    `,
  });

  return { send, registerTab };
}
