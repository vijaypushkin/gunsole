import { createSignal } from "solid-js";

import { Button } from "@kobalte/core/button";

function App() {
  const [count, setCount] = createSignal(0);

  return (
    <div class="card">
      <h1 class="text-3xl">WXT + Solid</h1>
      <div class="card">
        <Button
          class="btn btn-primary"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count()}
        </Button>
        <p>
          Edit <code>popup/App.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  );
}

export default App;
