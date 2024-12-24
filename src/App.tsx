import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <p className="text-gray-500 flex justify-center items-center gap-2">
        Something is cooking right now, just wait
        <span role="img" aria-label="smile">
          😄
        </span>
      </p>
    </div>
  );
}

export default App;
