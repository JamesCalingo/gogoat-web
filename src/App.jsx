import { useState, useEffect } from "react";
import "./App.css";
import Favorites from "./Favorites";
import Predictor from "./Predictor";

function App() {
  const [stored, setStored] = useState({});

  useEffect(() => {
    const storage = JSON.parse(localStorage.getItem("saved"));

    if (storage && Object.keys(storage).length) {
      setStored(storage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div>
        <h1>GogoaT</h1>
      </div>

      <Predictor prev={Object.keys(stored).length ? stored: null} />
      {Object.keys(stored).length ? <Favorites data={stored} /> : null}
    </>
  );
}

export default App;
