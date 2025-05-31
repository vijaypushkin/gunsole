import { LogRenderer } from "@/components/LogRenderer";
import { templateEngine } from "@/utils/template";
import { GunsoleTab, MSG_TYPE } from "gunsole-shared";
import { createSignal, For, onCleanup, onMount } from "solid-js";
import { browser } from "wxt/browser";

// const handleTabCreation = (
//   tab: GunsoleTab,
//   setTabs: Setter<Record<string, GunsoleTab>>
// ) => {
//   setTabs((tabs) => ({
//     ...tabs,
//     [tab.name]: tab,
//   }));
// };

type TabData = {
  type: string;
  time: string;
  message: string;
};

function App() {
  const [logs, setLogs] = createSignal<TabData[]>([]);
  // const [tabs, setTabs] = createSignal<Record<string, GunsoleTab>>({});

  // ! currently using default tab, will make it dynamic later
  const defaultTab: GunsoleTab = {
    name: "log",
    type: "log",
    entryShell: `
      <div class="gunsole-basic-log">
        <div class="flex">
          <div>{{type}}</div>
          <div>{{time | formatDateTime}}</div>
        </div>
        <div>{{message}}</div>
      </div>
    `,
    css: `
      .gunsole-basic-log {
        border-bottom: 1px solid #ccc;
        padding: 8px 0;
      }

      .flex {
        display: flex;
        justify-content: space-between;
      }
    `,
  };

  onMount(() => {
    templateEngine.registerTemplate("basic", defaultTab.entryShell);

    const handler = (message: any) => {
      if (message.type === MSG_TYPE.CONTENT_SCRIPT_TO_DEVTOOLS) {
        setLogs((logs) => [...logs, message.data.payload]);
      }
    };

    browser.runtime.onMessage.addListener(handler);
    onCleanup(() => browser.runtime.onMessage.removeListener(handler));
  });

  return (
    <div class="p-4">
      <h1 class="text-3xl mb-4">Gunsole</h1>
      <ul class="list-disc pl-6 text-sm space-y-1">
        <style innerHTML={defaultTab.css} />
        <For each={logs()}>
          {(log, index) => (
            <LogRenderer
              template={defaultTab.entryShell}
              data={{
                ...log,
                index: index(),
              }}
              class="log-entry"
              onError={(error) => console.error("Log render error:", error)}
            />
          )}
        </For>
      </ul>
    </div>
  );
}

export default App;
