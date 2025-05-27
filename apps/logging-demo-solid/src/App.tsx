import { createSignal } from "solid-js";
import { gunsole } from "./utils/gunsole";

function App() {
  const [count, setCount] = createSignal(0);

  const handleIncrement = () => {
    setCount(count() + 1);
    gunsole.send("log", {
      type: "log",
      time: new Date().toISOString(),
      message: "count incremented to " + count(),
    });
  };

  const handleDecrement = () => {
    setCount(count() - 1);
    gunsole.send("log", {
      type: "log",
      time: new Date().toISOString(),
      message: "count decremented to " + count(),
    });
  };

  return (
    <div class="p-4">
      <h1 class="text-3xl mb-4">Logging Demo Solid</h1>

      <div class="flex gap-2 items-center">
        <button class="btn" onClick={handleIncrement}>
          Increment
        </button>
        <div>{count()}</div>
        <button class="btn" onClick={handleDecrement}>
          Decrement
        </button>
      </div>
    </div>
  );
}

export default App;
