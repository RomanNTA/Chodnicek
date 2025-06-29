import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";

import { BrowserRouter } from "react-router-dom";

const routerBasename =
    process.env.REACT_APP_BASE_URL === "/"
        ? "/"
        : process.env.REACT_APP_BASE_URL.slice(0, -1);

console.log("routerBasename");
console.log(routerBasename);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        {/* <BrowserRouter basename={routerBasename}> */}
        <BrowserRouter basename='/project8'>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
