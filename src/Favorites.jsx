/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { predict, findNext, formatTime } from "./utils";

function Favorites(props) {
  const [prediction, setPrediction] = useState({});
  const { data } = props;

  useEffect(() => {
    if (Object.keys(data).length) {
      console.log(data.url);
      predict(data.url)
        .then((res) => res.json())
        .then((data) => {
          let next = findNext(data.data);
          setPrediction(next);
          console.log(prediction);
        })
        .catch((err) => {
          console.log(err);
          setPrediction({
            attributes: {
              error: err,
            },
          });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
      <h2>
        <em>Previously saved trip:</em>
      </h2>

      <h2>
        {data ? data.origin : ""} {data.destination}:<br />
        <span className="time">
          {prediction.attributes
            ? prediction.attributes.arrival_time
              ? formatTime(
                  prediction.attributes.arrival_time
                    ? prediction.attributes.arrival_time
                    : prediction.attributes.departure_time
                )
              : "N/A"
            : "..."}
        </span>
      </h2>
    </>
  );
}

export default Favorites;
