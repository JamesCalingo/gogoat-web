export function generateURL(station, direction, line) {
    let url = "";

    if (station.type === "subway") {
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

export function formatTime(timeString) {
    if(!timeString) {
        return "N/A"
    }
    return new Date(timeString).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    })
}