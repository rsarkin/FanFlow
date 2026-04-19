"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import Header from "../../components/Header";
import CheckoutModal from "../../components/CheckoutModal";
import NotificationOverlay from "../../components/NotificationOverlay";
import { useRetail } from "../../context/RetailContext";
import { Map as MapIcon, Activity, UtensilsCrossed, Car } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────
   COLOUR MAP
───────────────────────────────────────────────────────────────── */
const T = {
  gate: { stroke: "#4A9EFF", fill: "#0D1525", text: "#4A9EFF", label: "Gate" },
  wc: { stroke: "#29CC7A", fill: "#0A1A0F", text: "#29CC7A", label: "Washroom" },
  food: { stroke: "#FF8C00", fill: "#1A0E00", text: "#FF8C00", label: "Food Stall" },
  water: { stroke: "#0EFFE4", fill: "#001A1A", text: "#0EFFE4", label: "Free Water" },
  hc: { stroke: "#8B5CF6", fill: "#12082A", text: "#8B5CF6", label: "Handicap" },
  fe: { stroke: "#FF4141", fill: "#1A0808", text: "#FF4141", label: "Fire Exit" },
  vip: { stroke: "#D5FF5C", fill: "#181E06", text: "#D5FF5C", label: "VIP Box" },
  lift: { stroke: "#94A3B8", fill: "#151A22", text: "#94A3B8", label: "Lift" },
};

/* ─────────────────────────────────────────────────────────────────
   SECTORS (4 stands)
───────────────────────────────────────────────────────────────── */
const SECTORS = [
  {
    id: "sachin", name: "Sachin Tendulkar Stand", short: "Sachin",
    side: "North · Upper + Lower Tier", gateNear: "Gates A & F",
    startDeg: 312, endDeg: 48, color: "#0EFFE4",
  },
  {
    id: "rohit", name: "Rohit Sharma Stand", short: "Rohit",
    side: "East · Upper + Lower Tier", gateNear: "Gates B & C",
    startDeg: 48, endDeg: 132, color: "#D5FF5C",
  },
  {
    id: "sunil", name: "Sunil Gavaskar Stand", short: "Sunil",
    side: "South · Upper + Lower Tier", gateNear: "Gates C, D & E",
    startDeg: 132, endDeg: 228, color: "#29CC7A",
  },
  {
    id: "vijay", name: "Vijay Merchant Stand", short: "Vijay",
    side: "West · Upper + Lower Tier", gateNear: "Gates E & F",
    startDeg: 228, endDeg: 312, color: "#FF8C00",
  },
];

/* ─────────────────────────────────────────────────────────────────
   STAND AMENITIES   (same seating layout for all stands / ground)
   x positions keyed to the StandSVG grid constants below
         StairA=50, SwA=14  Sec1(w=83)  StairB=147, SwB=14  Sec2(w=75)
         StairC=236, SwC=14 Sec3(w=75)  StairD=325, SwD=14  Sec4(w=68)
         StairE=407, swE=14
───────────────────────────────────────────────────────────────── */
const SA_X = { stairA: 30, sec1: 67, sec2: 128, sec3: 189, sec4: 250, sec5: 311, sec6: 372, stairG: 396 };
const ROW_H = 16, ROW_START_Y = 82, ROWS = 18;
const HC_Y = ROW_START_Y + (ROWS - 1) * ROW_H + 4;

const STAND_AMENITIES = [
  { id: "wc-l", type: "wc", label: "WC", x: 15, y: 28, info: "Washroom — back wall, left side. Access via concourse walkway." },
  { id: "fe-l", type: "fe", label: "FE", x: 15, y: 51, info: "Fire exit — back wall, left. Emergency use only." },
  { id: "food1", type: "food", label: "Food", x: SA_X.sec1, y: 28, info: "Food stall — Sec 1 back wall. Hot snacks & beverages." },
  { id: "water", type: "water", label: "Water", x: SA_X.sec3, y: 28, info: "Free water station — centre back wall. Bottle refill available." },
  { id: "food2", type: "food", label: "Food", x: SA_X.sec6, y: 28, info: "Food stall — Sec 6 back wall. Hot snacks & beverages." },
  { id: "wc-r", type: "wc", label: "WC", x: 425, y: 28, info: "Washroom — back wall, right side. Access via concourse walkway." },
  { id: "fe-r", type: "fe", label: "FE", x: 425, y: 51, info: "Fire exit — back wall, right. Emergency use only." },
];

/* ─────────────────────────────────────────────────────────────────
   UPPER DECK — extra markers (VIP only for Sachin stand)
───────────────────────────────────────────────────────────────── */
const STAND_LIFTS = {
  sachin: [
    { id: "lift-w", type: "lift", label: "Lift W", x: SA_X.stairA + 6.5, y: 160, info: "Lift — West side, upper deck." },
    { id: "lift-e", type: "lift", label: "Lift E", x: SA_X.stairG + 6.5, y: 160, info: "Lift — East side, upper deck." },
  ],
  rohit: [
    { id: "lift-n", type: "lift", label: "Lift N", x: SA_X.stairA + 6.5, y: 160, info: "Lift — North side, upper deck." },
    { id: "lift-s", type: "lift", label: "Lift S", x: SA_X.stairG + 6.5, y: 160, info: "Lift — South side, upper deck." }
  ],
  vijay: [
    { id: "lift-s", type: "lift", label: "Lift S", x: SA_X.stairA + 6.5, y: 160, info: "Lift — South side, upper deck." },
    { id: "lift-n", type: "lift", label: "Lift N", x: SA_X.stairG + 6.5, y: 160, info: "Lift — North side, upper deck." }
  ],
  sunil: [
    { id: "lift-w", type: "lift", label: "Lift W", x: SA_X.stairA + 6.5, y: 160, info: "Lift — West side, upper deck." },
    { id: "lift-e", type: "lift", label: "Lift E", x: SA_X.stairG + 6.5, y: 160, info: "Lift — East side, upper deck." }
  ],
};

/* ─────────────────────────────────────────────────────────────────
   OVERVIEW SVG   (compact left panel — gates + clickable sectors)
───────────────────────────────────────────────────────────────── */
const OCX = 150, OCY = 150;

function oPos(deg, r) {
  const rad = deg * Math.PI / 180;
  return [
    parseFloat((OCX + r * Math.sin(rad)).toFixed(1)),
    parseFloat((OCY - r * Math.cos(rad)).toFixed(1)),
  ];
}
function arcSector(d1, d2, r1, r2) {
  const end = d2 < d1 ? d2 + 360 : d2;
  const span = end - d1;
  const la = span > 180 ? 1 : 0;
  const [ox1, oy1] = oPos(d1, r2); const [ox2, oy2] = oPos(end, r2);
  const [ix1, iy1] = oPos(d1, r1); const [ix2, iy2] = oPos(end, r1);
  return `M${ix1},${iy1} L${ox1},${oy1} A${r2},${r2} 0 ${la} 1 ${ox2},${oy2} L${ix2},${iy2} A${r1},${r1} 0 ${la} 0 ${ix1},${iy1}Z`;
}
function sectorMidAngle(s) {
  const end = s.endDeg < s.startDeg ? s.endDeg + 360 : s.endDeg;
  let mid = (s.startDeg + end) / 2;
  if (mid >= 360) mid -= 360;
  return mid;
}
function textArcPath(d1, d2, r) {
  const end = d2 < d1 ? d2 + 360 : d2;
  let mid = (d1 + end) / 2;
  if (mid >= 360) mid -= 360;

  if (mid > 100 && mid < 260) {
    const [startX, startY] = oPos(d2, r);
    const [endX, endY] = oPos(d1, r);
    const span = end - d1;
    const la = span > 180 ? 1 : 0;
    return `M${startX},${startY} A${r},${r} 0 ${la} 0 ${endX},${endY}`;
  } else {
    const [startX, startY] = oPos(d1, r);
    const [endX, endY] = oPos(end, r);
    const span = end - d1;
    const la = span > 180 ? 1 : 0;
    return `M${startX},${startY} A${r},${r} 0 ${la} 1 ${endX},${endY}`;
  }
}

const GATES = [
  { label: "A", deg: 358 }, { label: "B", deg: 62 },
  { label: "C", deg: 118 }, { label: "D", deg: 180 },
  { label: "E", deg: 242 }, { label: "F", deg: 298 },
];

function OverviewSVG({ selectedId, floor, onSelect }) {
  return (
    <svg viewBox="-20 -20 340 340" style={{ width: "100%", height: "auto", display: "block" }} aria-label="Wankhede Stadium overview">
      <rect x="-20" y="-20" width={340} height={340} fill="#0A0A0A" />

      <defs>
        {SECTORS.map(s => (
          <g key={`arcs-${s.id}`}>
            <path id={`txt-arc-${s.id}`} d={textArcPath(s.startDeg, s.endDeg, 111)} />
            {s.id === "sachin" && (
              <>
                <path id={`txt-arc-${s.id}-top`} d={textArcPath(s.startDeg, s.endDeg, 125)} />
                <path id={`txt-arc-${s.id}-vip`} d={textArcPath(s.startDeg, s.endDeg, 96)} />
              </>
            )}
          </g>
        ))}
      </defs>

      {/* Outer wall */}
      <circle cx={OCX} cy={OCY} r={145} fill="#111" stroke="#1E1E1E" strokeWidth={1.5} />

      {/* Sector wedges */}
      {SECTORS.map(s => {
        const active = selectedId === s.id;
        const isSachin = s.id === "sachin";
        return (
          <g key={s.id}>
            <path
              d={arcSector(s.startDeg, s.endDeg, 84, 138)}
              fill={active ? `${s.color}55` : `${s.color}18`}
              stroke={s.color}
              strokeWidth={active ? 2 : 0.8}
              style={{ cursor: "pointer", transition: "fill 0.2s, stroke-width 0.15s" }}
              onClick={() => onSelect(active ? null : s.id)}
            />
            {/* VIP Box overlay on the inner radius for Sachin stand (Visible only in Upper Deck) */}
            {isSachin && floor === "upper" && (
              <path
                d={arcSector(s.startDeg, s.endDeg, 84, 111)}
                fill={active ? "#D5FF5C99" : "#D5FF5C33"}
                stroke="#D5FF5C"
                strokeWidth={active ? 2 : 0.8}
                style={{ pointerEvents: "none", transition: "all 0.2s" }}
              />
            )}
          </g>
        );
      })}

      {/* Outfield */}
      <circle cx={OCX} cy={OCY} r={82} fill="#0C2B18" stroke="#29CC7A" strokeWidth={0.7} />

      {/* 30-yard dashed */}
      <circle cx={OCX} cy={OCY} r={53} fill="none" stroke="#29CC7A" strokeWidth={0.5} strokeDasharray="3 2" opacity={0.4} />

      {/* Pitch */}
      <rect x={OCX - 8} y={OCY - 20} width={16} height={40} fill="#0A3D1A" stroke="#29CC7A" strokeWidth={0.6} />
      {[-16, 16].map(yPos => (
        <g key={`end-${yPos}`}>
          {/* Popping Crease */}
          <line x1={OCX - 8} y1={OCY + (yPos > 0 ? yPos - 4 : yPos + 4)} x2={OCX + 8} y2={OCY + (yPos > 0 ? yPos - 4 : yPos + 4)} stroke="#FFF" strokeWidth={0.4} opacity={0.6} />
          {/* Bowling Crease */}
          <line x1={OCX - 5} y1={OCY + yPos} x2={OCX + 5} y2={OCY + yPos} stroke="#FFF" strokeWidth={0.4} opacity={0.6} />
          {/* 3 Stumps */}
          {[-1.5, 0, 1.5].map(dx => (
            <circle key={dx} cx={OCX + dx} cy={OCY + yPos} r={0.6} fill="#FFD700" />
          ))}
        </g>
      ))}

      {/* Gate labels — placed outside the outer wall at r=158 */}
      {GATES.map(g => {
        const [gx, gy] = oPos(g.deg, 158);
        return (
          <g key={g.label}>
            <circle cx={gx} cy={gy} r={9} fill="#0B1828" stroke="#4A9EFF" strokeWidth={1.5} />
            <text x={gx} y={gy + 3.5} textAnchor="middle" fill="#4A9EFF" fontSize={7.5} fontWeight={700} fontFamily="JetBrains Mono,monospace">
              {g.label}
            </text>
          </g>
        );
      })}

      {SECTORS.map(s => {
        const active = selectedId === s.id;
        if (s.id === "sachin") {
          return (
            <g key={s.id} style={{ pointerEvents: "none" }}>
              <text fill={active ? s.color : `${s.color}cc`} fontSize={6.5} fontWeight={700} fontFamily="JetBrains Mono,monospace" letterSpacing={0.8}>
                <textPath href={`#txt-arc-${s.id}-top`} startOffset="50%" textAnchor="middle" dominantBaseline="middle">
                  {s.short.toUpperCase()} STAND
                </textPath>
              </text>
              {active && floor === "upper" && (
                <text fill="#0D0D0D" stroke="#D5FF5C" strokeWidth={0.3} fontSize={5.5} fontWeight={700} fontFamily="JetBrains Mono,monospace" letterSpacing={0.8}>
                  <textPath href={`#txt-arc-${s.id}-vip`} startOffset="50%" textAnchor="middle" dominantBaseline="middle">
                    VIP BOX
                  </textPath>
                </text>
              )}
            </g>
          );
        }
        return (
          <text key={s.id} style={{ pointerEvents: "none" }}
            fill={active ? s.color : `${s.color}cc`}
            fontSize={6.5} fontWeight={700} fontFamily="JetBrains Mono,monospace" letterSpacing={0.8}>
            <textPath href={`#txt-arc-${s.id}`} startOffset="50%" textAnchor="middle" dominantBaseline="middle">
              {s.short.toUpperCase()} STAND
            </textPath>
          </text>
        );
      })}



      {/* Compass */}
      <polygon points="300,295 296,305 300,301 304,305" fill="#555" />
      <text x={300} y={312} textAnchor="middle" fill="#555" fontSize={7} fontWeight={700} fontFamily="monospace">N</text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────
   STAND DETAIL SVG   (seating chart — reference image 2 layout)
   ViewBox 0 0 440 430
   ┌──────────────────────────────────────────────────────────┐
   │  back wall                                               │
   │  [WC][FE]  [Food]   [Water]   [Food]  [WC][FE]          │
   │           ─── concourse walkway ───                      │
   │ R1 |StA|  Sec 1   |StB|  Sec 2  |StC| Sec 3 |StD| Sec4 │
   │...  18 rows                                              │
   │          balcony edge — field view below                 │
   └──────────────────────────────────────────────────────────┘
   Stair X positions (left edge of each stair, stair width=14):
     StA=50, StB=147, StC=236, StD=325, StE=407
   Section mid X:
     Sec1=106.5, Sec2=198.5, Sec3=287.5, Sec4=373
───────────────────────────────────────────────────────────── */
const ST = {
  stairW: 13,
  stairs: [30, 91, 152, 213, 274, 335, 396],  // left-x of each stair
  rowH: ROW_H,
  rowStartY: ROW_START_Y,
  rows: ROWS,
  secMidX: [
    30 + 13 + (91 - 30 - 13) / 2,     // 67
    91 + 13 + (152 - 91 - 13) / 2,    // 128
    152 + 13 + (213 - 152 - 13) / 2,  // 189
    213 + 13 + (274 - 213 - 13) / 2,  // 250
    274 + 13 + (335 - 274 - 13) / 2,  // 311
    335 + 13 + (396 - 335 - 13) / 2,  // 372
  ],
};

function AmenityBox({ id, type, label, x, y, selected, onSelect }) {
  const cfg = T[type];
  const isLift = label.startsWith("Lift");
  const W = label === "Water" ? 38 : label === "Free Water" ? 50 : label === "HC" ? 22 : label === "WC" ? 22 : label === "FE" ? 20 : label === "VIP Box" ? 44 : isLift ? 36 : 32;
  const H = 16;
  const isSelected = selected === id;
  return (
    <g onClick={() => onSelect(isSelected ? null : id)} style={{ cursor: "pointer" }} transform={isLift ? `rotate(-90, ${x}, ${y})` : undefined}>
      <rect x={x - W / 2} y={y - H / 2} width={W} height={H} rx={2}
        fill={isSelected ? cfg.stroke : cfg.fill}
        stroke={cfg.stroke} strokeWidth={isSelected ? 2 : 1}
        style={{ transition: "fill 0.15s" }}
      />
      <text x={x} y={y + 4} textAnchor="middle"
        fill={isSelected ? "#0D0D0D" : cfg.text}
        fontSize={7} fontWeight={700} fontFamily="JetBrains Mono,monospace" letterSpacing={0.2}>
        {label}
      </text>
    </g>
  );
}

function StandSVG({ stand, floor, selectedAmenity, onSelectAmenity, selectedSeats = [], onSelectSeat }) {
  const stairColor = "#1C1C1C";
  const allAmenities = [
    ...STAND_AMENITIES,
    ...(STAND_LIFTS[stand.id] || []),
  ];

  return (
    <svg viewBox="0 0 440 430" style={{ width: "100%", height: "auto", display: "block" }} aria-label={`${stand.name} seating chart`}>
      <rect width={440} height={430} fill="#0A0A0A" />

      {/* ── Back wall strip ── */}
      <rect x={0} y={0} width={440} height={12} fill="#141414" stroke="#2A2A2A" strokeWidth={0.5} />
      <text x={220} y={9} textAnchor="middle" fill="#3A3A3A" fontSize={7} fontFamily="sans-serif" letterSpacing={1}>back wall</text>

      {/* ── Concourse walkway band ── */}
      <rect x={0} y={60} width={440} height={14} fill="#111" stroke="#222" strokeWidth={0.5} />
      <text x={220} y={70} textAnchor="middle" fill="#2A2A2A" fontSize={6.5} fontFamily="sans-serif" fontStyle="italic">concourse walkway</text>

      {/* ── Stair columns ── */}
      {ST.stairs.map((sx, i) => (
        <g key={i}>
          <rect x={sx} y={74} width={ST.stairW} height={ST.rows * ST.rowH + 2} fill={stairColor} stroke="#252525" strokeWidth={0.5} />
          <text x={sx + ST.stairW / 2} y={74 + (ST.rows * ST.rowH) / 2 + 4}
            textAnchor="middle" fill="#383838" fontSize={6.5} fontFamily="monospace"
            transform={`rotate(-90, ${sx + ST.stairW / 2}, ${74 + (ST.rows * ST.rowH) / 2})`}>
            Stair {String.fromCharCode(65 + i)}
          </text>
        </g>
      ))}

      {/* ── Seating rows ── */}
      {/* Left margin background */}
      <rect x={0} y={74} width={30} height={ST.rows * ST.rowH} fill="#0D0D0D" />

      {Array.from({ length: ST.rows }, (_, i) => {
        const ry = ST.rowStartY + i * ST.rowH;
        const rowBg = i % 2 === 0 ? "#0F0F0F" : "#131313";
        const SEAT_W = 6, SEAT_H = 10, SEAT_GAP = 1.5;
        const seatSections = [
          { x: ST.stairs[0] + ST.stairW, w: ST.stairs[1] - ST.stairs[0] - ST.stairW },
          { x: ST.stairs[1] + ST.stairW, w: ST.stairs[2] - ST.stairs[1] - ST.stairW },
          { x: ST.stairs[2] + ST.stairW, w: ST.stairs[3] - ST.stairs[2] - ST.stairW },
          { x: ST.stairs[3] + ST.stairW, w: ST.stairs[4] - ST.stairs[3] - ST.stairW },
          { x: ST.stairs[4] + ST.stairW, w: ST.stairs[5] - ST.stairs[4] - ST.stairW },
          { x: ST.stairs[5] + ST.stairW, w: ST.stairs[6] - ST.stairs[5] - ST.stairW },
        ];
        return (
          <g key={i}>
            {/* Row background strips */}
            {seatSections.map((sec, si) => (
              <rect key={`bg-${si}`} x={sec.x} y={ry} width={sec.w} height={ST.rowH}
                fill={rowBg} stroke="#1A1A1A" strokeWidth={0.3} />
            ))}
            {/* Individual seat rects */}
            {seatSections.flatMap((sec, si) => {
              const numSeats = Math.floor(sec.w / (SEAT_W + SEAT_GAP));
              const totalW = numSeats * SEAT_W + (numSeats - 1) * SEAT_GAP;
              const startX = sec.x + (sec.w - totalW) / 2;
              const sy = ry + (ST.rowH - SEAT_H) / 2;
              const isVIP = stand.id === "sachin" && floor === "upper" && i >= ST.rows / 2;
              return Array.from({ length: numSeats }, (_, j) => {
                const isHC =
                  (stand.id === "sachin" && si === 2 && i === 17 && j >= 2 && j <= 6) ||
                  (stand.id === "rohit" && si === 4 && i === 17 && j >= numSeats - 7 && j <= numSeats - 3) ||
                  (stand.id === "vijay" && si === 5 && i === 17 && j >= 1 && j <= 5) ||
                  (stand.id === "sunil" && si === 0 && i === 17 && j >= 4 && j <= 8);

                const sx_val = startX + j * (SEAT_W + SEAT_GAP);
                const IsSelectedSeat = selectedSeats.some(s => s.row === i + 1 && s.seat === j + 1 && s.section === si + 1);

                const fillClr = IsSelectedSeat ? "var(--accent-yellow)" : isHC ? "#8B5CF660" : isVIP ? "#D5FF5C28" : `${stand.color}28`;
                const strkClr = IsSelectedSeat ? "#0D0D0D" : isHC ? "#8B5CF6DD" : isVIP ? "#D5FF5C75" : `${stand.color}75`;

                return (
                  <rect
                    key={`s${i}-${si}-${j}`}
                    x={sx_val}
                    y={sy}
                    width={SEAT_W}
                    height={SEAT_H}
                    rx={1}
                    fill={fillClr}
                    stroke={strkClr}
                    strokeWidth={IsSelectedSeat ? 1.5 : isHC ? 0.8 : 0.5}
                    style={{ cursor: "pointer", transition: "all 0.1s" }}
                    onClick={() => onSelectSeat({
                      row: i + 1,
                      seat: j + 1,
                      section: si + 1,
                      x: sx_val + SEAT_W / 2,
                      y: sy + SEAT_H / 2,
                      isVIP,
                      isHC
                    })}
                  />
                );
              });
            })}
            {/* Row label */}
            <text x={26} y={ry + ST.rowH / 2 + 3} textAnchor="end"
              fill="#383838" fontSize={7} fontFamily="monospace">R{i + 1}</text>
          </g>
        );
      })}

      {/* ── Section labels (bottom of seating area) ── */}
      {ST.secMidX.map((mx, i) => (
        <text key={i} x={mx} y={ST.rowStartY + ST.rows * ST.rowH + 12}
          textAnchor="middle" fill="#383838" fontSize={7} fontFamily="monospace">
          Sec {i + 1}
        </text>
      ))}

      {/* ── Balcony edge line ── */}
      <line x1={30} y1={ST.rowStartY + ST.rows * ST.rowH + 22} x2={440} y2={ST.rowStartY + ST.rows * ST.rowH + 22}
        stroke="#2A2A2A" strokeWidth={1.5} strokeDasharray="4 3" />
      <text x={220} y={ST.rowStartY + ST.rows * ST.rowH + 35}
        textAnchor="middle" fill="#252525" fontSize={6} fontStyle="italic" fontFamily="sans-serif">
        balcony edge — field view below
      </text>

      {/* ── Field ── */}
      <text x={220} y={ST.rowStartY + ST.rows * ST.rowH + 52}
        textAnchor="middle" fill="#1a3a1a" fontSize={9} fontFamily="sans-serif" letterSpacing={2}>
        field
      </text>

      {/* ── Amenity markers (on top of everything) ── */}
      {allAmenities.map(a => (
        <AmenityBox key={a.id} {...a} selected={selectedAmenity} onSelect={onSelectAmenity} />
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────
   LEGEND  (compact)
───────────────────────────────────────────────────────────────── */
const LEGEND_TYPES = ["gate", "wc", "food", "water", "hc", "fe"];
const FLOW_SCENARIOS = [
  {
    id: "arrival",
    label: "Match Arrival",
    status: "Heavy Entry Traffic",
    metrics: { gate: "High", food: "Low", wc: "Low", water: "Moderate" },
    recs: [
      { t: "Fast Entry", d: "Gate B is 60% less crowded than Gate A. Save 14 mins by rerouting.", icon: "entry" },
      { t: "Pre-Game Snack", d: "Level 1 food stalls currently have < 2 min wait times.", icon: "food" },
      { t: "Security Lane", d: "Express Lanes at Gate F are now open for fans with no bags.", icon: "security" },
      { t: "Souvenirs", d: "North Gate Shop is at 10% capacity. Great time for jerseys.", icon: "shop" },
      { t: "Connectivity", d: "Wi-Fi signal is strongest near Block A & B concourse.", icon: "wifi" }
    ]
  },
  {
    id: "powerplay",
    label: "Power Play Phase",
    status: "High Momentum / Field Shifts",
    metrics: { gate: "Low", food: "Moderate", wc: "Moderate", water: "High" },
    recs: [
      { t: "Boundary View", d: "Sachin Stand Level 1 has 98% visibility for boundary shots right now.", icon: "view" },
      { t: "Quick Hydration", d: "Water Station #2 is completely clear during the Power Play.", icon: "water" },
      { t: "Fan Merchandise", d: "Limited Power Play flags being distributed at Section C entry.", icon: "star" },
      { t: "Crowd Alert", d: "Sector 4 concourse is seeing rapid movement. Stay in your lane.", icon: "alert" },
      { t: "Photography", d: "Optimal lighting for photos at the North stand during this over.", icon: "camera" }
    ]
  },
  {
    id: "action",
    label: "Mid-Game Pulse",
    status: "Halftime Peak Approaching",
    metrics: { gate: "Low", food: "Critical", wc: "High", water: "High" },
    recs: [
      { t: "Washroom Tip", d: "West Stand Level 2 facilities are at 20% capacity. Avoid West Level 1.", icon: "wc" },
      { t: "Quick Refill", d: "Use Water Station #4 (near Block C) for zero queue time.", icon: "water" },
      { t: "halftime Food", d: "Pre-order now via app to collect at Level 3 Express Counter.", icon: "food" },
      { t: "Merch Flash", d: "Limited edition posters available now at Sector 4 kiosk.", icon: "star" },
      { t: "Cool Zones", d: "North Concourse has active cooling fans at 100% power.", icon: "cool" }
    ]
  },
  {
    id: "departure",
    label: "Final Exit Flow",
    status: "Congestion Brewing",
    metrics: { gate: "Extreme", food: "None", wc: "Moderate", water: "Low" },
    recs: [
      { t: "Optimal Exit", d: "Exit via North Gate for immediate access to Shuttle Zone D.", icon: "exit" },
      { t: "Avoid Crush", d: "Lower Tier blocks are exiting first. Wait 5 mins for a clearer route.", icon: "wait" },
      { t: "Uber/Ola Pick", d: "Walking 200m to Gate G reduces pickup wait time by 18 mins.", icon: "car" },
      { t: "Post-Match Water", d: "Complimentary water bottles available at Gate E exit.", icon: "water" },
      { t: "Local Train", d: "Churchgate bound trains are running at 4-min intervals.", icon: "train" }
    ]
  }
];

/* ─────────────────────────────────────────────────────────────────
   REFUEL & SHOP DATA
───────────────────────────────────────────────────────────────── */
const FOOD_STALLS = [
  {
    id: "s1", name: "The Batter Box", type: "Main Meals", logo: "🏏", floor: "Level 1", gate: "Gate A", prepTime: 8,
    menu: [
      { id: "m1", name: "Sixer Burger", price: 280, cal: 540, d: "Double stack with melted cheddar, ghost pepper mayo, and caramelized onions on a brioche bun.", emoji: "🍔" },
      { id: "m2", name: "Boundary Fries", price: 150, cal: 320, d: "Thick-cut stadium fries loaded with warm cheese sauce and pickled jalapeños.", emoji: "🍟" }
    ],
    locations: ["sachin", "sunil", "rohit"]
  },
  {
    id: "s2", name: "Wicket Wings", type: "Snacks", logo: "🍗", floor: "Ground", gate: "Gate D", prepTime: 6,
    menu: [
      { id: "m3", name: "Spicy Wickets", price: 320, cal: 480, d: "8pcs of high-intensity hot wings tossed in our signature stadium buffalo sauce.", emoji: "🍗" },
      { id: "m4", name: "Googly Nachos", price: 180, cal: 410, d: "Corn tortilla chips layered with salsa, beans, and extra melted cheese.", emoji: "🌮" }
    ],
    locations: ["vijay", "north", "rohit"]
  },
  {
    id: "s3", name: "Sixer Soda", type: "Beverages", logo: "🥤", floor: "Level 1", gate: "Gate B", prepTime: 2,
    menu: [
      { id: "m5", name: "Cooler Cola", price: 120, cal: 140, d: "Large fountain soda served over crushed ice.", emoji: "🥤" },
      { id: "m6", name: "Matchday Mocktail", price: 210, cal: 180, d: "Blue lagoon refresher with lime, mint, and a splash of zest.", emoji: "🍹" }
    ],
    locations: ["sachin", "vijay", "sunil", "north", "rohit"]
  },
  {
    id: "s4", name: "Taco Turf", type: "Mexican", logo: "🌮", floor: "Level 2", gate: "Gate F", prepTime: 7,
    menu: [
      { id: "m7", name: "Grand Slam Tacos", price: 310, cal: 420, d: "Two soft tortillas with spicy paneer, pico de gallo, and avocado crema.", emoji: "🌮" },
      { id: "m8", name: "Nachos Overload", price: 240, cal: 650, d: "Extra large box with three types of cheese, beans, and stadium salsa.", emoji: "🥙" }
    ],
    locations: ["north", "vip", "rohit"]
  },
  {
    id: "s5", name: "Bowl Out", type: "Healthy", logo: "🥗", floor: "Level 1", gate: "Gate C", prepTime: 5,
    menu: [
      { id: "m9", name: "Green Field Salad", price: 290, cal: 210, d: "Local greens with grilled veggies, walnuts, and a balsamic matchday drizzle.", emoji: "🥗" },
      { id: "m10", name: "Quinoa Quicket", price: 340, cal: 310, d: "Power bowl with quinoa, chickpeas, feta, and slow-roasted peppers.", emoji: "🥣" }
    ],
    locations: ["vijay", "sunil", "rohit"]
  },
  {
    id: "s6", name: "Waffle Wallah", type: "Desserts", logo: "🧇", floor: "Ground", gate: "Gate G", prepTime: 6,
    menu: [
      { id: "m11", name: "Belgian Boundary", price: 220, cal: 480, d: "Warm waffle topped with dark chocolate, sprinkles, and vanilla gelato.", emoji: "🧇" },
      { id: "m12", name: "Fruity Pavilion", price: 240, cal: 350, d: "Oat waffle with seasonal berries and wild honey.", emoji: "🍓" }
    ],
    locations: ["sachin", "vijay", "rohit"]
  },
  {
    id: "s7", name: "Chai Chucker", type: "Café", logo: "☕", floor: "Level 2", gate: "Gate E", prepTime: 3,
    menu: [
      { id: "m13", name: "Ginger Tea", price: 80, cal: 45, d: "Hot milk tea infused with organic ginger.", emoji: "☕" },
      { id: "m14", name: "Stadium Steep", price: 150, cal: 120, d: "Double shot espresso with creamy local dairy.", emoji: "☕" }
    ],
    locations: ["north", "sachin", "sunil", "vijay", "rohit"]
  }
];

const FULFILLMENT_INFO = {
  pickup: {
    t: "Express Pickup",
    d: "Pre-order and collect at the high-priority express lane of the stall. Skip the general queue entirely."
  },
  seat: {
    t: "Deliver to Seat",
    d: "Our mobile stadium staff will bring your order directly to your stand, block, and seat row. (Est 10-15 mins)"
  }
};

const MERCHANDISE = [
  { id: "me1", name: "Team Jersey 2024", price: 1299, desc: "Official Home Kit", details: "100% breathable polyester with embroidered team crest and sponsor logos.", type: "Apparel" },
  { id: "me2", name: "Victory Flag", price: 250, desc: "Large 3x5ft with pole", details: "Durable silk-screened fabric with lightweight retractable pole.", type: "Fan Gear" },
  { id: "me3", name: "Stadium Cap", price: 499, desc: "Adjustable snapback", details: "Premium cotton twill with 3D embossed team logo.", type: "Apparel" },
  { id: "me4", name: "Foam Hand #1", price: 180, desc: "Large cheering hand", details: "Soft high-density foam with 'Go Team' print.", type: "Fan Gear" }
];

const IN_STAND_SERVICE = {
  label: "Stand Express",
  desc: "Water & Quick Snacks sellers are walking in your aisle right now.",
  currentRow: "Walking in Row 12",
  items: ["Mineral Water (500ml)", "Salted Peanuts", "Popcorn Bag"]
};

function Legend() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", padding: "8px 0" }}>
      {LEGEND_TYPES.map(type => (
        <div key={type} style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ display: "inline-block", width: 10, height: 10, border: `1.5px solid ${T[type].stroke}`, background: T[type].fill }} />
          <span style={{ fontSize: 9, color: "#555", fontFamily: "var(--font-sans-main)" }}>{T[type].label}</span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   COMMUTE — transport + parking (preserved)
───────────────────────────────────────────────────────────────── */
const TRANSPORT = [
  {
    id: "metro", mode: "Metro", line: "Aqua Line", stop: "Stadium Metro",
    gateNear: "Gate A", walk: "2 min walk", freq: "Every 8 min", status: "On Time", statusColor: "#29CC7A", accent: "#0EFFE4",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><rect x="3" y="3" width="18" height="14" rx="0" /><path d="M3 11h18" /><path d="M8 17l-2 4M16 17l2 4M8 21h8" /><circle cx="8" cy="7" r="1" fill="currentColor" /><circle cx="16" cy="7" r="1" fill="currentColor" /></svg>,
  },
  {
    id: "bus", mode: "Bus", line: "Route 142C", stop: "Gate 3 Bus Stop",
    gateNear: "Gate C", walk: "3 min walk", freq: "Every 12 min", status: "3 min away", statusColor: "#FFB800", accent: "#D5FF5C",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><path d="M8 6v6M3 6h18M3 6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h1" /><path d="M21 6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-1" /><path d="M8 18h8" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>,
  },
  {
    id: "train", mode: "Local Train", line: "Western Line", stop: "Churchgate",
    gateNear: "Gate F", walk: "5 min walk", freq: "Every 6 min", status: "On Time", statusColor: "#29CC7A", accent: "#29CC7A",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><path d="M12 2C8 2 5 5 5 8v8l2 3h10l2-3V8c0-3-3-6-7-6Z" /><path d="M5 15h14" /><path d="M9 3v5M15 3v5" /><circle cx="9" cy="19" r="1" fill="currentColor" /><circle cx="15" cy="19" r="1" fill="currentColor" /></svg>,
  },
];
const PARKING = [
  { id: "p1", name: "Stadium Gate B", gateNear: "Gate B", distance: "200m", walk: "3 min walk", spots: 48, total: 200, price: "₹80/hr" },
  { id: "p2", name: "Wankhede East Parking", gateNear: "Gate D", distance: "350m", walk: "5 min walk", spots: 12, total: 120, price: "₹60/hr" },
  { id: "p3", name: "Marine Lines Multilevel", gateNear: "Gate E", distance: "600m", walk: "8 min walk", spots: 135, total: 500, price: "₹40/hr" },
];

function SL({ children, accent = "#666" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <span style={{ display: "block", width: 14, height: 2, background: accent, flexShrink: 0 }} />
      <span style={{ fontFamily: "var(--font-sans-main)", fontSize: 10, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.12em" }}>{children}</span>
    </div>
  );
}
function TransportCard({ t }) {
  return (
    <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--surface-border)", borderLeft: `3px solid ${t.accent}`, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 14 }}>
      <div style={{ width: 42, height: 42, minWidth: 42, background: `${t.accent}14`, border: `1px solid ${t.accent}44`, display: "flex", alignItems: "center", justifyContent: "center", color: t.accent, flexShrink: 0 }}>{t.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <div style={{ fontFamily: "var(--font-sans-main)", fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{t.mode}</div>
          <span style={{ fontFamily: "var(--font-mono-main)", fontSize: 9, fontWeight: 700, color: t.statusColor, border: `1px solid ${t.statusColor}44`, background: `${t.statusColor}12`, padding: "2px 7px" }}>{t.status}</span>
        </div>
        <div style={{ fontFamily: "var(--font-sans-main)", fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>{t.line} · {t.stop}</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, color: "var(--accent-yellow)", fontFamily: "var(--font-sans-main)", fontWeight: 700 }}>Nearest: {t.gateNear}</span>
          <span style={{ fontSize: 10, color: "var(--text-tertiary)", fontFamily: "var(--font-sans-main)" }}>⏱ {t.freq}</span>
          <span style={{ fontSize: 10, color: "var(--text-tertiary)", fontFamily: "var(--font-sans-main)" }}>⚡ {t.walk}</span>
        </div>
      </div>
    </div>
  );
}

function ParkingCard({ pk, onReserve, isReserved }) {
  const pct = Math.round((pk.spots / pk.total) * 100);
  const barColor = pct > 50 ? "#29CC7A" : pct > 20 ? "#FFB800" : "#FF4141";
  const isFull = pk.spots === 0;

  return (
    <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--surface-border)", padding: "14px 16px", opacity: isFull ? 0.7 : 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <div style={{ fontFamily: "var(--font-sans-main)", fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{pk.name}</div>
            {isReserved && (
              <span style={{ fontSize: 8, fontWeight: 700, color: "#7C3AED", border: "1px solid #7C3AED", padding: "1px 4px", textTransform: "uppercase" }}>Booked</span>
            )}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontFamily: "var(--font-sans-main)", marginBottom: 4 }}>Nearest: <span style={{ color: "var(--accent-yellow)", fontWeight: 700 }}>{pk.gateNear}</span> · {pk.distance} ({pk.walk})</div>
          <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontFamily: "var(--font-sans-main)" }}>{pk.price}</div>
        </div>
        <div style={{ fontFamily: "var(--font-mono-main)", fontSize: 18, fontWeight: 700, color: barColor, lineHeight: 1, textAlign: "right" }}>
          {pk.spots}<span style={{ fontSize: 9, color: "var(--text-tertiary)", display: "block" }}>{isFull ? "Full" : "spots left"}</span>
        </div>
      </div>
      <div style={{ height: 4, background: "var(--bg-elevated)", marginBottom: 12 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: barColor }} />
      </div>
      <button
        onClick={() => !isReserved && !isFull && onReserve(pk)}
        disabled={isReserved || isFull}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          background: isReserved ? "transparent" : isFull ? "var(--surface-border)" : "#7C3AED",
          color: isReserved ? "#7C3AED" : isFull ? "var(--text-tertiary)" : "#fff",
          border: isReserved ? "1px solid #7C3AED" : "none",
          padding: "10px 16px", fontFamily: "var(--font-sans-main)", fontSize: 11, fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.1em", cursor: isReserved || isFull ? "default" : "pointer",
          boxShadow: isReserved || isFull ? "none" : "3px 3px 0 #4C1D95"
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
          {isReserved ? <path d="M20 6 9 17l-5-5" /> : <><rect x="3" y="11" width="18" height="11" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>}
        </svg>
        {isReserved ? "Spot Secured" : isFull ? "No Slots Available" : "Reserve Your Spot"}
      </button>
    </div>
  );
}
function ReserveModal({ pk, onClose, onConfirm }) {
  const [step, setStep] = React.useState(0); // 0: Info, 1: T&C, 2: Payment
  const [agreed, setAgreed] = React.useState(false);

  // Reset internal state when modal is closed or parking changes
  React.useEffect(() => {
    if (!pk) {
      setStep(0);
      setAgreed(false);
    }
  }, [pk]);

  if (!pk) return null;

  const handleNext = () => setStep(s => s + 1);

  const handleFinalConfirm = () => {
    const beams = ["B1", "B2", "B3", "B4", "B5"];
    const beam = beams[Math.floor(Math.random() * beams.length)];
    const space = `${Math.floor(Math.random() * 200) + 1}`;
    onConfirm({ ...pk, beam, space });
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 1150, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--bg-secondary)", border: "1px solid var(--accent-yellow)", width: "100%", maxWidth: 400, padding: "32px", boxShadow: "12px 12px 0 rgba(0,0,0,0.5)" }}>

        {step === 0 && (
          <div className="flow-fade-in">
            <div style={{ fontSize: 10, color: "var(--accent-yellow)", fontWeight: 900, textTransform: "uppercase", marginBottom: 8, letterSpacing: "0.1em" }}>Step 01/03</div>
            <div style={{ fontFamily: "var(--font-serif-main)", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>Parking Reservation</div>
            <div style={{ background: "var(--bg-tertiary)", padding: "16px", marginBottom: 20, border: "1px solid var(--surface-border)" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{pk.name}</div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Allotment assigned upon confirmation.</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "var(--accent-yellow)", marginTop: 12 }}>₹40 <span style={{ fontSize: 10, opacity: 0.6 }}>Token Fee</span></div>
            </div>
            <p style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 24 }}>A token amount is required to secure your spot. This will be adjusted against your final parking bill at exit.</p>
            <button onClick={handleNext} style={{ width: "100%", padding: "14px", background: "var(--accent-yellow)", color: "#000", border: "none", fontWeight: 900, fontSize: 12, textTransform: "uppercase" }}>Continue to Terms</button>
          </div>
        )}

        {step === 1 && (
          <div className="flow-fade-in">
            <div style={{ fontSize: 10, color: "var(--accent-yellow)", fontWeight: 900, textTransform: "uppercase", marginBottom: 8, letterSpacing: "0.1em" }}>Step 02/03</div>
            <div style={{ fontFamily: "var(--font-serif-main)", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>Terms & Conditions</div>
            <div style={{ height: 160, overflowY: "auto", background: "var(--bg-tertiary)", padding: "12px", border: "1px solid var(--surface-border)", marginBottom: 20, fontSize: 10, color: "var(--text-tertiary)", lineHeight: 1.6 }}>
              1. The reservation is valid only for the duration of today's match.<br /><br />
              2. Vehicle must be parked within the allotted spot. Failure to do so may result in towing.<br /><br />
              3. The stadium management is not responsible for any loss or damage to the vehicle.<br /><br />
              4. No oversized vehicles allowed in standard spots.<br /><br />
              5. Token fee is non-refundable.
            </div>
            <div onClick={() => setAgreed(!agreed)} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24, cursor: "pointer" }}>
              <div style={{ width: 18, height: 18, border: `2px solid ${agreed ? "var(--accent-cyan)" : "var(--surface-border)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {agreed && <div style={{ width: 10, height: 10, background: "var(--accent-cyan)" }} />}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-primary)", fontWeight: 700 }}>I agree to the Parking Policies</div>
            </div>
            <button disabled={!agreed} onClick={handleNext} style={{ width: "100%", padding: "14px", background: agreed ? "var(--accent-yellow)" : "var(--bg-tertiary)", color: agreed ? "#000" : "var(--text-tertiary)", border: "none", fontWeight: 900, fontSize: 12, textTransform: "uppercase", cursor: agreed ? "pointer" : "not-allowed" }}>Pay Token Amount</button>
          </div>
        )}

        {step === 2 && (
          <div className="flow-fade-in" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "var(--accent-yellow)", fontWeight: 900, textTransform: "uppercase", marginBottom: 8, letterSpacing: "0.1em" }}>Step 03/03</div>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💰</div>
            <div style={{ fontFamily: "var(--font-serif-main)", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>Digital Payment</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 24 }}>Securing connection to your FanFlow Wallet...</div>
            <div style={{ background: "rgba(0,0,0,0.2)", padding: "20px", border: "1px dashed var(--surface-border)", marginBottom: 24 }}>
              <div style={{ fontSize: 10, color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: 4 }}>Amount to Pay</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "var(--text-primary)" }}>₹40.00</div>
            </div>
            <button onClick={handleFinalConfirm} style={{ width: "100%", padding: "14px", background: "var(--accent-green)", color: "#fff", border: "none", fontWeight: 900, fontSize: 12, textTransform: "uppercase", boxShadow: "4px 4px 0 rgba(0,0,0,0.2)" }}>Authorized & Reserve</button>
          </div>
        )}

        <button onClick={onClose} style={{ width: "100%", border: "none", background: "none", color: "var(--text-tertiary)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", marginTop: 16, cursor: "pointer" }}>Cancel Reservation</button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN INNER COMPONENT
───────────────────────────────────────────────────────────────── */
function FlowSkeleton() {
  return (
    <div className="flow-fade-in" style={{ paddingBottom: 60 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <div className="shimmer" style={{ width: 120, height: 12, borderRadius: 2 }} />
        <div className="shimmer" style={{ width: 80, height: 12, borderRadius: 2 }} />
      </div>
      <div className="shimmer" style={{ height: 120, marginBottom: 20, borderRadius: 2 }} />
      <div className="shimmer" style={{ width: 180, height: 12, marginBottom: 12, borderRadius: 2 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="shimmer" style={{ height: 60, borderRadius: 2 }} />
        ))}
      </div>
    </div>
  );
}

function FlowView({ scenario, stand, selectedSeats = [] }) {
  const S = FLOW_SCENARIOS[scenario];
  const isSachin = stand?.id === "sachin";

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(t);
  }, [scenario]);

  const [visibleCount, setVisibleCount] = useState(2);
  useEffect(() => {
    if (isLoading) {
      setVisibleCount(2);
      return;
    }
    const timers = S.recs.slice(2).map((_, i) => setTimeout(() => setVisibleCount(i + 3), (i + 1) * 2000));
    return () => timers.forEach(clearTimeout);
  }, [scenario, isLoading]);

  const [driftMetrics, setDriftMetrics] = useState(S.metrics);
  useEffect(() => {
    const base = { ...S.metrics };
    if (stand) {
      if (stand.id === "sachin" && S.id === "arrival") base.gate = "Extreme";
      if (stand.id === "vijay" && S.id === "action") base.food = "High";
      if (stand.id === "sunil" && S.id === "departure") base.gate = "Critical";
    }
    setDriftMetrics(base);
  }, [scenario, stand]);

  if (isLoading) return <FlowSkeleton />;

  const hasSeats = selectedSeats.length > 0;
  const seatInfo = hasSeats ? `R${selectedSeats[0].row} S${selectedSeats[0].seat}${selectedSeats.length > 1 ? ` + ${selectedSeats.length - 1}` : ""}` : "";

  const evacuationPlan = [
    { step: "Keep Calm", detail: "Remain in your seat until instructed. Avoid sudden movements that cause panic." },
    { step: "Primary Route", detail: `Head to ${stand?.gateNear || "nearest gate"}. Follow glowing exit markers.` },
    { step: "Stairwell Priority", detail: "Allow elderly/handicap priority. Do NOT use elevators." },
    { step: "Medical Zones", detail: "First Aid located at Level 1 Concourse (East) and Level 3 (West)." },
    { step: "Safe Assembly", detail: "Once outside, proceed to the North Parking lot for roll call." }
  ];

  return (
    <div className="flow-fade-in" style={{ paddingBottom: 60 }} key={scenario}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="flow-pulse-red" style={{ width: 8, height: 8, background: "var(--accent-red)", borderRadius: "50%" }} />
          <span style={{ fontFamily: "var(--font-mono-main)", fontSize: 10, color: "var(--accent-red)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em" }}>
            Live Flow {isSachin ? "⚡ High Priority" : "Syncing..."}
          </span>
        </div>
        <div style={{ fontSize: 10, color: "var(--text-tertiary)", fontFamily: "var(--font-mono-main)" }}>Scenario: {S.label}</div>
      </div>

      {isSachin && (
        <div style={{
          background: "var(--accent-yellow)", color: "#0D0D0D", padding: "6px 12px",
          marginBottom: 16, fontFamily: "var(--font-sans-main)", fontSize: 10,
          fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em",
          display: "flex", alignItems: "center", gap: 8, animation: "pulseIn 1s infinite"
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
          Critical match momentum: Rapid Crowd Shifts Detected
        </div>
      )}

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--surface-border)", padding: "20px 16px", marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Current Momentum</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-serif-main)" }}>{S.status}</div>

        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          {Object.entries(driftMetrics).map(([key, val]) => (
            <div key={key}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase" }}>{key}</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: val === "Extreme" || val === "Critical" ? "var(--accent-red)" : "var(--text-secondary)" }}>{val}</span>
              </div>
              <div style={{ height: 3, background: "rgba(255,255,255,0.05)", position: "relative" }}>
                <div style={{
                  height: "100%",
                  width: val === "Low" ? "20%" : val === "Moderate" ? "45%" : val === "High" ? "75%" : val === "Extreme" || val === "Critical" ? "95%" : "10%",
                  background: val === "Extreme" || val === "Critical" ? "var(--accent-red)" : "var(--accent-cyan)",
                  transition: "width 3s cubic-bezier(0.4, 0, 0.2, 1)"
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--accent-yellow)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12, borderBottom: "1px solid rgba(213,255,92,0.2)", paddingBottom: 6 }}>Time Saving Recommendations</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {S.recs.slice(0, visibleCount).map((r, idx) => (
          <div key={idx} className="rec-rollout" style={{ background: "var(--bg-tertiary)", border: "1px solid var(--surface-border)", borderLeft: `4px solid var(--accent-yellow)`, padding: "14px", display: "flex", gap: 14 }}>
            <div style={{ width: 32, height: 32, background: "rgba(213,255,92,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-yellow)" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-primary)", marginBottom: 3 }}>{r.t}</div>
              <div style={{ fontSize: 10, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {hasSeats ? `From ${seatInfo}: ` : stand ? `Near ${stand.short}: ` : ""}{r.d}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--accent-red)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12, borderBottom: "1px solid rgba(255,65,65,0.2)", paddingBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          Safety & Evacuation
        </div>
        <div style={{ background: "rgba(255,65,65,0.03)", border: "1px solid rgba(255,65,65,0.1)", padding: "16px" }}>
          {evacuationPlan.map((item, idx) => (
            <div key={idx} style={{ marginBottom: idx === evacuationPlan.length - 1 ? 0 : 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-red)", marginBottom: 2, opacity: 0.9 }}>{item.step}</div>
              <div style={{ fontSize: 10, color: "var(--text-tertiary)", lineHeight: 1.4 }}>{item.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 24, padding: "12px", border: "1px dashed var(--surface-border)", textAlign: "center" }}>
        <p style={{ fontSize: 9, color: "var(--text-tertiary)", margin: 0, fontFamily: "var(--font-mono-main)" }}>
          {stand ? `OPTIMIZING FLOW FOR ${stand.short.toUpperCase()} STAND...` : "GLOBAL STADIUM METRICS SYNCED."}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   STALL CARD COMPONENT (Helper)
───────────────────────────────────────────────────────────────── */
function StallCard({ s, selected, onSelect, isSelectedView, orderType, setOrderType, onOrder }) {
  return (
    <div style={{
      background: "var(--bg-secondary)", border: `1px solid ${selected ? "var(--accent-cyan)" : "var(--surface-border)"}`,
      padding: "20px", display: "flex", flexDirection: "column", gap: 16,
      transform: selected && isSelectedView ? "scale(1.02)" : "none",
      transition: "all 0.3s ease",
      boxShadow: selected ? "0 8px 24px rgba(14, 255, 228, 0.1)" : "none"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 24 }}>{s.logo}</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>{s.name}</div>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px 8px", marginTop: 2 }}>
              <div style={{ fontSize: 9, color: "var(--accent-cyan)", textTransform: "uppercase", fontWeight: 700 }}>{s.type}</div>
              <div style={{ fontSize: 9, color: "var(--text-tertiary)", fontWeight: 700 }}>📍 {s.floor} · {s.gate}</div>
            </div>
          </div>
        </div>
        {!isSelectedView && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 10, color: "var(--accent-yellow)", fontWeight: 700, whiteSpace: "nowrap" }}>⏱️ {s.displayEta}</div>
            <button
              onClick={() => onSelect(s)}
              style={{ padding: "8px 16px", background: "none", border: "1px solid var(--surface-border)", color: "var(--accent-cyan)", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}
            >
              View Menu
            </button>
          </div>
        )}
      </div>

      {selected && isSelectedView && (
        <div className="flow-fade-in">
          <div style={{ borderTop: "1px dashed var(--surface-border)", paddingTop: 16, marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "var(--text-tertiary)", fontWeight: 700 }}>Selected: <span style={{ color: "var(--accent-yellow)" }}>{s.displayEta}</span></div>
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              {["pickup", "seat"].map(type => (
                <div key={type} style={{ flex: 1 }}>
                  <button
                    onClick={() => setOrderType(type)}
                    style={{
                      width: "100%", padding: "10px", background: orderType === type ? "var(--accent-yellow)1a" : "none",
                      border: `1px solid ${orderType === type ? "var(--accent-yellow)" : "var(--surface-border)"}`,
                      color: orderType === type ? "var(--accent-yellow)" : "var(--text-tertiary)",
                      fontSize: 10, fontWeight: 700, textTransform: "uppercase"
                    }}
                  >
                    {FULFILLMENT_INFO[type].t}
                  </button>
                </div>
              ))}
            </div>

            <div style={{ background: "var(--bg-tertiary)", border: "1px solid var(--surface-border)", padding: "12px", marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{FULFILLMENT_INFO[orderType].t}</div>
              <div style={{ fontSize: 10, color: "var(--text-secondary)", lineHeight: 1.4 }}>{FULFILLMENT_INFO[orderType].d}</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {s.menu.map(item => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-tertiary)", padding: "12px", border: "1px solid var(--surface-border)" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{item.emoji} {item.name}</div>
                    <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginTop: 2 }}>₹{item.price} · {item.cal} kcal</div>
                  </div>
                  <button
                    onClick={() => onOrder({
                      ...item,
                      stall: s.name,
                      type: orderType,
                      eta: orderType === "pickup" ? "~4 mins" : "~15 mins"
                    })}
                    style={{ padding: "8px 16px", background: "var(--text-primary)", color: "var(--bg-primary)", border: "none", fontSize: 10, fontWeight: 900, textTransform: "uppercase" }}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onSelect(null)}
            style={{ width: "100%", padding: "12px", background: "none", border: "none", color: "var(--text-tertiary)", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}
          >
            Back to stalls
          </button>
        </div>
      )}
    </div>
  );
}

function RefuelView({ stand, selectedSeats = [], onSelect }) {
  const [activeCategory, setActiveCategory] = useState("stalls");
  const [selectedStall, setSelectedStall] = useState(null);
  const [orderType, setOrderType] = useState("pickup");
  const [flagRaised, setFlagRaised] = useState(false);

  const stallsNear = stand ? FOOD_STALLS.filter(s => s.locations.includes(stand.id)) : FOOD_STALLS;

  // Dynamic ETA & Location enrichment
  const enrichStall = (s, isRecommended) => {
    // Unique base time for each stall
    const baseWalk = isRecommended ? 3 : 7;
    const baseSeat = isRecommended ? 12 : 18;
    const speedFactor = s.type === "Beverages" || s.type === "Café" ? 0.5 : 1;

    const walkTime = Math.max(2, Math.round(baseWalk * speedFactor + (parseInt(s.id.slice(1)) % 3)));
    const seatTime = Math.max(5, Math.round(baseSeat * speedFactor + (parseInt(s.id.slice(1)) * 2 % 5)));

    const currentEta = orderType === "pickup" ? `~${walkTime} mins walk` : `~${seatTime} mins delivery`;
    const simpleEta = orderType === "pickup" ? `${walkTime}m` : `${seatTime}m`;

    return { ...s, displayEta: currentEta, simpleEta };
  };

  const recTop = stallsNear.slice(0, 3).map(s => enrichStall(s, true));
  const recRest = stallsNear.slice(3).map(s => enrichStall(s, true));
  const otherStalls = FOOD_STALLS.filter(s => !stallsNear.includes(s)).map(s => enrichStall(s, false));

  const enrichedSelected = selectedStall ? enrichStall(selectedStall, stallsNear.includes(selectedStall)) : null;


  const SL = ({ children, accent }) => <div style={{ fontSize: 10, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12, borderBottom: `1px solid ${accent}40`, paddingBottom: 6 }}>{children}</div>;

  return (
    <div className="flow-fade-in" style={{ paddingBottom: 80 }}>
      {/* Category Toggle */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {["stalls", "merch"].map(c => (
          <button
            key={c}
            onClick={() => { setActiveCategory(c); setSelectedStall(null); }}
            style={{
              flex: 1, padding: "12px", background: activeCategory === c ? "var(--text-primary)" : "var(--bg-tertiary)",
              color: activeCategory === c ? "var(--bg-primary)" : "var(--text-secondary)",
              border: `1px solid ${activeCategory === c ? "var(--text-primary)" : "var(--surface-border)"}`,
              fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em"
            }}
          >
            {c === "stalls" ? "Stalls & Food" : "Fan Merchandise"}
          </button>
        ))}
      </div>

      {activeCategory === "stalls" ? (
        <>
          {/* In-Stand Service Banner */}
          {stand && (
            <div style={{
              background: "linear-gradient(45deg, #7C3AED, #4C1D95)", padding: "18px",
              marginBottom: 24, border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 24px rgba(124, 58, 237, 0.2)",
              position: "relative", overflow: "hidden"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 24, height: 24, background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>⚡</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em" }}>{IN_STAND_SERVICE.label}</div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.15)", padding: "4px 8px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.2)" }}>
                  <div style={{ fontSize: 9, fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em" }}>{IN_STAND_SERVICE.currentRow}</div>
                </div>
              </div>

              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", marginBottom: 12, lineHeight: 1.4 }}>{IN_STAND_SERVICE.desc}</div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {IN_STAND_SERVICE.items.map(i => (
                    <span key={i} style={{ fontSize: 9, background: "rgba(0,0,0,0.2)", padding: "4px 8px", borderRadius: 2, color: "#fff", fontWeight: 700 }}>{i}</span>
                  ))}
                </div>

                <button
                  onClick={() => setFlagRaised(true)}
                  disabled={flagRaised}
                  style={{
                    background: flagRaised ? "var(--accent-green)" : "#fff",
                    color: flagRaised ? "#fff" : "#7C3AED",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: 2,
                    fontSize: 10,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    cursor: flagRaised ? "default" : "pointer",
                    boxShadow: "3px 3px 0 rgba(0,0,0,0.2)",
                    transition: "all 0.2s"
                  }}
                >
                  {flagRaised ? "✅ Notified" : "🚩 Raise Flag"}
                </button>
              </div>

              {flagRaised && (
                <div style={{ marginTop: 12, fontSize: 9, color: "var(--accent-green)", fontWeight: 700, textTransform: "uppercase", textAlign: "center", padding: "6px", background: "rgba(41, 204, 122, 0.1)", border: "1px dashed var(--accent-green)" }}>
                  Seller will look for you in Row {selectedSeats[0]?.row || "?"} soon
                </div>
              )}
            </div>
          )}

          {/* Stall Browser */}
          {!selectedStall && (
            <>
              {recTop.length > 0 && (
                <>
                  <SL accent="var(--accent-cyan)">Recommended for you</SL>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                    {recTop.map(s => (
                      <StallCard key={s.id} s={s} selected={false} onSelect={setSelectedStall} isSelectedView={false} />
                    ))}
                  </div>
                </>
              )}

              {recRest.length > 0 && (
                <>
                  <SL accent="var(--accent-green)">Available in your nearest stands</SL>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                    {recRest.map(s => (
                      <StallCard key={s.id} s={s} selected={false} onSelect={setSelectedStall} isSelectedView={false} />
                    ))}
                  </div>
                </>
              )}

              {otherStalls.length > 0 && (
                <>
                  <SL accent="var(--text-tertiary)">stalls available in stadium</SL>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                    {otherStalls.map(s => (
                      <StallCard key={s.id} s={s} selected={false} onSelect={setSelectedStall} isSelectedView={false} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {enrichedSelected && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              <StallCard
                s={enrichedSelected}
                selected={true}
                onSelect={setSelectedStall}
                isSelectedView={true}
                orderType={orderType}
                setOrderType={setOrderType}
                onOrder={(item) => onSelect({ ...item, eta: enrichedSelected.simpleEta })}
              />
            </div>
          )}
        </>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {MERCHANDISE.map(m => (
            <div key={m.id} style={{ background: "var(--bg-secondary)", border: "1px solid var(--surface-border)", padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ height: 100, background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>
                {m.name.includes("Jersey") ? "👕" : m.name.includes("Flag") ? "🚩" : m.name.includes("Cap") ? "🧢" : "📣"}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>{m.name}</div>
                <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginBottom: 8 }}>{m.desc}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: "var(--accent-yellow)" }}>₹{m.price}</div>
                  <button
                    onClick={() => onSelect({ name: m.name, price: m.price, type: "merch", emoji: "🛍️", d: m.details })}
                    style={{ width: 32, height: 32, background: "var(--text-primary)", color: "var(--bg-primary)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
function MapPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") === "commute" ? "commute" : "map");
  const [floor, setFloor] = useState("ground");
  const [selectedId, setSelectedId] = useState(null);   // sector id
  const [selAmenity, setSelAmenity] = useState(null);   // amenity id in stand view
  const [reserving, setReserving] = useState(null);
  const [reservedParkingId, setReservedParkingId] = useState(null);
  const [parkings, setParkings] = useState(PARKING);
  const [errorMsg, setErrorMsg] = useState("");
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [selPayment, setSelPayment] = useState(null);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [flowScenario, setFlowScenario] = useState(0);
  const [parkingOutcome, setParkingOutcome] = useState(null);
  const [showParkingSuccess, setShowParkingSuccess] = useState(false);
  const [showFlowPlan, setShowFlowPlan] = useState(false);

  const { addOrder, selectedSeats, setSelectedSeats, addNotification } = useRetail();

  // Simulation: Trigger Match Notifications based on Flow Scenarios
  useEffect(() => {
    const scenario = FLOW_SCENARIOS[flowScenario];
    if (!scenario) return;

    let title = "";
    let msg = "";
    let type = "match";

    switch(flowScenario) {
      case 0: // Hydration Update
        title = "💧 Quick Hydration Check";
        msg = "Free Water Station #3 (behind Section 4) has zero waiting time. Ideal moment for a refill.";
        type = "match";
        break;
      case 1: // Exit Gates (High Traffic)
        title = "🔴 High Traffic: North Gates";
        msg = "Exit Gates A & F are currently at 95% capacity. We recommend using West Exit Gate E to save 12 mins.";
        type = "danger";
        break;
      case 2: // Washroom Update
        title = "✨ Restroom Pulse";
        msg = "Washrooms near Sachin Stand Section 1 have reached 10% capacity. Great time for a quick break.";
        type = "match";
        break;
      case 3: // Food Stalls (High Traffic)
        title = "🔴 Peak Volume: Level 1 Food";
        msg = "Heavy congestion detected at Level 1 Food Stalls. Average wait is 18 mins. Level 2 counters are currently clear.";
        type = "danger";
        break;
    }

    if (title && msg) {
      addNotification(title, msg, type);
    }
  }, [flowScenario]);

  // Sync state with URL parameter for bottom navigation
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "commute") setActiveTab("commute");
    else if (tab === "flow") setActiveTab("flow");
    else if (tab === "refuel") setActiveTab("refuel");
    else setActiveTab("map");
  }, [searchParams]);

  // Loop through flow scenarios 
  useEffect(() => {
    const intervalTime = 13500; // 13.5 seconds

    const timer = setInterval(() => {
      setFlowScenario(prev => {
        if (prev >= FLOW_SCENARIOS.length - 1) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [selectedId]);

  const stand = SECTORS.find(s => s.id === selectedId);
  const amenity = stand
    ? [...STAND_AMENITIES, ...(STAND_LIFTS[stand.id] || [])].find(a => a.id === selAmenity)
    : null;

  function handleSelectSector(id) {
    setSelectedId(id);
    setSelAmenity(null);
    setSelectedSeats([]);
  }

  function handleSelectSeat(seat) {
    setSelectedSeats(prev => {
      const exists = prev.find(s => s.row === seat.row && s.seat === seat.seat && s.section === seat.section);
      if (exists) {
        return prev.filter(s => s !== exists);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, seat];
    });
  }

  function getClosestAmenities(seatsArr) {
    if (!seatsArr || seatsArr.length === 0) return null;
    const all = [...STAND_AMENITIES, ...(STAND_LIFTS[stand?.id] || [])];

    const avgX = seatsArr.reduce((acc, s) => acc + s.x, 0) / seatsArr.length;
    const avgY = seatsArr.reduce((acc, s) => acc + s.y, 0) / seatsArr.length;

    const dist = (a) => Math.sqrt(Math.pow(a.x - avgX, 2) + Math.pow(a.y - avgY, 2));

    const types = ["wc", "food", "water", "lift", "fe"];
    const results = {};

    types.forEach(type => {
      const filtered = all.filter(a => a.type === type);
      if (filtered.length > 0) {
        results[type] = filtered.reduce((prev, curr) => dist(curr) < dist(prev) ? curr : prev);
      }
    });

    return results;
  }

  function handleReserveRequest(pk) {
    if (reservedParkingId) {
      setErrorMsg("Only one parking can be reserved");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    setReserving(pk);
  }

  function handleConfirmReservation(allotment) {
    if (!allotment) return;
    setParkings(prev => prev.map(p =>
      p.id === allotment.id ? { ...p, spots: Math.max(0, p.spots - 1) } : p
    ));
    setReservedParkingId(allotment.id);

    // Add to global order history
    const parkingOrder = {
      id: `PK-${Math.floor(Math.random() * 9000) + 1000}`,
      type: "parking",
      name: allotment.name,
      emoji: "🅿️",
      beam: allotment.beam,
      space: allotment.space,
      price: "₹40 Token Paid",
      status: "active",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      qrVal: `FANFLOW-PK-${Date.now()}`,
      eta: "Spot Reserved"
    };
    addOrder(parkingOrder, true); // skip immediate QR popup
    setReserving(null);
    setParkingOutcome({ beam: allotment.beam, spot: allotment.space });
    setShowParkingSuccess(true);
  }

  function handleCompleteOrder(item) {
    if (item.type === "seat" && selectedSeats.length === 0) {
      setErrorMsg("Please select your seat on the map first to enable in-seat delivery.");
      setTimeout(() => setErrorMsg(""), 4000);
      return;
    }
    setCheckoutItem(item);
  }

  function handleDirectFinalConfirm(payMode) {
    const isParking = checkoutItem.type === "parking";
    const finalOrder = {
      ...checkoutItem,
      stand: stand?.short || "Stadium",
      paymentMode: payMode,
      status: "active",
      id: `ORDER-${Math.floor(Math.random() * 9000) + 1000}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      qrVal: `FANFLOW-ORDER-${Date.now()}`,
      seats: checkoutItem.type === "seat" ? selectedSeats : []
    };

    // For parking, we skip the immediate QR popup and redirect to map tab
    addOrder(finalOrder, isParking); // Skip immediate QR popup for parking, users will go to basket
    setCheckoutItem(null);

    if (isParking) {
      setParkingOutcome({ beam: finalOrder.beam, spot: finalOrder.space });
      setShowParkingSuccess(true);
    }
  }

  function handleSelectForCheckout(item) {
    handleCompleteOrder(item);
  }

  const TABS = [
    { id: "map", label: "Map", icon: MapIcon },
    { id: "flow", label: "Live Flow", icon: Activity },
    { id: "refuel", label: "Refuel & Shop", icon: UtensilsCrossed },
    { id: "commute", label: "Commute", icon: Car }
  ];

  return (
    <div className="screen-content" style={{ padding: "0 0 80px" }}>
      <Header />
      <NotificationOverlay />

      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--surface-border)", marginBottom: 16 }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => router.push(`/map?tab=${tab.id}`)} style={{
            flex: 1, padding: "14px 4px", background: "transparent", border: "none",
            borderBottom: activeTab === tab.id ? "2px solid var(--accent-yellow)" : "2px solid transparent",
            color: activeTab === tab.id ? "var(--accent-yellow)" : "var(--text-tertiary)",
            fontFamily: "var(--font-sans-main)", fontSize: 10, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer", marginBottom: -1,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s"
          }}>
            <tab.icon size={16} strokeWidth={activeTab === tab.id ? 2.5 : 1.8} />
            <span style={{ fontSize: 10 }}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ══════ MAP TAB ══════ */}
      {activeTab === "map" && (
        <div>
          {/* Floor toggle & Home button */}
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <button onClick={() => router.push("/")} style={{
              padding: "8px 12px", background: "var(--bg-tertiary)", color: "var(--text-tertiary)",
              border: "1px solid var(--surface-border)", fontFamily: "var(--font-sans-main)", 
              fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer",
            }}>← HOME</button>
            {[{ id: "ground", label: "Ground Floor" }, { id: "upper", label: "Upper Deck" }].map(f => (
              <button key={f.id} onClick={() => { setFloor(f.id); setSelAmenity(null); }} style={{
                flex: 1, padding: "8px 0",
                background: floor === f.id ? "var(--accent-yellow)" : "transparent",
                color: floor === f.id ? "#0D0D0D" : "var(--text-tertiary)",
                border: floor === f.id ? "none" : "1px solid var(--surface-border)",
                fontFamily: "var(--font-sans-main)", fontSize: 10, fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer",
              }}>{f.label}</button>
            ))}
          </div>

          {/* ── Two-panel layout ── */}
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>

            {/* LEFT — compact overview map */}
            <div style={{ flex: "0 0 44%", minWidth: 0 }}>
              <div style={{ border: "1px solid var(--surface-border)", background: "#0A0A0A", position: "relative", overflow: "hidden" }}>
                <div style={{ height: 2, background: "linear-gradient(90deg,var(--accent-cyan),var(--accent-green),var(--accent-yellow))" }} />
                <OverviewSVG selectedId={selectedId} floor={floor} onSelect={handleSelectSector} />
              </div>

              {/* Below-map legend */}
              <div style={{ border: "1px solid var(--surface-border)", borderTop: "none", background: "var(--bg-secondary)", padding: "8px 10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, paddingBottom: 7, borderBottom: "1px solid var(--surface-border)" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--accent-yellow)" strokeWidth="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
                  <span style={{ fontSize: 8, color: "var(--accent-yellow)", fontFamily: "var(--font-sans-main)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Click sectors to interact</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 8px" }}>
                  {[
                    { color: "#4A9EFF", bg: "#0D1525", round: true, symbol: "A", label: "Gate — entry / exit" },
                    { color: "#29CC7A", bg: "#0A1A0F", round: false, symbol: "WC", label: "Washroom" },
                    { color: "#FF8C00", bg: "#1A0E00", round: false, symbol: "☕", label: "Food stall" },
                    { color: "#0EFFE4", bg: "#001A1A", round: false, symbol: "💧", label: "Free water station" },
                    { color: "#8B5CF6", bg: "#12082A", round: false, symbol: "HC", label: "Handicap access" },
                    { color: "#FF4141", bg: "#1A0808", round: false, symbol: "FE", label: "Fire exit" },
                    { color: "#D5FF5C", bg: "#181E06", round: false, symbol: "VIP", label: "VIP / Press box" },
                    { color: "#94A3B8", bg: "#151A22", round: false, symbol: "↑", label: "Lift / Elevator" },
                  ].map(item => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: 18, height: 14, minWidth: 18,
                        border: `1px solid ${item.color}`,
                        background: item.bg,
                        borderRadius: item.round ? "50%" : 0,
                        fontSize: 6, fontWeight: 700, color: item.color,
                        fontFamily: "monospace",
                      }}>{item.symbol}</span>
                      <span style={{ fontSize: 8, color: "#555", fontFamily: "var(--font-sans-main)", lineHeight: 1.3 }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — stand detail or hint */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {stand ? (
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontFamily: "var(--font-sans-main)", fontSize: 11, fontWeight: 700, color: stand.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 1 }}>{stand.name}</div>
                      <div style={{ fontSize: 9, color: "var(--text-tertiary)", fontFamily: "var(--font-sans-main)" }}>{stand.side} · {stand.gateNear}</div>
                    </div>
                    <button onClick={() => { setSelectedId(null); setSelAmenity(null); }} style={{ background: "transparent", border: "1px solid var(--surface-border)", color: "var(--text-tertiary)", padding: "4px 8px", fontSize: 9, fontFamily: "var(--font-sans-main)", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.08em" }}>← Back</button>
                  </div>

                  <div style={{ border: "1px solid var(--surface-border)", background: "#0A0A0A", position: "relative" }}>
                    <div style={{ height: 2, background: stand.color }} />
                    <StandSVG
                      stand={stand}
                      floor={floor}
                      selectedAmenity={selAmenity}
                      onSelectAmenity={setSelAmenity}
                      selectedSeats={selectedSeats}
                      onSelectSeat={handleSelectSeat}
                    />
                  </div>

                  {amenity ? (
                    <div style={{
                      marginTop: 8, padding: "10px 12px",
                      background: "var(--bg-secondary)",
                      border: `1px solid ${T[amenity.type].stroke}44`,
                      borderLeft: `3px solid ${T[amenity.type].stroke}`,
                      animation: "slideIn 0.2s ease both",
                      display: "flex", gap: 10, alignItems: "flex-start",
                    }}>
                      <div style={{ width: 28, height: 28, minWidth: 28, background: T[amenity.type].fill, border: `1px solid ${T[amenity.type].stroke}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 8, fontWeight: 700, color: T[amenity.type].stroke, fontFamily: "monospace" }}>{amenity.label}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "var(--font-sans-main)", fontSize: 11, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>{T[amenity.type].label}</div>
                        <div style={{ fontFamily: "var(--font-sans-main)", fontSize: 10, color: "var(--text-secondary)", lineHeight: 1.5 }}>{amenity.info}</div>
                      </div>
                      <button onClick={() => setSelAmenity(null)} style={{ background: "transparent", border: "none", color: "var(--text-tertiary)", cursor: "pointer", padding: 2, flexShrink: 0 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ) : (
                    <div style={{ marginTop: 6, fontSize: 9, color: "var(--text-tertiary)", textAlign: "center", fontFamily: "var(--font-sans-main)", letterSpacing: "0.06em", padding: "4px 0" }}>TAP ANY MARKER FOR DETAILS</div>
                  )}

                  <div style={{ marginTop: 20 }}>
                    {selectedSeats.length > 0 && (
                      <div style={{
                        marginBottom: 12, padding: "10px 14px", background: "rgba(213, 255, 92, 0.05)",
                        border: "1px solid var(--surface-border)", borderLeft: "4px solid var(--accent-yellow)",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        animation: "slideIn 0.3s ease-out"
                      }}>
                        <div style={{ fontSize: 9, fontWeight: 900, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Selection</div>
                        <div style={{ fontSize: 13, fontWeight: 900, color: "var(--accent-yellow)", fontFamily: "monospace" }}>
                          {selectedSeats.map(s => `R${s.row}:S${s.seat}`).join(" · ")}
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        if (selectedSeats.length > 0) setShowFlowPlan(true);
                      }}
                      disabled={selectedSeats.length === 0}
                      style={{
                        width: "100%", padding: "14px",
                        background: selectedSeats.length > 0 ? "var(--accent-yellow)" : "var(--bg-tertiary)",
                        color: selectedSeats.length > 0 ? "#000" : "var(--text-tertiary)",
                        border: "none", fontWeight: 900, fontSize: 13, textTransform: "uppercase",
                        letterSpacing: "0.05em", cursor: selectedSeats.length > 0 ? "pointer" : "not-allowed",
                        boxShadow: selectedSeats.length > 0 ? "6px 6px 0 rgba(0,0,0,0.5)" : "none",
                        transition: "all 0.2s"
                      }}
                    >
                      {selectedSeats.length > 0 ? "Plan My Flow →" : "Select seat to plan flow"}
                    </button>
                    <div style={{ fontSize: 9, color: "var(--text-tertiary)", textAlign: "center", marginTop: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      select min 1 seat to continue
                    </div>
                  </div>

                  <div style={{ marginTop: 16, borderTop: "1px solid var(--surface-border)", paddingTop: 8 }}>
                    <Legend />
                  </div>
                </div>
              ) : (
                <div style={{ border: "1px dashed var(--surface-border)", padding: "24px 16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, minHeight: 200 }}>
                  <div style={{ width: 40, height: 40, border: "1px solid var(--surface-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" /></svg>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-sans-main)", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4 }}>Select a Stand</div>
                    <div style={{ fontFamily: "var(--font-sans-main)", fontSize: 10, color: "var(--text-tertiary)", lineHeight: 1.6 }}>Tap any coloured sector on<br />the map to view seating,<br />facilities and access points.</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, width: "100%", marginTop: 4 }}>
                    {SECTORS.map(s => (
                      <button key={s.id} onClick={() => handleSelectSector(s.id)} style={{
                        background: `${s.color}14`, border: `1px solid ${s.color}44`,
                        color: s.color, padding: "7px 6px",
                        fontFamily: "var(--font-sans-main)", fontSize: 9, fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: "0.06em", cursor: "pointer",
                        textAlign: "center",
                      }}>{s.short} Stand</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🥡 Food Order Reminder Pop */}
      {activeTab === "map" && selectedSeats.length > 0 && searchParams.get("ref") === "order_reminder" && (
        <div style={{
          position: "fixed", bottom: 100, left: "50%", transform: "translateX(-50%)",
          zIndex: 1000, width: "calc(100% - 40px)", maxWidth: 360,
          animation: "popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both"
        }}>
          <div style={{
            background: "var(--bg-secondary)", border: "2px solid var(--accent-yellow)",
            padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
            boxShadow: "10px 10px 0 rgba(0,0,0,0.5)", borderRadius: 4
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: "var(--accent-yellow)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Seats Selected</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                Ready to return to your order?
              </div>
            </div>
            <button
              onClick={() => router.push('/food')}
              style={{
                background: "var(--accent-yellow)", color: "#000", border: "none",
                padding: "10px 18px", fontSize: 11, fontWeight: 900, textTransform: "uppercase",
                letterSpacing: "0.05em", cursor: "pointer", boxShadow: "4px 4px 0 rgba(0,0,0,0.2)"
              }}
            >
              Back to Food
            </button>
          </div>
        </div>
      )}

      {/* 🅿️ Parking Shortcut Pop (Commute Tab Only) */}
      {activeTab === "commute" && parkingOutcome && (
        <div style={{
          position: "fixed", bottom: 100, left: "50%", transform: "translateX(-50%)",
          zIndex: 1000, width: "calc(100% - 40px)", maxWidth: 360,
          animation: "popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both"
        }}>
          <div style={{
            background: "var(--bg-secondary)", border: "2px solid var(--accent-cyan)",
            padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
            boxShadow: "10px 10px 0 rgba(var(--accent-cyan-rgb),0.3)", borderBottom: "4px solid var(--accent-cyan)",
            borderRadius: 4
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 9, color: "var(--accent-cyan)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Spot Reserved · Beam {parkingOutcome.beam} · Spot {parkingOutcome.spot}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>
                Ticket in basket
              </div>
            </div>
            <button
              onClick={() => setActiveTab("map")}
              style={{
                background: "var(--accent-cyan)", color: "#000", border: "none",
                padding: "10px 16px", fontSize: 10, fontWeight: 900, textTransform: "uppercase",
                letterSpacing: "0.05em", cursor: "pointer", boxShadow: "4px 4px 0 rgba(0,0,0,0.2)"
              }}
            >
              Map
            </button>
          </div>
        </div>
      )}

      {activeTab === "flow" && (
        <FlowView scenario={flowScenario} stand={stand} selectedSeats={selectedSeats} />
      )}

      {activeTab === "refuel" && (
        <RefuelView stand={stand} selectedSeats={selectedSeats} onSelect={handleSelectForCheckout} />
      )}

      {activeTab === "commute" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 28, position: "relative" }}>
          <div style={{ padding: "0 4px", marginBottom: -4 }}>
            <div style={{ fontFamily: "var(--font-sans-main)", fontSize: 13, color: "var(--text-primary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Seamless Arrival</div>
            <div style={{ fontFamily: "var(--font-sans-main)", fontSize: 11, color: "var(--text-tertiary)", lineHeight: 1.6, maxWidth: "90%" }}>We've calculated the optimal entry points for you. Every transport and parking option is matched with its <span style={{ color: "var(--accent-yellow)" }}>nearest gate</span> and estimated walking time to fast track your entry into the stadium.</div>
          </div>
          <section>
            <SL accent="var(--accent-cyan)">Public Transport</SL>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{TRANSPORT.map(t => <TransportCard key={t.id} t={t} />)}</div>
          </section>
          <section>
            <SL accent="#7C3AED">Public Parking</SL>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {parkings.map(pk => <ParkingCard key={pk.id} pk={pk} onReserve={handleReserveRequest} isReserved={reservedParkingId === pk.id} />)}
            </div>
          </section>
          {errorMsg && (
            <div style={{ position: "fixed", bottom: 100, left: "50%", transform: "translateX(-50%)", background: "#FF4141", color: "#fff", padding: "12px 24px", fontFamily: "var(--font-sans-main)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", zIndex: 300, boxShadow: "4px 4px 0 #8B0000", border: "1px solid #8B0000" }}>{errorMsg}</div>
          )}
        </div>
      )}

      <ReserveModal
        pk={reserving}
        onClose={() => setReserving(null)}
        onConfirm={handleConfirmReservation}
      />

      <CheckoutModal
        item={checkoutItem}
        onClose={() => setCheckoutItem(null)}
        onConfirm={handleDirectFinalConfirm}
      />

      {/* Parking Success Modal */}
      {showParkingSuccess && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{
            background: "var(--bg-secondary)", border: "2px solid var(--accent-yellow)",
            width: "100%", maxWidth: 340, padding: "32px 24px", textAlign: "center",
            boxShadow: "10px 10px 0 rgba(0,0,0,0.5)", position: "relative"
          }}>
            <div style={{ fontSize: 50, marginBottom: 20 }}>🅿️</div>
            <h3 style={{ fontFamily: "var(--font-serif-main)", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>Spot Secured!</h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 24 }}>
              Your spot is secured! To access your **Collection QR Code**, simply visit your **Order Basket**.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button
                onClick={() => {
                  setShowParkingSuccess(false);
                  setActiveTab("map");
                }}
                style={{
                  width: "100%", padding: "14px", background: "var(--accent-yellow)", color: "#000",
                  border: "none", fontWeight: 900, fontSize: 12, textTransform: "uppercase",
                  cursor: "pointer", boxShadow: "4px 4px 0 rgba(0,0,0,0.2)"
                }}
              >
                Confirm & Select Seats →
              </button>
              <button
                onClick={() => setShowParkingSuccess(false)}
                style={{
                  width: "100%", padding: "10px", background: "none", border: "1px solid var(--surface-border)",
                  color: "var(--text-tertiary)", fontWeight: 700, fontSize: 10, textTransform: "uppercase",
                  cursor: "pointer"
                }}
              >
                Browse Normally
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flow Plan Modal */}
      {showFlowPlan && selectedSeats.length > 0 && (
        <FlowPlanModal
          seat={selectedSeats[0]}
          stand={stand}
          onClose={() => setShowFlowPlan(false)}
          onContinue={() => {
            setShowFlowPlan(false);
            setActiveTab("flow");
          }}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SMART FLOW PLAN MODAL
───────────────────────────────────────────────────────────────── */
function FlowPlanModal({ seat, stand, onClose, onContinue }) {
  // Logic to find nearest amenities
  const getNearest = (type) => {
    let minD = Infinity;
    let closest = null;
    STAND_AMENITIES.forEach(a => {
      if (a.type !== type) return;
      const d = Math.sqrt(Math.pow(seat.x - a.x, 2) + Math.pow(seat.y - a.y, 2));
      if (d < minD) { minD = d; closest = a; }
    });
    return closest;
  };

  const getNearestStair = () => {
    let minD = Infinity;
    let closestIdx = 0;
    ST.stairs.forEach((sx, i) => {
      const d = Math.abs(seat.x - sx);
      if (d < minD) { minD = d; closestIdx = i; }
    });
    return { name: `Stair ${String.fromCharCode(65 + closestIdx)}`, x: ST.stairs[closestIdx] };
  };

  const nWc = getNearest("wc");
  const nFood = getNearest("food");
  const nWater = getNearest("water");
  const nFe = getNearest("fe");
  const nStair = getNearestStair();

  const getDir = (targetX) => targetX > seat.x ? "to your right" : "to your left";

  const recs = [
    { label: "Washroom", item: nWc, icon: "🚽" },
    { label: "Food Stall", item: nFood, icon: "🍔" },
    { label: "Water Stand", item: nWater, icon: "💧" }
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 4000, display: "flex", alignItems: "center", justifyContent: "center", padding: 10 }}>
      <div style={{
        background: "var(--bg-secondary)", border: "2px solid #29CC7A",
        width: "100%", maxWidth: 420, position: "relative",
        boxShadow: "14px 14px 0 rgba(41, 204, 122, 0.15)"
      }}>
        {/* Header with Pattern */}
        <div style={{
          background: "linear-gradient(135deg, #29CC7A 0%, #1a8a50 100%)",
          padding: "20px", color: "#000",
          borderBottom: "4px solid #000"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 8, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 2, color: "rgba(0,0,0,0.6)" }}>Smart Navigation</div>
              <h2 style={{ fontFamily: "var(--font-serif-main)", fontSize: 22, fontWeight: 900, margin: 0, textTransform: "uppercase", lineHeight: 1 }}>Flow Plan</h2>
            </div>
            <div style={{ background: "#000", color: "#29CC7A", padding: "4px 8px", fontSize: 9, fontWeight: 900, fontFamily: "monospace", letterSpacing: "0.1em" }}>
              {stand.short.toUpperCase()} STAND
            </div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ opacity: 0.7 }}>Allocated:</span>
            <span style={{ background: "rgba(0,0,0,0.1)", padding: "2px 6px" }}>Row {seat.row} : Seat {seat.seat}</span>
          </div>
        </div>

        <div style={{ padding: "20px" }}>
          {/* Amenities Header */}
          <div style={{ fontSize: 10, fontWeight: 900, color: "#29CC7A", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
            <span>Nearest Facilities</span>
            <div style={{ flex: 1, height: 1, background: "rgba(41, 122, 122, 0.2)" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {recs.map(r => (
              <div key={r.label} style={{
                background: "var(--bg-tertiary)", padding: "12px 10px", border: "1px solid var(--surface-border)",
                display: "flex", flexDirection: "column", gap: 4, borderRadius: 2
              }}>
                <div style={{ fontSize: 18 }}>{r.icon}</div>
                <div>
                  <div style={{ fontSize: 8, fontWeight: 900, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{r.label}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-primary)" }}>
                    {r.item ? `${Math.round(Math.abs(seat.x - r.item.x))}m ${getDir(r.item.x)}` : "Across Concourse"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Emergency Section */}
          <div style={{
            background: "#0D0D0D", border: "1px solid #FF414133",
            borderLeft: "4px solid #FF4141", padding: "16px", position: "relative"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 18, height: 18, background: "#FF4141", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900 }}>!</div>
              <div style={{ fontSize: 10, fontWeight: 900, color: "#FF4141", textTransform: "uppercase", letterSpacing: "0.2em" }}>Emergency Protocol</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: 8, color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: 2 }}>Primary Evacuation Path</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: "#fff", letterSpacing: "0.05em" }}>
                    {nStair.name} → {nFe?.label || "GATE A"}
                  </div>
                </div>
                <div style={{ fontSize: 9, fontWeight: 900, color: "#FF4141", background: "rgba(255, 65, 65, 0.1)", padding: "2px 6px" }}>
                  {getDir(nStair.x).toUpperCase()}
                </div>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 10, color: "var(--text-secondary)", lineHeight: 1.5, display: "flex", flexDirection: "column", gap: 4 }}>
                <li>Leave all belongings behind immediately.</li>
                <li>Stay low if smoke is present.</li>
                <li>Follow stadium steward instructions.</li>
                <li><strong>DO NOT</strong> use lifts; proceed to stairwell.</li>
              </ul>
            </div>
          </div>

          {/* Main Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 24 }}>
            <button
              onClick={onContinue}
              style={{
                width: "100%", padding: "16px", background: "#29CC7A", color: "#000",
                border: "none", fontWeight: 900, fontSize: 12, textTransform: "uppercase",
                cursor: "pointer", boxShadow: "6px 6px 0 rgba(41, 204, 122, 0.2)",
                letterSpacing: "0.05em"
              }}
            >
              Confirm Selection & Plan Flow →
            </button>
            <button
              onClick={onClose}
              style={{
                width: "100%", padding: "10px", background: "none", border: "1px solid var(--surface-border)",
                color: "var(--text-tertiary)", fontWeight: 700, fontSize: 10, textTransform: "uppercase",
                cursor: "pointer"
              }}
            >
              Back to Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StadiumMap() {
  return (
    <Suspense fallback={null}>
      <MapPageInner />
    </Suspense>
  );
}