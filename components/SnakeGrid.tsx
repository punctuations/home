"use client";

import { memo, useEffect, useImperativeHandle, useRef } from "react";
import type { RefObject } from "react";

export const GRID_COLS = 20;
export const TRAIL_COLOR = "rgba(255,255,255,0.07)";

export type GridHandle = {
  paint(next: Map<string, string>): void;
  clear(): void;
};

type Props = {
  rows: number;
  handle: RefObject<GridHandle | null>;
  paused: RefObject<boolean>;
};

function SnakeGridImpl({ rows, handle, paused }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cellsRef = useRef<HTMLDivElement[]>([]);
  const paintedRef = useRef<Map<string, string>>(new Map());

  useImperativeHandle(
    handle,
    () => {
      const at = (key: string) => {
        const comma = key.indexOf(",");
        const col = +key.slice(0, comma);
        const row = +key.slice(comma + 1);
        return cellsRef.current[col * rows + row];
      };

      const wipe = (el: HTMLDivElement | undefined) => {
        if (!el) return;
        el.style.transition = "background-color 0.4s ease";
        el.style.backgroundColor = "transparent";
      };

      return {
        paint(next) {
          const painted = paintedRef.current;
          for (const key of painted.keys()) {
            if (!next.has(key)) wipe(at(key));
          }
          for (const [key, color] of next) {
            if (painted.get(key) === color) continue;
            const el = at(key);
            if (!el) continue;
            el.style.transition =
              color === TRAIL_COLOR ? "background-color 0.4s ease" : "none";
            el.style.backgroundColor = color;
          }
          paintedRef.current = next;
        },
        clear() {
          for (const key of paintedRef.current.keys()) wipe(at(key));
          paintedRef.current = new Map();
        },
      };
    },
    [handle, rows],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const timers = new Map<HTMLElement, ReturnType<typeof setTimeout>>();

    function onOver(e: MouseEvent) {
      if (paused.current) return;
      const el = e.target as HTMLElement;
      if (!el.dataset || el.dataset.cell === undefined) return;
      const pending = timers.get(el);
      if (pending) clearTimeout(pending);
      el.style.transition = "none";
      el.style.backgroundColor = "white";
      timers.set(
        el,
        setTimeout(() => {
          el.style.backgroundColor = "transparent";
          timers.delete(el);
        }, 300),
      );
    }

    root.addEventListener("mouseover", onOver);
    return () => {
      root.removeEventListener("mouseover", onOver);
      timers.forEach(clearTimeout);
    };
  }, [paused]);

  return (
    <div ref={rootRef} className="bgrid select-none" style={{ marginLeft: 0 }}>
      {Array.from({ length: GRID_COLS }, (_, col) => (
        <div key={col} className="bcolumn">
          {Array.from({ length: rows }, (_, row) => (
            <div
              key={row}
              data-cell=""
              ref={(el) => {
                if (el) cellsRef.current[col * rows + row] = el;
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export const SnakeGrid = memo(SnakeGridImpl);
