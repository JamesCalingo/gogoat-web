import { useEffect, useState } from "react";
import stations from "../stations.json";
// import Subway from "./Subway";
import "./App.css";

function App() {
  const [mode, setMode] = useState("");
  const [system, setSystem] = useState([]);
  const [station, setStation] = useState({});
  const [direction, setDirection] = useState("");
  const [goVisible, setGoVisible] = useState(false);
  const [prediction, setPrediction] = useState({});

  const inboundTerminals = ["North Station", "South Station"];
  const outboundTerminals = [
    "Middleborough/Lakeville",
    "Kingston",
    "Greenbush",
    "Rockport",
    "Newburyport",
    "Haverhill",
    "Lowell",
    "Watchusett",
    "Worcester",
    "Needham Heights",
    "Forge Park/495",
    "Wickford Junction",
    "Stoughton",
  ];

  useEffect(() => {
    setSystem(
      stations
        .filter((station) => station.type === mode)
        .sort((a, b) => {
          if (a.name < b.name) return -1;
          return 1;
        })
    );
    system;
  }, [mode]);

  function swapMode(newMode) {
    setMode(newMode);
    setStation({});
    setDirection("");
  }

  function renderStations(stations) {
    return (
      <select
        defaultValue={"Select a station"}
        onChange={(event) =>
          setStation(
            system.find((station) => station.name === event.target.value)
          )
        }
      >
        <option disabled>Select a station</option>
        {stations.map((station, index) => {
          return (
            <option key={index} value={station.name}>
              {station.name ? station.name : station}
            </option>
          );
        })}
      </select>
    );
  }

  function renderDirections() {
    let destinations = [];
    if (station.type === "commuter") {
      if (inboundTerminals.includes(station.name)) {
        destinations.push("Outbound", "");
      } else if (outboundTerminals.includes(station.name)) {
        destinations.push("", "Inbound");
      } else {
        destinations.push("Outbound", "Inbound");
      }
    } else {
      destinations.push(station.destination_0, station.destination_1);
    }

    return (
      <select
        defaultValue={"Select direction"}
        onChange={(event) => {
          setDirection(event.target.value);
          setGoVisible(true);
        }}
      >
        <option disabled>Select direction</option>
        {destinations.map((destination, index) => {
          return (
            <option
              disabled={destination ? false : true}
              key={index}
              value={index}
            >
              {destination ? destination : "---"}
            </option>
          );
        })}
      </select>
    );
  }

  function handleGo() {
    console.log(station.id, direction);
    if (station.type === "subway") {
      fetch(
        `https://api-v3.mbta.com/predictions?sort=departure_time&page[limit]=5&filter[stop]=${station.id}&filter[route]=${station.line}&filter[direction_id]=${direction}&filter[revenue]=REVENUE`
      ).then((res) => {
        res.json().then((data) => {
          console.log(data);
          if (data.data.length) {
            setPrediction(data.data[0]);
            console.log(prediction)
          } else {
            setPrediction({
              attributes: { error: "No prediction found." },
            });
          }
        });
      });
    } else {
      let currentTime = new Date().toTimeString().split(" ")[0].slice(0, 5);
      fetch(
        `https://api-v3.mbta.com/schedules?sort=departure_time&page[limit]=1&filter[min_time]=${currentTime}&filter[stop]=${station.id}&filter[direction_id]=${direction}`
      ).then((res) => {
        res.json().then((data) => {
          if (data.data.length) {
            setPrediction(data.data[0]);
          } else {
            setPrediction({
              attributes: { error: "No prediction found." },
            });
          }
        });
      });
    }
  }

  function reset() {
    setMode("");
    setSystem([]);
    setStation({});
    setDirection("");
    setGoVisible(false);
    setPrediction({});
  }

  return (
    <>
      <div>
        <h1>GogoaT</h1>
        <h2>Find your train instantly!</h2>
      </div>
      {!Object.keys(prediction).length ? (
        <div>
          <p>First, what mode are you taking?</p>
          <button
            className={mode === "subway" ? "selected" : null}
            onClick={() => swapMode("subway")}
          >
            Subway
          </button>
          <button
            className={mode === "commuter" ? "selected" : null}
            onClick={() => swapMode("commuter")}
          >
            Commuter
          </button>
          {system.length ? (
            <>
              <p>Next, what station are you travelling from?</p>
              {renderStations(system)}
            </>
          ) : null}
          {Object.keys(station).length ? (
            <>
              <p>
                Which {mode === "subway" ? "station" : "direction"} are you
                heading towards?
              </p>
              {renderDirections(station)}
            </>
          ) : null}
          <div className="buttondiv">
            <button hidden={!goVisible} onClick={handleGo}>
              Go GogoaT!
            </button>
          </div>
        </div>
      ) : (
        <div>
          {prediction.attributes.error ? (
            <h2>{prediction.attributes.error}</h2>
          ) : (
            <div>
              <h2>{station.name}</h2>
              <h3>
                {direction
                  ? station.destination_1
                    ? station.destination_1
                    : "Inbound"
                  : station.destination_0
                  ? station.destination_0
                  : "Outbound"}
              </h3>
              <h2 id="prediction">
                Your train should be around
                <br />
                <span
                  className={
                    station.line ? `${station.line.toLowerCase()} time` : "time"
                  }
                >
                  {new Date(
                    prediction.attributes.arrival_time
                      ? prediction.attributes.arrival_time
                      : prediction.attributes.departure_time
                  ).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </h2>
            </div>
          )}
          <button onClick={() => reset()}>Find another train</button>
        </div>
      )}
    </>
  );
}

export default App;
