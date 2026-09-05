import { useCallback, useEffect, useRef, useState } from "react";
import "./Snake.css";

const COLS = 20;
const ROWS = 20;
const CELL = 24;
const TICK_MS = 120;

type Point = { x: number; y: number };
type Dir = "up" | "down" | "left" | "right";

const OPPOSITE: Record<Dir, Dir> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

const KEY_DIR: Record<string, Dir> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
};

function randomFood(snake: Point[]): Point {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
  let food: Point;
  do {
    food = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  } while (occupied.has(`${food.x},${food.y}`));
  return food;
}

function initialSnake(): Point[] {
  const cx = Math.floor(COLS / 2);
  const cy = Math.floor(ROWS / 2);
  return [
    { x: cx, y: cy },
    { x: cx - 1, y: cy },
    { x: cx - 2, y: cy },
  ];
}

export default function Snake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const snakeRef = useRef<Point[]>(initialSnake());
  const dirRef = useRef<Dir>("right");
  const nextDirRef = useRef<Dir>("right");
  const foodRef = useRef<Point>(randomFood(snakeRef.current));

  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [status, setStatus] = useState<"ready" | "playing" | "over">("ready");

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = COLS * CELL;
    const h = ROWS * CELL;
    if (canvas.width !== w * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#0b1120";
    ctx.fillRect(0, 0, w, h);

    const food = foodRef.current;
    ctx.fillStyle = "#9ed6a3";
    ctx.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4);

    snakeRef.current.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? "#d8b26a" : "rgba(216,178,106,0.6)";
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });
  }, []);

  useEffect(() => {
    draw();
  }, [draw]);

  const reset = useCallback(() => {
    snakeRef.current = initialSnake();
    dirRef.current = "right";
    nextDirRef.current = "right";
    foodRef.current = randomFood(snakeRef.current);
    setScore(0);
    draw();
  }, [draw]);

  const start = useCallback(() => {
    reset();
    setStatus("playing");
    frameRef.current?.focus();
  }, [reset]);

  useEffect(() => {
    if (status !== "playing") return;
    const id = setInterval(() => {
      dirRef.current = nextDirRef.current;
      const head = snakeRef.current[0];
      const delta: Record<Dir, Point> = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 },
      };
      const d = delta[dirRef.current];
      const newHead = { x: head.x + d.x, y: head.y + d.y };

      const hitsWall =
        newHead.x < 0 || newHead.x >= COLS || newHead.y < 0 || newHead.y >= ROWS;
      const hitsSelf = snakeRef.current.some(
        (s) => s.x === newHead.x && s.y === newHead.y,
      );

      if (hitsWall || hitsSelf) {
        setStatus("over");
        setBest((b) => Math.max(b, snakeRef.current.length - 3));
        return;
      }

      const ateFood = newHead.x === foodRef.current.x && newHead.y === foodRef.current.y;
      const nextSnake = [newHead, ...snakeRef.current];
      if (ateFood) {
        foodRef.current = randomFood(nextSnake);
        setScore((s) => s + 1);
      } else {
        nextSnake.pop();
      }
      snakeRef.current = nextSnake;
      draw();
    }, TICK_MS);
    return () => clearInterval(id);
  }, [status, draw]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const dir = KEY_DIR[e.key];
    if (!dir) return;
    e.preventDefault();
    if (status !== "playing") {
      if (e.key === "Enter" || e.key === " ") start();
      return;
    }
    if (dir !== OPPOSITE[dirRef.current]) {
      nextDirRef.current = dir;
    }
  };

  return (
    <div className="sn">
      <div className="sn-header">
        <div className="sn-intro">
          <p className="sn-lead">
            Originally a Python project of mine, this playable version is a
            browser port with grid movement, wall/self collision, and a
            buffered input queue so a fast key tap can't reverse you into
            yourself.
          </p>
          <ul className="sn-tags">
            <li>Python (original)</li>
            <li>React</li>
            <li>TypeScript</li>
            <li>Canvas API</li>
          </ul>
        </div>
        <a
          className="sn-github"
          href="https://github.com/JohnMaliha/snake_game"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Snake game on GitHub"
          title="View on GitHub"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.75.4-1.27.73-1.56-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.06 11.06 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.81 1.18 1.84 1.18 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.07.78 2.16 0 1.56-.02 2.81-.02 3.19 0 .31.21.67.8.56C20.71 21.4 24 17.09 24 12 24 5.73 18.27.5 12 .5z" />
          </svg>
        </a>
      </div>
      <div
        ref={frameRef}
        className="sn-frame"
        tabIndex={0}
        role="application"
        aria-label="Snake game — use arrow keys or WASD to play"
        onKeyDown={onKeyDown}
      >
        <canvas
          ref={canvasRef}
          className="sn-canvas"
          style={{ width: COLS * CELL, aspectRatio: `${COLS} / ${ROWS}` }}
        />
        {status !== "playing" && (
          <div className="sn-overlay">
            <p>{status === "over" ? `Game over — score ${score}` : "Snake"}</p>
            <p className="sn-hint">Arrow keys or WASD to move</p>
            <button className="sn-btn" onClick={start}>
              {status === "over" ? "Play again" : "Play"}
            </button>
          </div>
        )}
      </div>
      <div className="sn-row">
        <span className="sn-score">
          score <b>{score}</b>
        </span>
        <span className="sn-score">
          best <b>{best}</b>
        </span>
      </div>
    </div>
  );
}
