import React, { useState } from "react";
import { Table2, BarChart3 } from "lucide-react";

function niceMax(value) {
  if (!value || value <= 0) return 10;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const residual = value / magnitude;
  let niceResidual = 1;
  if (residual > 5) niceResidual = 10;
  else if (residual > 2) niceResidual = 5;
  else if (residual > 1) niceResidual = 2;
  return niceResidual * magnitude;
}

const WIDTH = 760;
const HEIGHT = 260;
const PADDING = { top: 16, right: 12, bottom: 32, left: 64 };
const PLOT_W = WIDTH - PADDING.left - PADDING.right;
const PLOT_H = HEIGHT - PADDING.top - PADDING.bottom;

export default function MonthlyBarChart({ data, color = "#6B0C22", formatValue = (v) => v.toLocaleString(), formatAxis = formatValue, title }) {
  const [hovered, setHovered] = useState(null);
  const [tableView, setTableView] = useState(false);

  const max = niceMax(Math.max(...data.map((d) => d.value), 0));
  const ticks = [0, max * 0.25, max * 0.5, max * 0.75, max];
  const bandWidth = PLOT_W / (data.length || 1);
  const barWidth = Math.min(24, bandWidth - 8);
  const yFor = (v) => PADDING.top + PLOT_H - (v / max) * PLOT_H;

  return (
    <div>
      <div className="flex items-center justify-end mb-2">
        <button
          onClick={() => setTableView((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800"
        >
          {tableView ? <BarChart3 size={14} /> : <Table2 size={14} />}
          {tableView ? "Chart view" : "Table view"}
        </button>
      </div>

      {tableView ? (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Month</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((d) => (
                <tr key={d.label}>
                  <td className="px-4 py-2 text-gray-700">{d.label}</td>
                  <td className="px-4 py-2 text-right font-medium text-gray-900" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {formatValue(d.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative">
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto" role="img" aria-label={title}>
            {ticks.map((t, i) => (
              <g key={i}>
                <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={yFor(t)} y2={yFor(t)} stroke="#e1e0d9" strokeWidth="1" />
                <text x={PADDING.left - 8} y={yFor(t)} textAnchor="end" dominantBaseline="middle" fontSize="11" fill="#898781">
                  {formatAxis(t)}
                </text>
              </g>
            ))}

            {data.map((d, i) => {
              const bx = PADDING.left + i * bandWidth + (bandWidth - barWidth) / 2;
              const rawH = max > 0 ? (d.value / max) * PLOT_H : 0;
              const displayH = d.value > 0 ? Math.max(rawH, 2) : 0;
              const by = PADDING.top + PLOT_H - displayH;
              const isHovered = hovered === i;
              const squareH = Math.min(4, displayH);
              return (
                <g key={d.label}>
                  <rect
                    x={PADDING.left + i * bandWidth}
                    y={PADDING.top}
                    width={bandWidth}
                    height={PLOT_H}
                    fill="transparent"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                    tabIndex={0}
                    role="button"
                    aria-label={`${d.label}: ${formatValue(d.value)}`}
                    style={{ outline: "none" }}
                  />
                  {displayH > 0 && (
                    <>
                      <rect x={bx} y={by} width={barWidth} height={displayH} rx={4} ry={4} fill={color} opacity={isHovered ? 0.8 : 1} />
                      <rect x={bx} y={PADDING.top + PLOT_H - squareH} width={barWidth} height={squareH} fill={color} opacity={isHovered ? 0.8 : 1} />
                    </>
                  )}
                  <text x={bx + barWidth / 2} y={HEIGHT - PADDING.bottom + 18} textAnchor="middle" fontSize="11" fill="#898781">
                    {d.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {hovered !== null && (
            <div
              className="absolute pointer-events-none bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg -translate-x-1/2"
              style={{
                left: `${((PADDING.left + hovered * bandWidth + bandWidth / 2) / WIDTH) * 100}%`,
                top: `${(yFor(data[hovered].value) / HEIGHT) * 100}%`,
                marginTop: "-44px",
              }}
            >
              <p className="font-semibold whitespace-nowrap">{formatValue(data[hovered].value)}</p>
              <p className="text-gray-300">{data[hovered].label}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
