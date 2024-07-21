import { useEffect, useState } from "react";
import stations from "../stations.json";
import { displayDirection, formatTime, generateURL, predict } from "./utils";
import { Sentry } from "react-activity";
import "react-activity/dist/Sentry.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { findNext } from "./utils";

const mySwal = withReactContent(Swal);

function Predictor(props) {
  const { prev } = props;

  const [mode, setMode] = useState("");
  const [system, setSystem] = useState([]);
  const [station, setStation] = useState({});
  const [direction, setDirection] = useState("");
  const [line, setLine] = useState("");
  const [saved, setSaved] = useState({});
  const [save, setSave] = useState(false);
  const [prediction, setPrediction] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [goVisible, setGoVisible] = useState(false);

  useEffect(() => {
    if (save) {
      console.log(saved);
      localStorage.setItem("saved", JSON.stringify(saved));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [save]);

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
// Function to render destinations for North, South, and Back Bay
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
          <button hidden={!goVisible} onClick={handleClickGo}>
            Go GogoaT!
          </button>
        </div>
      </div>
    );
  }


  function handleClickGo() {
    setIsLoading(true);
    setSave(false);
    let url = generateURL(station, direction, line);
    setSaved({
      origin: station.name,
      destination: displayDirection(station, direction),

      url: url,
    });
    predict(url)
      .then((res) => {
        res.json().then((data) => {
          console.log(data);
          if (data.data.length) {
            let next = findNext(data.data);
            setPrediction(next);
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

  function handleClickSave() {
    setSave(true);
    if (prev) {
      mySwal.fire({
        title: "Overwrite previous trip?",
        text: "You can only have one trip saved at a time. Would you like to overwrite the previous trip for this one?",
        showCancelButton: "true",
      }).then(result => {
        if(result.isConfirmed) {
          window.location.reload()
        }
      });
    } else {
      mySwal
        .fire({
          title: "Saved!",
          text: "Note that you can only have one prediction saved at a time.",
        })
        .then(() => window.location.reload());
    }
  }
 
  function renderPrediction() {
    return (
      <div>
        {prediction.attributes.error ? (
          <h2>{prediction.attributes.error}</h2>
        ) : (
          <div>
            <h2>
              It looks like the next train from {station.name} heading{" "}
              {displayDirection(station, direction)} should be around
              <br />
              <span className="time">
                {formatTime(
                  prediction.attributes.arrival_time
                    ? prediction.attributes.arrival_time
                    : prediction.attributes.departure_time
                )}
              </span>
            </h2>
          </div>
        )}
        <button onClick={() => reset()}>Find another train</button>
        {station.line ? (
          <button onClick={() => handleClickSave()}>Save to Favorites</button>
        ) : (
          <p>
            The ability to save commuter rail trips as favorites is currently
            unavailable
          </p>
        )}
      </div>
    );
  }

  function reset() {
    setMode("");
    setSystem([]);
    setStation({});
    setLine("");
    setDirection("");
    setPrediction({});
    setGoVisible(false);
  }

  return (
    <>
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

export default Predictor;
