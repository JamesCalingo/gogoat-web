import axios from "axios";


export function generateURL(station, direction, line) {
    let url = ""

    if (station.line || (station.mode === "subway")) {
        url = `https://api-v3.mbta.com/predictions?fields%5Bprediction%5D=arrival_time%2Cdeparture_time&sort=departure_time&page[limit]=6&filter[stop]=${station.id}&filter[route]=${station.line}&filter[direction_id]=${direction}&filter[revenue]=REVENUE`;
    } else {
        // Due to "issues" with the prediction API for commuter rail, I use the schedule API
        let currentTime = new Date().toTimeString().split(" ")[0].slice(0, 5);
        url = `https://api-v3.mbta.com/schedules?sort=departure_time&page[limit]=5&fields%5Bschedule%5D=arrival_time%2Cdeparture_time&filter[min_time]=${currentTime}&filter[stop]=${station.id}&filter[direction_id]=${direction}`;
        // For the Boston terminal stations
        if (line && !station.mode) {
            url += `&filter[route]=${line}`;
        }
    }
    return url
}

export function predict(url) {
    return axios.get(url)
}

// It's actually possible for the API to return a prediction with a time in the past. With this, we can filter out any such predictions.
export function findNext(data) {
    return data.find(item => new Date(item.attributes.departure_time) > new Date())
}

export function checkForAlerts(station, line) {
    let url = `https://api-v3.mbta.com/alerts?filter%5Bactivity%5D=BOARD%2CEXIT%2CRIDE&filter%5Broute%5D=${line}&filter%5Bstop%5D=${station}&filter%5Bdatetime%5D=NOW`
    return axios.get(url)
}

export function getAlert(res) {
  const body = res.data.data[0]
      return body.attributes.header
}

export function displayDirection(station, direction, line) {
    const inboundTerminals = ["South Station", "North Station", "Back Bay"]

    return direction != 0
        ? station.destination_1
            ? station.destination_1
            : "Boston"
        : station.destination_0
            ? station.destination_0
            : inboundTerminals.includes(station.name) ? line : "Outbound"
}

export function displayLineName(line) {
    switch (line) {
        case "CR-Providence":
            return "to Providence or Stoughton"
        case "CR-Newburyport":
            return "to Newburyport or Rockport"
        case "CR-Franklin":
            return "to Franklin or Foxboro"
        // case "CR-NewBedford":
        //     return "to Fall River or New Bedford" COMING SOON
        default:
            return `TO ${line.split("-")[1]}`
    }
}

export function resetSelect(select) {
    if (!select) return
    select.selectedIndex = 0
}

export function formatTime(timeString) {
    if (!timeString) {
        return "N/A"
    }
    return new Date(timeString).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    })
}