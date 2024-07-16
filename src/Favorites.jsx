import { useEffect, useState } from "react";
import { predict, formatTime } from "./utils";
import { Sentry } from "react-activity";
import "react-activity/dist/Sentry.css";

function Favorites() {
  const [prediction, setPrediction] = useState({});
  const [data, setData] = useState({});

  useEffect(() => {
    const apicall = JSON.parse(localStorage.getItem("apicall"));

    if (Object.keys(apicall).length) {
      setData(apicall);
    }
    console.log(data);
  }, []);

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

      {/* <div>{data ? prediction.relationships.stop.data.id : ""} {data ? prediction.attributes ? formatTime(prediction.attributes.departure_time): <Sentry /> : "" }</div> */}
    </>
  );
}

export default Favorites;
