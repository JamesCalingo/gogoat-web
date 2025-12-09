/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { generateURL, findNext, formatTime, getAlert } from "../utils/utils";
import { checkForAlerts, predict } from "../utils/api";

function Favorites(props) {
  const [prediction, setPrediction] = useState({});
  const [alert, setAlert] = useState("");
  const { data } = props;
  console.log(data);

  useEffect(() => {
    if (Object.keys(data).length) {
      let url = generateURL(data, data.direction, data.line, data.pattern);
      console.log(url);
      predict(url)
        .then((res) => {
          let data = res.data.data;
          if (data.length) {
            let next = findNext(data);
            setPrediction(next);
          } else {
            setPrediction({
              attributes: {
                error: "No data.",
              },
            });
          }
        })
        .catch((err) => {
          console.log(err);
          setPrediction({
            attributes: {
              error: err,
            },
          });
        });
      checkForAlerts(data.id, data.line).then((res) => {
        if (res.data.data.length) {
          const header = getAlert(res);
          setAlert(header);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  function handlePressClear() {
    localStorage.clear();
    window.location.reload();
  }

  return (
    <>
      <h2>
        <em>Previously saved trip:</em>
      </h2>
      <div className="saved">
      <h2
        className={
          data.mode === "subway"
            ? !data.line.includes("Green")
              ? `${data.line} sign-top`
              : "Green sign-top"
            : "commuter sign-top"
        }
      >
        {data ? data.origin : ""} &#8594; {data.destination}<br />
          </h2>
        <h3 className="time sign-bottom">
          {prediction
            ? prediction.attributes
              ? formatTime(
                  prediction.attributes.arrival_time
                    ? prediction.attributes.arrival_time
                    : prediction.attributes.departure_time
                )
              : "N/A"
            : "..."}
        </h3>
        </div>
      {!!alert && (
        <>
          <h3>ALERT:</h3>
          <p>{alert}</p>
        </>
      )}
      <button onClick={handlePressClear}>Clear</button>
    </>
  );
}

export default Favorites;
