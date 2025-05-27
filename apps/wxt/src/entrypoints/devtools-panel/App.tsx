import { MSG_TYPE } from "gunsole-shared";
import { createSignal, onCleanup, onMount } from "solid-js";
import { browser } from "wxt/browser";

const handleTabCreation = (tab, setTabs) => {};

function App() {
  const [logs, setLogs] = createSignal<string[]>([]);
  const [tabs, setTabs] = createSignal<Record<string, number>>({});

  onMount(() => {
    const handler = (message: any) => {
      if (message.type === MSG_TYPE.CONTENT_SCRIPT_TO_DEVTOOLS) {
        console.log("Received from gunsole-sdk:", message.data);

        setLogs((logs) => [...logs, JSON.stringify(message.data)]);
      }
    };

    browser.runtime.onMessage.addListener(handler);
    onCleanup(() => browser.runtime.onMessage.removeListener(handler));
  });

  return (
    <div class="p-4">
      <h1 class="text-3xl mb-4">Gunsole</h1>
      <ul class="list-disc pl-6 text-sm space-y-1">
        {logs().map((log) => (
          <li innerHTML={log} />
        ))}
      </ul>
    </div>
  );
}

export default App;
