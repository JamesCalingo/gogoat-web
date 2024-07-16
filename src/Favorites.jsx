/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { predict, formatTime } from "./utils";

function Favorites(props) {
  const [prediction, setPrediction] = useState({});
 const {data} = props



  useEffect(() => {
    if (Object.keys(data).length) {
      console.log(data.url);
      predict(data.url)
        .then((res) => res.json())
        .then((data) => {
          setPrediction(data.data[0]);
          console.log(prediction);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
      <h2>Previously saved trip:</h2>

      <b>{data ? data.origin : ""} {data.destination}: {prediction ? prediction.attributes ? formatTime(prediction.attributes.departure_time): "N/A": "N/A" }</b>
    </>
  );
}

export default Favorites;
