# GogoaT

https://go-gogoat.net

GogoaT is a train arrival and departure prediction app for the MBTA. It uses real time data from the MBTA API to provide accurate predictions.

## USING THE APP ITSELF

To find a train, start by selecting which mode you're taking. Currently, only the "rail bound" subway lines (i.e. NOT the Silver Line) and the Commuter Rail are available.

Then, if you're looking for a subway train, select which line you're taking (plus branch if you're on the Green Line). Once you have a mode (and line for subway), simply select which station you're starting from, the direction you're headed in (determined by the terminal stations for subway and Outbound/Boston for commuter rail), and GogoaT will predict the arrival times for the next train (and a few more after that if possible).

Additionally, you can save one trip as a "favorite trip" - when you load the app/site, GogoaT will have a next train prediction ready to go so you don't have to click through!

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to http://localhost:5173 to access the app.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
