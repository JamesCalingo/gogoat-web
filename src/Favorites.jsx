import { useEffect, useState } from "react";
import { predict, formatTime } from "./utils";
import { Sentry } from "react-activity";
import "react-activity/dist/Sentry.css";

function Favorites() {
  const [prediction, setPrediction] = useState({});
  const station = {
    name: "Newton Centre",
    id: "place-newto",
    line: "Green-D",
  };

  useEffect(() => {
  predict(station, 1, "")
    .then((res) => res.json())
    .then((data) => {
      setPrediction(data.data[0]);
    });
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [])



console.log(prediction)
  return (
    <>
      <p>Previous searches</p>

      <div>Newton Centre to Union Square: {prediction ? prediction.attributes ? formatTime(prediction.attributes.arrival_time): <Sentry /> : <Sentry /> }</div>
    </>
  );
}

export default Favorites;
