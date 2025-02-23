import { createContext, useContext, useEffect, useRef, useState } from "react";
import Cell from "./Cell";

export const GridContext = createContext();

export default function Grid() {
  const [r, setR] = useState(15);
  const [c, setC] = useState(15);
  const [state, setState] = useState("GENERATE");
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [maze, setMaze] = useState({});
  const [speed, setSpeed] = useState(5);
  const [cells, setCells] = useState(
    Array.from({ length: r * c }, (_, index) => <Cell key={index} id={index} />)
  );
  const [adjList, setAdjList] = useState([]);

  const delay = useRef(150);

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function generate2DArray(r, c) {
    const matrix = [];
    let counter = 0;

    for (let i = 0; i < r; i++) {
      const row = [];
      for (let j = 0; j < c; j++) {
        row.push(counter);
        counter++;
      }
      matrix.push(row);
    }

    return matrix;
  }

  function getAdjList(r, c) {
    let grid = generate2DArray(r, c);

    let adjList = Array(r * c);

    for (let i = 0; i < r; i++) {
      for (let j = 0; j < c; j++) {
        const dir = [
          [-1, 0],
          [1, 0],
          [0, 1],
          [0, -1],
        ];

        let neighbors = [];

        for (let k = 0; k < 4; k++) {
          let ni = i + dir[k][0];

          let nj = j + dir[k][1];

          if (ni >= 0 && nj >= 0 && ni < r && nj < c) {
            neighbors.push(grid[ni][nj]);
          }
        }

        adjList[grid[i][j]] = neighbors;
      }
    }

    return adjList;
  }

  useEffect(() => {
    setCells(
      Array.from({ length: r * c }, (_, index) => (
        <Cell key={index} id={index} />
      ))
    );
    setMaze(Array(r * c).fill([]));
    setAdjList(getAdjList(r, c));
  }, [r, c]);

  function dfs(index) {
    let dfsOrder = [];
    let visited = Array(r * c).fill(false);
    let stack = [index];
    let path = [index]; // Track the actual path including backtracking

    while (stack.length > 0) {
      const currentIndex = stack.pop();
      if (!visited[currentIndex]) {
        dfsOrder.push(['visit', currentIndex]);
        visited[currentIndex] = true;
      } else {
        dfsOrder.push(['backtrack', currentIndex]);
      }

      let adj = adjList[currentIndex].filter((cell) => !visited[cell]);

      if (adj.length > 0) {
        stack.push(currentIndex);
        let randomIndex = Math.floor(Math.random() * adj.length);
        let next = adj[randomIndex];
        stack.push(next);
      }
    }
    return dfsOrder;
  }

  async function animate(order) {
    // Clear any previous classes
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.classList.remove('visited', 'current');
    });

    let temp = {};
    let prev = null;

    for (let i = 0; i < order.length; i++) {
      const [action, cellIndex] = order[i];
      
      // Remove current class from previous cell
      if (prev !== null) {
        document.getElementById(String(prev)).classList.remove('current');
      }

      // Add current class to current cell
      const currentCell = document.getElementById(String(cellIndex));
      currentCell.classList.add('current');

      if (action === 'visit') {
        currentCell.classList.add('visited');
        
        // Handle maze connections
        if (i < order.length - 1) {
          const nextAction = order[i + 1];
          if (nextAction[0] === 'visit') {
            const nextIndex = nextAction[1];
            if (cellIndex in temp) {
              temp[cellIndex].push(nextIndex);
            } else {
              temp[cellIndex] = [nextIndex];
            }

            // Add border removal logic
            const delta = cellIndex - nextIndex;
            if (delta === 1) {
              currentCell.classList.add('no-left-border');
              document.getElementById(String(nextIndex)).classList.add('no-right-border');
            } else if (delta === -1) {
              currentCell.classList.add('no-right-border');
              document.getElementById(String(nextIndex)).classList.add('no-left-border');
            } else if (delta > 1) {
              currentCell.classList.add('no-top-border');
              document.getElementById(String(nextIndex)).classList.add('no-bottom-border');
            } else {
              currentCell.classList.add('no-bottom-border');
              document.getElementById(String(nextIndex)).classList.add('no-top-border');
            }
          }
        }
      }

      prev = cellIndex;
      await sleep(delay.current);
    }

    // Remove current class from last cell
    if (prev !== null) {
      document.getElementById(String(prev)).classList.remove('current');
    }
    setState("SOLVE");
    setMaze(temp);
    console.log(temp);
  }

  return (
    <GridContext.Provider value={{ r, c, state, start, end, setStart, setEnd,maze }}>
      <div className="page">
        <div className="maze">
          <div
            className="maze-grid"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${c}, 1fr)`,
              gridTemplateRows: `repeat(${r}, 1fr)`,
            }}
          >
            {cells}
          </div>
        </div>
        
        <div className="input-section">
          <div className="input-group">
            <label htmlFor="rows">Rows</label>
            <input
              id="rows"
              type="number"
              min={1}
              max={30}
              value={r}
              onChange={(e) => setR(parseInt(e.target.value) || 15)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="columns">Columns</label>
            <input
              id="columns"
              type="number"
              min={1}
              max={30}
              value={c}
              onChange={(e) => setC(parseInt(e.target.value) || 15)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="speed">Delay</label>
            <input
              id="speed"
              type="range"
              min={1}
              max={10}
              value={speed}
              onChange={(e) => {
                delay.current = 30 * e.target.value;
                setSpeed(e.target.value);
              }}
            />
            <div className="speed-value">{speed}x</div>
          </div>

          <div className="button-group">
            <button onClick={() => animate(dfs(0))}>Generate Maze</button>
            <button onClick={() => window.location.reload()}>Reset</button>
          </div>
        </div>
      </div>
    </GridContext.Provider>
  );
}