import React, { Suspense } from "react";
import Header from "../../components/Header";

const exits = [
  {
    gate: "GATE C",
    name: "WEST WING",
    time: "5",
    densityPercent: "20%",
    statusColor: "var(--accent-green)",
    recommended: true,
  },
  {
    gate: "GATE B",
    name: "EAST WING",
    time: "10",
    densityPercent: "50%",
    statusColor: "var(--status-moderate)",
    recommended: false,
  },
  {
    gate: "GATE A",
    name: "NORTH WING",
    time: "15",
    densityPercent: "85%",
    statusColor: "var(--accent-red)",
    recommended: false,
  },
];

function ExitPageInner() {
  return (
    <div>
      <Header />
      <div className="headline-2 mb-8" style={{ textTransform: 'uppercase' }}>Find Best Exit</div>
      <p className="body text-secondary mb-24">
        Real-time crowd analysis for the fastest way out.
      </p>

      <div className="grid-responsive-3">
        {exits.map((exit, index) => (
          <div
            key={exit.gate}
            className={`card flex-col justify-between gap-12 ${exit.recommended ? "card-highlight" : ""}`}
            style={{ position: 'relative' }}
          >
            {exit.recommended && (
              <div className="badge badge-green" style={{ position: 'absolute', top: 0, right: 0 }}>
                RECOMMENDED
              </div>
            )}

            <div className="flex-row justify-between align-center mt-8">
              <div className="flex-col">
                <div className="caption text-tertiary mb-4">{exit.gate} — {exit.name}</div>
                <div className="flex-row gap-8" style={{ alignItems: 'baseline' }}>
                  <span className="display">{exit.time}</span>
                  <span className="body text-secondary">min</span>
                </div>
              </div>
            </div>

            <div className="flex-col gap-8 mt-8">
              <div className="flex-row justify-between mb-4">
                <span className="caption text-tertiary">CROWD DENSITY</span>
                <span className="caption" style={{ color: exit.statusColor }}>{exit.densityPercent}</span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={parseInt(exit.densityPercent)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Crowd density ${exit.densityPercent}`}
                style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-elevated)', borderRadius: 0 }}
              >
                <div
                  style={{
                    width: exit.densityPercent,
                    height: '100%',
                    backgroundColor: exit.statusColor,
                    borderRadius: 0
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Directional hint for recommended */}
      <div className="card mt-24" style={{ backgroundColor: 'rgba(213, 255, 92, 0.05)', borderColor: 'var(--accent-yellow)' }}>
        <div className="flex-row align-center gap-12">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-yellow)" strokeWidth="1.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="body text-primary">Head towards Section W3 → Gate C</span>
        </div>
      </div>

      {/* Wait suggestion */}
      <div className="card mt-12" style={{ backgroundColor: 'rgba(255, 184, 0, 0.05)', borderColor: 'rgba(255, 184, 0, 0.4)' }}>
        <div className="flex-row align-center gap-12">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--status-moderate)" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="body" style={{ color: 'var(--status-moderate)' }}>Wait 5 mins to reduce crowd further</span>
        </div>
      </div>
    </div>
  );
}

export default function ExitRecommendation() {
  return (
    <Suspense fallback={null}>
      <ExitPageInner />
    </Suspense>
  );
}
