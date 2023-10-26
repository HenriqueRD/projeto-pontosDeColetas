import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreatePoint from "./pages/CreatePoint";
import Home from "./pages/Home";
import Points from "./pages/Points";
import Point from "./pages/Point";

export default function Routers () {
  return (
    <BrowserRouter>
      <Routes>
        <Route Component={Home} path="/" />
        <Route Component={CreatePoint} path="/createPoint" />
        <Route Component={Points} path="/points" />
        <Route Component={Point} path="/point/:id" />
      </Routes>
    </BrowserRouter>
  );
}