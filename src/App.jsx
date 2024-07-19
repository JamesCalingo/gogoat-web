import { useState, useEffect } from "react";
import "./App.css";
import Favorites from "./Favorites";
import Predictor from "./Predictor";

function App() {
  const [saved, setSaved] = useState({});

  useEffect(() => {
    const apicall = JSON.parse(localStorage.getItem("apicall"));

    if (apicall && Object.keys(apicall).length) {
      setSaved(apicall);
    }
    console.log(saved);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div>
        <h1>GogoaT</h1>
      </div>

      <Predictor />
      {Object.keys(saved).length ? <Favorites data={saved} /> : null}
    </>
  );
}

export default App;
