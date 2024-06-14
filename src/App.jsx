import { useState } from "react";
import stations from "../stations.json";
import "./App.css";
import { Sentry } from "react-activity";
import "react-activity/dist/Sentry.css";

function App() {
  const [mode, setMode] = useState("");
  const [system, setSystem] = useState([]);
  const [station, setStation] = useState({});
  const [direction, setDirection] = useState("");
  const [line, setLine] = useState("");
  const [goVisible, setGoVisible] = useState(false);
  const [prediction, setPrediction] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

  function swapMode(newMode) {
    setMode(newMode);
    setStation({});
    setDirection("");
    if (newMode === "commuter") {
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

  function renderModes() {
    return (
      <>
      <h2>Find your train instantly!</h2>
        <p>What mode are you taking?</p>
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
      </>
    );
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
    if (mode === "commuter") {
      if (
        inboundTerminals.includes(station.name) ||
        station.name === "Back Bay"
      ) {
        switch (station.name) {
          case "South Station":
            return renderDestinations("south");
          case "North Station":
            return renderDestinations("north");
          case "Back Bay":
            return renderDestinations("backbay");
          //NOTE: There's an argument to be made that Back Bay should also have an "Inbound to Boston" option, but this movement seems rather uncommon...
        }
      } else if (outboundTerminals.includes(station.name)) {
        destinations.push("", "Inbound to Boston");
      } else {
        destinations.push("Outbound", "Inbound to Boston");
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

  function renderDestinations(origin) {
    const destinations = {
      north: [
        { id: "CR-Newburyport", line: "Newburyport/Rockport" },
        { id: "CR-Haverhill", line: "Haverhill" },
        { id: "CR-Lowell", line: "Lowell" },
        { id: "CR-Fitchburg", line: "Fitchburg" },
      ],
      south: [
        { id: "CR-Worcester", line: "Worcester" },
        { id: "CR-Needham", line: "Needham" },
        { id: "CR-Franklin", line: "Franklin/Foxboro" },
        { id: "CR-Providence", line: "Providence/Stoughton" },
        { id: "CR-Middleborough", line: "Middleboro/Lakeville" },
        { id: "CR-Kingston", line: "Kingston" },
        { id: "CR-Greenbush", line: "Greenbush" },
        { id: "CR-Fairmount", line: "Fairmount" },
      ],
      backbay: [
        { id: "CR-Worcester", line: "Worcester" },
        { id: "CR-Needham", line: "Needham" },
        { id: "CR-Franklin", line: "Franklin/Foxboro" },
        { id: "CR-Providence", line: "Providence/Stoughton" },
      ],
    };

    return (
      <select
        defaultValue={"Select direction"}
        onChange={(event) => {
          setLine(event.target.value);
          setGoVisible(true);
          setDirection(0);
        }}
      >
        <option disabled>Select direction</option>
        {destinations[origin].map((destination, index) => {
          return (
            <option key={index} value={destination.id}>
              {destination.line}
            </option>
          );
        })}
      </select>
    );
  }

  function handleGo() {
    setIsLoading(true);
    let url = "";
    if (station.type === "subway") {
      url = `https://api-v3.mbta.com/predictions?sort=departure_time&page[limit]=5&filter[stop]=${station.id}&filter[route]=${station.line}&filter[direction_id]=${direction}&filter[revenue]=REVENUE`;
    } else {
      // Due to "issues" with the prediction API for commuter rail trains, I use the schedule API
      let currentTime = new Date().toTimeString().split(" ")[0].slice(0, 5);
      url = `https://api-v3.mbta.com/schedules?sort=departure_time&page[limit]=1&filter[min_time]=${currentTime}&filter[stop]=${station.id}&filter[direction_id]=${direction}`;
      if (line) {
        url += `&filter[route]=${line}`;
        console.log(url);
      }
    }
    fetch(url)
      .then((res) => {
        res.json().then((data) => {
          console.log(data);
          if (data.data.length) {
            setPrediction(data.data[0]);
          } else {
            setPrediction({
              attributes: { error: "No prediction found." },
            });
          }
        });
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

  function renderSelections() {
    return (
      <div>
        {renderModes()}
        {system.length ? (
          <>
            <p>Next, what station are you travelling from?</p>
            {renderStations(system)}
          </>
        ) : null}
        {Object.keys(station).length ? (
          <>
            <p>Where are you heading towards?</p>
            {renderDirections(station)}
          </>
        ) : null}
        <div className="buttondiv">
          <button hidden={!goVisible} onClick={handleGo}>
            Go GogoaT!
          </button>
        </div>
      </div>
    );
  }

  function renderPrediction() {
    return (
      <div>
        {prediction.attributes.error ? (
          <h2>{prediction.attributes.error}</h2>
        ) : (
          <div>
            <h2>
              It looks like the next train from {station.name} heading {direction != 0
                ? station.destination_1
                  ? station.destination_1
                  : "inbound"
                : station.destination_0
                ? station.destination_0
                : "outbound"} should be around
          
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
    );
  }

  function reset() {
    setMode("");
    setSystem([]);
    setStation({});
    setLine("");
    setDirection("");
    setGoVisible(false);
    setPrediction({});
  }

  return (
    <>
      <div>
        <h1>GogoaT</h1>
   
      </div>

      {isLoading ? (
        <Sentry />
      ) : !Object.keys(prediction).length ? (
        renderSelections()
      ) : (
        renderPrediction()
      )}
    </>
  );
}

export default App;
