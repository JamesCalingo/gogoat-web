/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Sentry } from "react-activity";
import "react-activity/dist/Sentry.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import stations from "../stations.json";
import { displayDirection, generateURL, predict, findNext, displayLineName } from "./utils";
import Form from "./Form";
import Prediction from "./Prediction";

const mySwal = withReactContent(Swal);

function Predictor(props) {
  const { prev, onFormVisible, onReset} = props;

  const [mode, setMode] = useState("");
  const [system, setSystem] = useState([]);
  const [station, setStation] = useState({});
  const [direction, setDirection] = useState("");
  const [line, setLine] = useState("");

  const [saved, setSaved] = useState({});
  const [save, setSave] = useState(false);
  const [prediction, setPrediction] = useState({});
  const [times, setTimes] =useState( [])

  const [isLoading, setIsLoading] = useState(false);
  const [isGoVisible, setIsGoVisible] = useState(false);

  useEffect(() => {
    if (save) {
      console.log(saved);
      localStorage.setItem("saved", JSON.stringify(saved));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [save]);

  function swapMode(newMode) {
    onFormVisible(false);
    reset()
    setMode(newMode);
   
    if (newMode === "commuter") {
      //Setting South and North stations ahead of everything due to their status as terminals
      setSystem([
        {
          name: "South Station",
          id: "place-sstat",
        },
        {
          name: "North Station",
          id: "place-north",
        },
        ...stations[newMode].sort((a, b) => {
          if (a.name < b.name) return -1;
          return 1;
        }),
      ]);
    } else {
      setSystem(
        stations[newMode].sort((a, b) => {
          if (a.name < b.name) return -1;
          return 1;
        })
      );
    }
  }

  function handleClickGo() {
    setIsLoading(true);
    setSave(false);
    
    let url = generateURL(station, direction, line);
    console.log(url);
    setSaved({
      origin: station.name,
      mode: mode,
      line: station.line,
      destination: line && mode === "commuter" ? displayLineName(line) : displayDirection(station, direction, line ? line : null),
      id: station.id,
      direction: direction,
    });
    predict(url)
      .then((res) => {
          let data = res.data.data;
          if (data.length) {
            let next = findNext(data);
            setPrediction(next);
            let additionalTimes = []
            for(let i = data.indexOf(next) + 1; i < data.length; i++) {
              additionalTimes.push(data[i].attributes.arrival_time ? data[i].attributes.arrival_time : data[i].attributes.departure_time)
            }
            setTimes(additionalTimes)
          } else {
            setPrediction({
              attributes: { error: "No prediction found." },
            });
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPrediction({
            attributes: {
              error: "An error occurred when trying to get your data. Try again.",
            },
          });
        });
        
      }
      
      function handleClickSave() {
        setSave(true);
        if (prev) {
          mySwal
          .fire({
            title: "Overwrite previous trip?",
            text: "You can only have one trip saved at a time. Would you like to overwrite the previous trip for this one?",
            showCancelButton: "true",
          })
          .then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        } else {
          window.location.reload();
        }
      }
      
      function reset() {
        setMode("");
        setSystem([]);
        setStation({});
        setLine("");
        setDirection("");
        setPrediction({});
        setIsGoVisible(false);
        onFormVisible();
        setTimes([]);
        onReset()
      }
      
   
      return (
        <>
      {isLoading ? (
        <Sentry />
      ) : !Object.keys(prediction).length ? (
        <>
        <Form
        mode={mode}
        swapMode={swapMode}
        system={system}
        station={station}
        setStation={setStation}
        setDirection={setDirection}
        setLine={setLine}
        isGoVisible={isGoVisible}
        setIsGoVisible={setIsGoVisible}
        handleClickGo={handleClickGo} />
        </>
      ) : (
        <Prediction
        prediction={prediction}
        station={station}
        mode={mode}
        line={displayLineName(line)}
        direction={direction}
        times={times}
        reset={reset}
        save={handleClickSave}
         />
      )}
    </>
  );
}

export default Predictor;
