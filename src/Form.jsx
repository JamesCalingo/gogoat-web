/* eslint-disable react/prop-types */

function Form(props) {
  const {
    mode,
    system,
    enableForm,
    station,
    setStation,
    setDirection,
    setLine,
    isGoVisible,
    setIsGoVisible,
    handleClickGo,
  } = props;

  function renderStations(stations) {
    return (
      <select
        id="stations"
        defaultValue={"Select a station"}
        disabled={!enableForm}
        onChange={(event) => {
          setStation(
            system.find((station) => station.name === event.target.value)
          );
          setIsGoVisible(false);
        }}
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
        destinations.push("", "Boston");
      } else {
        destinations.push("Outbound", "Boston");
      }
    } else {
      destinations.push(station.destination_0, station.destination_1);
    }

    const onClick = (value) => {
      console.log(value);
      setDirection(value);
      setIsGoVisible(true);
    };
    return Object.keys(station).length ? (
      <>
        <p>
          Select{" "}
          {mode === "subway"
            ? "which station you're headed towards"
            : "your direction of travel"}
        </p>
        {destinations.map((destination, index) => {
          return destination ? (
            <button key={index} value={index} onClick={() => onClick(index)}>
              {destination}
            </button>
          ) : null;
        })}
      </>
    ) : null;
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
        { id: "CR-Kingston", line: "Kingston" },
        { id: "CR-Greenbush", line: "Greenbush" },
        { id: "CR-Fairmount", line: "Fairmount" },
        {id:"CR-NewBedford", line: "Fall River/New Bedford"},
      ],
      backbay: [
        { id: "CR-Worcester", line: "Worcester" },
        { id: "CR-Needham", line: "Needham" },
        { id: "CR-Franklin", line: "Franklin/Foxboro" },
        { id: "CR-Providence", line: "Providence/Stoughton" },
      ],
    };

    return (
      <>
        <p>Select line</p>
        <select
          defaultValue={"Select line"}
          disabled={!station}
          onChange={(event) => {
            setLine(event.target.value);
            setIsGoVisible(true);
            setDirection(0);
          }}
        >
          <option disabled>Select line</option>
          {destinations[origin].map((destination, index) => {
            return (
              <option key={index} value={destination.id}>
                {destination.line}
              </option>
            );
          })}
        </select>
      </>
    );
  }

  function renderGoButton() {
    return (
      <div className="buttondiv">
        <button hidden={!isGoVisible} onClick={handleClickGo}>
          Go GogoaT!
        </button>
      </div>
    );
  }

  return (
    <div>
      {system.length ? (
        <>
          <p>Select origin station</p>
          {renderStations(system)}
          {!!Object.keys(station).length && renderDirections(station)}
          {renderGoButton()}
        </>
      ) : null}
    </div>
  );
}

export default Form;
