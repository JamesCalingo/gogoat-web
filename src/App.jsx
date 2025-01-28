import { useState, useEffect } from "react";
import "./App.css";
import Favorites from "./Favorites";
import Predictor from "./Predictor";

function App() {
  const [stored, setStored] = useState({});
  const [isBottomVisible, setIsBottomVisible] = useState(true);

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

      <Predictor
        prev={Object.keys(stored).length ? stored : null}
        onFormVisible={() => setIsBottomVisible(false)}
        onReset={()=> setIsBottomVisible(true)}
      />
      {isBottomVisible && Object.keys(stored).length ? <Favorites data={stored} /> : null}
        
       {!window.matchMedia("(display-mode: standalone)").matches && (
              <>
              <p>
                This app can be downloaded to your device. To learn more, check here:
              </p>
              <a
                href="https://www.cdc.gov/niosh/mining/content/hearingloss/installPWA.html"
                target="blank"
              >
                How to install a PWA
              </a>
            </>
          )}
    </>
  );
}

export default App;
