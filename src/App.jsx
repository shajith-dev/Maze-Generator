import Grid from "./Grid";
import Sort from "./Sort";
import "./App.css"; // Make sure this import is present
import { useState } from "react";

export default function App() {
  const [page, setPage] = useState(1);
  return (
    <div className="app">
      <div className="nav-btns">
        <button
          onClick={() => setPage(1)}
          className={`${page === 1 ? "btn-spl" : ""}`}
        >
          Maze Generation
        </button>
        <button
          onClick={() => setPage(0)}
          className={`${page === 0 ? "btn-spl" : ""}`}
        >
          Sort Visualization
        </button>
      </div>
      {page == 1 ? <Grid /> : <Sort />}
    </div>
  );
}
