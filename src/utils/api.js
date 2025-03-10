import axios from "axios";

export function predict(url) {
    return axios.get(url)
}

export function checkForAlerts(station, line) {
    let url = `https://api-v3.mbta.com/alerts?filter%5Bactivity%5D=BOARD%2CEXIT%2CRIDE&filter%5Broute%5D=${line}&filter%5Bstop%5D=${station}&filter%5Bdatetime%5D=NOW`
    return axios.get(url)
}