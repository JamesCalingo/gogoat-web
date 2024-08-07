export function generateURL(station, direction, line) {
    let url = `https://api-v3.mbta.com/predictions?sort=departure_time&page[limit]=5&filter[stop]=${station.id}&filter[route]=${station.line}&filter[direction_id]=${direction}&filter[revenue]=REVENUE`;


    if (station.destination_0) {
        url = `https://api-v3.mbta.com/predictions?sort=departure_time&page[limit]=5&filter[stop]=${station.id}&filter[route]=${station.line}&filter[direction_id]=${direction}&filter[revenue]=REVENUE`;
    } else {
        // Due to "issues" with the prediction API for commuter rail trains, I use the schedule API
        let currentTime = new Date().toTimeString().split(" ")[0].slice(0, 5);
        url = `https://api-v3.mbta.com/schedules?sort=departure_time&page[limit]=1&filter[min_time]=${currentTime}&filter[stop]=${station.id}&filter[direction_id]=${direction}`;
        if (line) {
            url += `&filter[route]=${line}`;
        }
    }
    return url
}

export function predict(url) {
    return fetch(url)
}

// It's actually possible for the API to return a prediction with a time in the past. With this, we can filter out any such predictions.
export function findNext(data) {
    return data.find(item => new Date(item.attributes.departure_time) > new Date())
}

export function displayDirection(station, direction) {
    return direction != 0
        ? station.destination_1
            ? station.destination_1
            : "Inbound"
        : station.destination_0
            ? station.destination_0
            : "Outbound"
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