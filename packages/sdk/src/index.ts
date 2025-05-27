import {
  Gunsole,
  GunsoleOptions,
  GunsoleTab,
  MSG_SOURCE,
  MSG_TYPE,
} from "gunsole-shared";

export function createGunsole(options: GunsoleOptions = {}): Gunsole {
  const { enabled = true } = options;

  const tabs = new Map<string, GunsoleTab>();

  const noop = () => {};

  const send = enabled
    ? (tabId: string, object: Record<string, unknown>) => {
        const tab = tabs.get(tabId);

        if (tab) {
          window.postMessage(
            {
              type: MSG_TYPE.GUNSOLE_SDK_MESSAGE,
              source: MSG_SOURCE.GUNSOLE_SDK,
              tab: "log", // default for now; can be dynamic later
              payload: object,
            },
            "*"
          );
        }
      }
    : noop;

  const registerTab = enabled
    ? (name: string, params: GunsoleTab) => {
        tabs.set(name, params);

        window.postMessage(
          {
            type: MSG_TYPE.GUNSOLE_SDK_TAB_REGISTERED,
            source: MSG_SOURCE.GUNSOLE_SDK,
            payload: params,
          },
          "*"
        );
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
