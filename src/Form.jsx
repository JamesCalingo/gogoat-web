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
    handleClickGo
  } = props;



  function renderStations(stations) {
    return (
      <select
      id="stations"
        defaultValue={"Select a station"}
        disabled={!enableForm}
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

    return (
      <select
        defaultValue={"Select direction"}
        disabled={!Object.keys(station).length}
        onChange={(event) => {
          setDirection(event.target.value);
          setIsGoVisible(true);
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
        disabled={!station}
        onChange={(event) => {
            setLine(event.target.value);
            setIsGoVisible(true);
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

  function renderGoButton() {
    return   <div className="buttondiv">
    <button hidden={!isGoVisible} onClick={handleClickGo}>
      Go GogoaT!
    </button>
  </div>
  }

    return (
      <div>
        {system.length ? (
          <>
            <p>Select origin station</p>
            {renderStations(system)}
            <p>
              Select{" "}
              {mode === "subway"
                ? "which station you're headed towards"
                : "your direction of travel"}
            </p>
            {renderDirections(station)}
            {renderGoButton()}
          </>
        ) : null}

      </div>
    );

}

export default Form;
