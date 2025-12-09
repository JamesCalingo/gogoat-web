/* eslint-disable react/prop-types */

import { displayDirection, displayLineName, formatTime } from "../utils/utils";

function Prediction(props) {
    const {prediction,
        station,
        mode,
        line,
        pattern,
        direction,
        times,
        alert,
        reset,
        save
    } = props

    return (
      <>
        <div>
        {prediction.attributes.error ? (
          <>
          <h2>{prediction.attributes.error}</h2>
          {!!alert && <><h2 className="prediction_section_header">ALERT:</h2><span>{alert}</span></>}

          </>
        ) : (
          <div>
            <h2 className={mode === "subway" ? !line.includes("Green") ? `${line} sign-top` : "Green sign-top" : "commuter sign-top"} >{station.name}</h2>
            <h3 className="sign-bottom">{!!(mode === "subway" || direction) && "TO"} {displayDirection(station, direction, displayLineName(line), pattern)}</h3>
            <h2>
              It looks like your train should be sometime around
              <br />
              <span className="time">
                {formatTime(
                  prediction.attributes.arrival_time
                    ? prediction.attributes.arrival_time
                    : prediction.attributes.departure_time
                )}
              </span>
            </h2>
            <h2 className="prediction_section_header">Additional times:</h2>{
               times && times.length ? times.map((time, index) => <span key={index} className="additional_time">{formatTime(time)}<br /></span>) : "N/A"
              }
              
              {alert && <><h2 className="prediction_section_header">ALERT:</h2><span>{alert}</span></>}
          </div>
        )}
        </div>
        <button onClick={() => reset()}>Find another train</button>

      {!prediction.attributes.error ?  <button onClick={() => save()}>Save as Favorite</button> : null}
      </>
    );
  }

  export default Prediction