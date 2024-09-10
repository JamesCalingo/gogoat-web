/* eslint-disable react/prop-types */

import { displayDirection, formatTime } from "./utils";

function Prediction(props) {
    const {prediction,
        station,
        mode,
        direction,
        times,
        reset,
        save
    } = props

    return (
      <div>
        {prediction.attributes.error ? (
          <h2>{prediction.attributes.error}</h2>
        ) : (
          <div>
            <h2>
              It looks like the next train from {station.name} heading{direction === "0" && mode === "commuter" ?" " : " to "}
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
            <p>Additional times:<br />{
               times && times.length ? times.map((time, index) => <span key={index}>{formatTime(time)}<br /></span>) : "N/A"
              }
              </p>
          </div>
        )}
        <button onClick={() => reset()}>Find another train</button>

        <button onClick={() => save()}>Save as Favorite</button>
      </div>
    );
  }

  export default Prediction