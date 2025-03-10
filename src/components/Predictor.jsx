/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Sentry } from "react-activity";
import "react-activity/dist/Sentry.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import Form from "./Form";
import Prediction from "./Prediction";
import stations from "../../stations.json";
import {
  displayDirection,
  generateURL,
  findNext,
  displayLineName,
  resetSelect,
  getAlert,
} from "../utils/utils";
import { predict, checkForAlerts } from "../utils/api";

const mySwal = withReactContent(Swal);

function Predictor(props) {
  const { prev, onFormVisible, onReset } = props;

  const [mode, setMode] = useState("");
  const [system, setSystem] = useState([]);
  const [station, setStation] = useState({});
  const [enableForm, setEnableForm] = useState(false);
  const [direction, setDirection] = useState("");
  const [line, setLine] = useState("");
  const [saved, setSaved] = useState({});
  const [save, setSave] = useState(false);
  const [prediction, setPrediction] = useState({});
  const [times, setTimes] = useState([]);
  const [alert, setAlert] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoVisible, setIsGoVisible] = useState(false);

  const stationsSelect = document.getElementById("stations");

  useEffect(() => {
    if (save) {
      console.log(saved);
      localStorage.setItem("saved", JSON.stringify(saved));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [save]);

  function swapMode(newMode) {
    onFormVisible(false);
    reset();
    setMode(newMode);
    resetSelect(stationsSelect);
    if (newMode === "commuter") {
      //Setting South and North Stations ahead of everything due to their status as terminals
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
      setEnableForm(true);
    }
  }

  function renderModes() {
    return (
      <>
        <h2>Find your train instantly!</h2>
        {mode ? (
          <>
            <button
              onClick={() =>
                swapMode(mode === "subway" ? "commuter" : "subway")
              }
            >
              Switch to {mode === "subway" ? "Commuter Rail" : "Subway"}
            </button>{" "}
          </>
        ) : (
          <>
            <p>Select your mode of transportation:</p>
            <button onClick={() => swapMode("subway")}>Subway</button>
            <button onClick={() => swapMode("commuter")}>Commuter Rail</button>
          </>
        )}
      </>
    );
  }

  function renderLineSelections() {
    const lines = Object.keys(stations["subway"]).sort();
    lines.splice(
      lines.findIndex((line) => line.includes("Mattapan")),
      1
    );
    lines.push("Mattapan");
    const selectLine = (value) => {
      setLine(value);
      setSystem(stations["subway"][value]);
      setEnableForm(true);
    };

    const handleClickBack = () => {
      setLine("");
      setSystem([]);
      setStation({});
      setEnableForm(false);
      setIsGoVisible(false);
    };

    return line ? (
      <>
        {line !== "Mattapan" ? (
          <h3 className={line.includes("Green") ? "Green" : line}>
            {line.includes("-")
              ? `Green Line ${line[line.length - 1]}`
              : `${line} Line`}
          </h3>
        ) : (
          <h3 className="Mattapan">MATTAPAN TROLLEY</h3>
        )}
        <button onClick={() => handleClickBack()}>Change Line</button>
      </>
    ) : (
      <>
        <p>Select a Line</p>
        {lines.map((line, index) => {
          if (line.includes("-")) {
            let split = line.split("-");
            return (
              <button
                key={index}
                onClick={() => selectLine(line)}
                className="Green"
              >
                GREEN ({split[split.length - 1]})
              </button>
            );
          }
          return (
            <button
              key={index}
              onClick={() => selectLine(line)}
              className={line}
            >
              {line.toUpperCase()}
            </button>
          );
        })}
      </>
    );
  }

  function handleClickGo() {
    setIsLoading(true);
    setSave(false);
    setAlert("")
    let url = generateURL(station, direction, line);
    console.log(url);
    setSaved({
      origin: station.name,
      mode: mode,
      line: line,
      destination:
        line && mode === "commuter"
          ? displayLineName(line)
          : displayDirection(station, direction, line ? line : null),
      id: station.id,
      direction: direction,
    });
    predict(url)
      .then((res) => {
        let data = res.data.data;
        if (data.length) {
          let next = findNext(data);
          setPrediction(next);

          let additionalTimes = [];
          for (let i = data.indexOf(next) + 1; i < data.length; i++) {
            additionalTimes.push(
              data[i].attributes.arrival_time
                ? data[i].attributes.arrival_time
                : data[i].attributes.departure_time
            );
          }
          setTimes(additionalTimes);
          checkForAlerts(station.id, line).then((res) => {
            if (res.data.data.length) {
              const header = getAlert(res);
              setAlert(header);
            }
          });
        } else {
          setPrediction({
            attributes: { error: "No prediction found." },
          });
          checkForAlerts(station.id, line).then((res) => {
            if (res.data.data.length) {
              const header = getAlert(res);
              setAlert(header);
            }
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
    onReset();
  }

  return (
    <>
      {isLoading ? (
        <Sentry />
      ) : !Object.keys(prediction).length ? (
        <>
          {renderModes()}
          {mode === "subway" && renderLineSelections()}
          <Form
            mode={mode}
            swapMode={swapMode}
            system={system}
            enableForm={enableForm}
            station={station}
            setStation={setStation}
            setDirection={setDirection}
            setLine={setLine}
            isGoVisible={isGoVisible}
            setIsGoVisible={setIsGoVisible}
            handleClickGo={handleClickGo}
          />
        </>
      ) : (
        <Prediction
          prediction={prediction}
          station={station}
          mode={mode}
          line={(line)}
          direction={direction}
          times={times}
          alert={alert}
          reset={reset}
          save={handleClickSave}
        />
      )}
    </>
  );
}

export default Predictor;
