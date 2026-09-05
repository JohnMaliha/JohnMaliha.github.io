import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./Pathfinding.css";

const ROWS = 16;
const COLS = 32;
const CELL = 24;

type Mode = "wall" | "start" | "goal";
type Algorithm = "astar" | "dijkstra";
type Phase = "idle" | "visiting" | "tracing" | "done";

const idx = (r: number, c: number) => r * COLS + c;
const rc = (i: number): [number, number] => [Math.floor(i / COLS), i % COLS];

function manhattan(a: number, b: number) {
  const [ar, ac] = rc(a);
  const [br, bc] = rc(b);
  return Math.abs(ar - br) + Math.abs(ac - bc);
}

function neighbors(i: number): number[] {
  const [r, c] = rc(i);
  const out: number[] = [];
  if (r > 0) out.push(idx(r - 1, c));
  if (r < ROWS - 1) out.push(idx(r + 1, c));
  if (c > 0) out.push(idx(r, c - 1));
  if (c < COLS - 1) out.push(idx(r, c + 1));
  return out;
}

function search(
  walls: Set<number>,
  start: number,
  goal: number,
  algorithm: Algorithm,
): { visitedOrder: number[]; path: number[] | null } {
  const gScore = new Map<number, number>([[start, 0]]);
  const cameFrom = new Map<number, number>();
  const closed = new Set<number>();
  const open = new Map<number, number>([
    [start, algorithm === "dijkstra" ? 0 : manhattan(start, goal)],
  ]);
  const visitedOrder: number[] = [];

  while (open.size > 0) {
    let cur = -1;
    let bestF = Infinity;
    for (const [node, f] of open) {
      if (f < bestF) {
        bestF = f;
        cur = node;
      }
    }
    open.delete(cur);
    if (closed.has(cur)) continue;
    closed.add(cur);
    visitedOrder.push(cur);

    if (cur === goal) {
      const path: number[] = [cur];
      let walk = cur;
      while (cameFrom.has(walk)) {
        walk = cameFrom.get(walk) as number;
        path.unshift(walk);
      }
      return { visitedOrder, path };
    }

    const g = gScore.get(cur) ?? Infinity;
    for (const n of neighbors(cur)) {
      if (walls.has(n) || closed.has(n)) continue;
      const tentative = g + 1;
      if (tentative < (gScore.get(n) ?? Infinity)) {
        gScore.set(n, tentative);
        cameFrom.set(n, cur);
        const h = algorithm === "dijkstra" ? 0 : manhattan(n, goal);
        open.set(n, tentative + h);
      }
    }
  }

  return { visitedOrder, path: null };
}

function speedToDelay(speed: number) {
  return Math.max(3, Math.round(60 - (speed - 1) * (56 / 9)));
}

export default function Pathfinding() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [walls, setWalls] = useState<Set<number>>(() => new Set());
  const [start, setStart] = useState(idx(8, 4));
  const [goal, setGoal] = useState(idx(8, 27));
  const [mode, setMode] = useState<Mode>("wall");
  const [algorithm, setAlgorithm] = useState<Algorithm>("astar");
  const [speed, setSpeed] = useState(7);

  const [phase, setPhase] = useState<Phase>("idle");
  const [visitedOrder, setVisitedOrder] = useState<number[]>([]);
  const [path, setPath] = useState<number[] | null>(null);
  const [visibleVisited, setVisibleVisited] = useState(0);
  const [visiblePath, setVisiblePath] = useState(0);

  const dragPaintRef = useRef<null | "add" | "remove">(null);
  const editable = phase === "idle" || phase === "done";

  const resetVisualization = useCallback(() => {
    setPhase("idle");
    setVisitedOrder([]);
    setPath(null);
    setVisibleVisited(0);
    setVisiblePath(0);
  }, []);

  const handleRun = () => {
    if (!editable) return;
    const { visitedOrder: order, path: foundPath } = search(
      walls,
      start,
      goal,
      algorithm,
    );
    setVisitedOrder(order);
    setPath(foundPath);
    setVisibleVisited(0);
    setVisiblePath(0);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      setVisibleVisited(order.length);
      setVisiblePath(foundPath ? foundPath.length : 0);
      setPhase("done");
    } else {
      setPhase("visiting");
    }
  };

  const handleClear = () => {
    setWalls(new Set());
    resetVisualization();
  };

  useEffect(() => {
    if (phase !== "visiting") return;
    if (visibleVisited >= visitedOrder.length) {
      if (path) {
        setPhase("tracing");
      } else {
        setPhase("done");
      }
      return;
    }
    const t = setTimeout(
      () => setVisibleVisited((v) => v + 1),
      speedToDelay(speed),
    );
    return () => clearTimeout(t);
  }, [phase, visibleVisited, visitedOrder.length, path, speed]);

  useEffect(() => {
    if (phase !== "tracing" || !path) return;
    if (visiblePath >= path.length) {
      setPhase("done");
      return;
    }
    const t = setTimeout(
      () => setVisiblePath((v) => v + 1),
      speedToDelay(speed) * 3,
    );
    return () => clearTimeout(t);
  }, [phase, visiblePath, path, speed]);

  const cellAt = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width / (COLS * CELL);
    const scaleY = rect.height / (ROWS * CELL);
    const x = (clientX - rect.left) / scaleX;
    const y = (clientY - rect.top) / scaleY;
    const c = Math.floor(x / CELL);
    const r = Math.floor(y / CELL);
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return null;
    return idx(r, c);
  }, []);

  const applyAt = useCallback(
    (cell: number, isStart: boolean) => {
      if (mode === "start") {
        if (cell !== goal) setStart(cell);
        resetVisualization();
        return;
      }
      if (mode === "goal") {
        if (cell !== start) setGoal(cell);
        resetVisualization();
        return;
      }
      if (cell === start || cell === goal) return;
      setWalls((prev) => {
        const next = new Set(prev);
        if (isStart) {
          dragPaintRef.current = prev.has(cell) ? "remove" : "add";
          if (dragPaintRef.current === "add") next.add(cell);
          else next.delete(cell);
        } else if (dragPaintRef.current === "add") {
          next.add(cell);
        } else if (dragPaintRef.current === "remove") {
          next.delete(cell);
        }
        return next;
      });
      resetVisualization();
    },
    [mode, start, goal, resetVisualization],
  );

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!editable) return;
    const cell = cellAt(e.clientX, e.clientY);
    if (cell === null) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    applyAt(cell, true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!editable || mode !== "wall" || dragPaintRef.current === null) return;
    const cell = cellAt(e.clientX, e.clientY);
    if (cell === null) return;
    applyAt(cell, false);
  };

  const onPointerUp = () => {
    dragPaintRef.current = null;
  };

  const visitedSet = useMemo(
    () => new Set(visitedOrder.slice(0, visibleVisited)),
    [visitedOrder, visibleVisited],
  );
  const pathSet = useMemo(
    () => new Set(path ? path.slice(0, visiblePath) : []),
    [path, visiblePath],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = COLS * CELL;
    const h = ROWS * CELL;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = "#0b1120";
    ctx.fillRect(0, 0, w, h);

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i = idx(r, c);
        const x = c * CELL;
        const y = r * CELL;
        if (walls.has(i)) {
          ctx.fillStyle = "rgba(232,235,242,0.16)";
          ctx.fillRect(x, y, CELL, CELL);
        } else if (pathSet.has(i)) {
          ctx.fillStyle = "rgba(216,178,106,0.85)";
          ctx.fillRect(x, y, CELL, CELL);
        } else if (visitedSet.has(i)) {
          ctx.fillStyle = "rgba(47,224,201,0.28)";
          ctx.fillRect(x, y, CELL, CELL);
        }
      }
    }

    ctx.strokeStyle = "rgba(232,235,242,0.06)";
    ctx.lineWidth = 1;
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * CELL + 0.5);
      ctx.lineTo(w, r * CELL + 0.5);
      ctx.stroke();
    }
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(c * CELL + 0.5, 0);
      ctx.lineTo(c * CELL + 0.5, h);
      ctx.stroke();
    }

    const drawMarker = (cell: number, color: string) => {
      const [r, c] = rc(cell);
      ctx.fillStyle = color;
      const pad = 4;
      ctx.fillRect(c * CELL + pad, r * CELL + pad, CELL - pad * 2, CELL - pad * 2);
    };
    drawMarker(start, "#d8b26a");
    drawMarker(goal, "#ff4f8b");
  }, [walls, start, goal, visitedSet, pathSet]);

  const statusText = useMemo(() => {
    if (phase === "idle") return "Draw walls, set start/goal, then run.";
    if (phase === "visiting") return "Searching…";
    if (phase === "tracing") return "Path found — tracing route…";
    if (path) return `Path found — ${path.length - 1} steps, ${visitedOrder.length} cells explored.`;
    return "No path exists between start and goal.";
  }, [phase, path, visitedOrder.length]);

  return (
    <div className="pf">
      <p className="pf-lead">
        From my drone project: click and drag to draw walls, place the start
        and goal, then watch the search expand.
      </p>

      <div className="pf-toolbar">
        <div className="pf-group" role="group" aria-label="Edit mode">
          <span className="pf-group-label">Edit</span>
          {(["wall", "start", "goal"] as Mode[]).map((m) => (
            <button
              key={m}
              className="pf-toggle"
              data-tone={m === "goal" ? "magenta" : undefined}
              aria-pressed={mode === m}
              disabled={!editable}
              onClick={() => setMode(m)}
            >
              {m === "wall" ? "Walls" : m === "start" ? "Start" : "Goal"}
            </button>
          ))}
        </div>

        <div className="pf-group" role="group" aria-label="Algorithm">
          <span className="pf-group-label">Algorithm</span>
          {(["astar", "dijkstra"] as Algorithm[]).map((a) => (
            <button
              key={a}
              className="pf-toggle"
              data-tone={a === "dijkstra" ? "cyan" : undefined}
              aria-pressed={algorithm === a}
              disabled={!editable}
              onClick={() => setAlgorithm(a)}
            >
              {a === "astar" ? "A*" : "Dijkstra"}
            </button>
          ))}
        </div>

        <label className="pf-speed">
          Speed
          <input
            type="range"
            min={1}
            max={10}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="pf-toolbar">
        <button className="pf-btn pf-btn-primary" onClick={handleRun} disabled={!editable}>
          Run
        </button>
        <button className="pf-btn" onClick={handleClear} disabled={!editable}>
          Clear
        </button>
      </div>

      <div className="pf-board">
        <canvas
          ref={canvasRef}
          className="pf-canvas"
          style={{ width: COLS * CELL, aspectRatio: `${COLS} / ${ROWS}` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          role="application"
          aria-label="Pathfinding grid — click or drag to draw walls, set start and goal via the Edit controls above"
        />
      </div>

      <div className="pf-status-row">
        <p className="pf-status" aria-live="polite">
          {statusText}
        </p>
        <div className="pf-legend">
          <span><span className="pf-swatch" aria-hidden="true" style={{ background: "#d8b26a" }} />start</span>
          <span><span className="pf-swatch" aria-hidden="true" style={{ background: "#ff4f8b" }} />goal</span>
          <span><span className="pf-swatch" aria-hidden="true" style={{ background: "rgba(232,235,242,0.16)" }} />wall</span>
          <span><span className="pf-swatch" aria-hidden="true" style={{ background: "rgba(47,224,201,0.6)" }} />explored</span>
          <span><span className="pf-swatch" aria-hidden="true" style={{ background: "rgba(216,178,106,0.85)" }} />path</span>
        </div>
      </div>
    </div>
  );
}
