"use client";

import Link from "next/link";
import { useState } from "react";

/* ─────────────────────────────────────────────────────────────────
   MINI SVG ILLUSTRATIONS
───────────────────────────────────────────────────────────────── */

function StadiumHeroArt() {
  return (
    <svg viewBox="0 0 360 180" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto", display: "block" }}>
      {/* Stars / ambient */}
      {[[30,20],[80,12],[140,8],[220,14],[290,10],[340,22],[20,50],[350,44]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={i%2===0?1:0.7} fill="#FFFFFF" opacity="0.3" />
      ))}
      {/* Ground gradient base */}
      <ellipse cx="180" cy="130" rx="160" ry="78" fill="#111" stroke="#2E2E2E" strokeWidth="1.5"/>
      {/* Pitch emerald */}
      <ellipse cx="180" cy="130" rx="116" ry="54" fill="#0C2B18" stroke="#29CC7A" strokeWidth="1"/>
      {/* Inner pitch strip */}
      <rect x="164" y="110" width="32" height="40" rx="0" fill="#0A3D1A" stroke="#29CC7A" strokeWidth="0.6"/>
      {/* Crease lines */}
      <line x1="164" y1="120" x2="196" y2="120" stroke="#D5FF5C" strokeWidth="0.5" opacity="0.5"/>
      <line x1="164" y1="140" x2="196" y2="140" stroke="#D5FF5C" strokeWidth="0.5" opacity="0.5"/>
      {/* Stumps */}
      {[174,180,186].map(x=>(
        <line key={x} x1={x} y1="109" x2={x} y2="120" stroke="#FFFFFF" strokeWidth="1.2"/>
      ))}
      {[174,180,186].map(x=>(
        <line key={`b${x}`} x1={x} y1="140" x2={x} y2="151" stroke="#FFFFFF" strokeWidth="1.2"/>
      ))}
      {/* Bails */}
      <line x1="173" y1="109" x2="187" y2="109" stroke="#FFB800" strokeWidth="1.5"/>
      <line x1="173" y1="151" x2="187" y2="151" stroke="#FFB800" strokeWidth="1.5"/>
      {/* Crowd dots — N tiers */}
      {[155,168,181,194,207].map((x,i)=>(
        <circle key={`cn${i}`} cx={x} cy={75+(i%2)*5} r="2.8" fill={["#D5FF5C","#0EFFE4","#FF4141","#29CC7A","#D5FF5C"][i]} opacity="0.75"/>
      ))}
      {[140,158,176,194,212,228].map((x,i)=>(
        <circle key={`cn2${i}`} cx={x} cy={84+(i%2)*4} r="2.2" fill="#FFFFFF" opacity="0.25"/>
      ))}
      {/* Crowd dots — S tiers */}
      {[155,168,181,194,207].map((x,i)=>(
        <circle key={`cs${i}`} cx={x} cy={185-(i%2)*5} r="2.8" fill={["#0EFFE4","#D5FF5C","#29CC7A","#FF4141","#0EFFE4"][i]} opacity="0.7"/>
      ))}
      {/* Crowd dots — E tiers */}
      {[95,100,105].map((x,i)=>(
        <circle key={`ce${i}`} cx={x} cy={118+(i*10)} r="2.5" fill="#D5FF5C" opacity="0.6"/>
      ))}
      {/* Crowd dots — W tiers */}
      {[265,270,275].map((x,i)=>(
        <circle key={`cw${i}`} cx={x} cy={118+(i*10)} r="2.5" fill="#0EFFE4" opacity="0.6"/>
      ))}
      {/* Floodlight towers */}
      {[42,318].map((x,i)=>(
        <g key={`fl${i}`}>
          <rect x={x-2} y="38" width="4" height="42" fill="#2E2E2E"/>
          <rect x={x-12} y="34" width="24" height="7" rx="0" fill="#1C1C1C" stroke="#2E2E2E" strokeWidth="1"/>
          {/* Light beams */}
          {[-8,-3,2,7].map((dx,j)=>(
            <line key={j} x1={x+dx} y1="38" x2={x+dx*4} y2="80" stroke="#D5FF5C" strokeWidth="0.4" opacity="0.15"/>
          ))}
          <rect x={x-10} y="36" width="20" height="4" fill="#D5FF5C" opacity="0.6"/>
        </g>
      ))}
      {/* Score ribbon */}
      <rect x="110" y="4" width="140" height="32" fill="#0D0D0D" stroke="#2E2E2E"/>
      <rect x="110" y="4" width="140" height="2" fill="var(--accent-cyan, #0EFFE4)"/>
      <text x="180" y="18" textAnchor="middle" fill="#AAAAAA" fontSize="8" fontFamily="monospace" letterSpacing="1.5">IND vs AUS</text>
      <text x="180" y="30" textAnchor="middle" fill="#0EFFE4" fontSize="11" fontWeight="700" fontFamily="monospace">152/3 • 16.2 OV</text>
      {/* Live dot */}
      <circle cx="118" cy="20" r="3.5" fill="#29CC7A" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.3s" repeatCount="indefinite"/>
        <animate attributeName="r" values="3.5;5;3.5" dur="1.3s" repeatCount="indefinite"/>
      </circle>
      {/* User position pin */}
      <circle cx="200" cy="105" r="5" fill="#D5FF5C" stroke="#0D0D0D" strokeWidth="1.5">
        <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
      </circle>
      <line x1="200" y1="100" x2="200" y2="95" stroke="#D5FF5C" strokeWidth="1.5"/>
      <text x="200" y="92" textAnchor="middle" fill="#D5FF5C" fontSize="7" fontFamily="monospace">YOU</text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────
   HOW IT WORKS — 3 steps
───────────────────────────────────────────────────────────────── */
const HOW_STEPS = [
  {
    num: "01",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    title: "Pick Your Venue",
    body: "Choose from any FanFlow-enabled stadium near you.",
    accent: "#0EFFE4",
  },
  {
    num: "02",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <rect x="3" y="3" width="18" height="18"/><path d="M3 9h18M9 21V9"/>
      </svg>
    ),
    title: "Get Your Smart Pass",
    body: "FanFlow maps your seat, food stalls, and exit routes instantly.",
    accent: "#D5FF5C",
  },
  {
    num: "03",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    title: "Enjoy the Match",
    body: "Order food, navigate live, and exit smart — all without standing up.",
    accent: "#29CC7A",
  },
];

/* ─────────────────────────────────────────────────────────────────
   VENUE DATA
───────────────────────────────────────────────────────────────── */
const VENUES = [
  {
    id: "wankhede",
    name: "Wankhede Stadium",
    city: "Mumbai, India",
    capacity: "33,108",
    status: "live",
    statusLabel: "Match Live",
    accent: "#29CC7A",
    tags: ["ICC Partner", "T20 Capable"],
    image: "https://images.unsplash.com/photo-1540744158913-91185590c6ca?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "eden",
    name: "Eden Gardens",
    city: "Kolkata, India",
    capacity: "66,000",
    status: "upcoming",
    statusLabel: "Tomorrow 7 PM",
    accent: "#0EFFE4",
    tags: ["Largest in India", "T20I Venue"],
    image: "https://images.unsplash.com/photo-1540744158913-91185590c6ca?q=80&w=800&auto=format&fit=crop",
  },
];

const EXTRA_VENUES = [
  {
    id: "narendra-modi",
    name: "Narendra Modi Stadium",
    city: "Ahmedabad, India",
    capacity: "1,32,000",
    status: "upcoming",
    statusLabel: "Apr 24",
    accent: "#D5FF5C",
    tags: ["World's Largest", "Day-Night"],
    image: "https://images.unsplash.com/photo-1540744158913-91185590c6ca?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "chepauk",
    name: "M.A. Chidambaram Stadium",
    city: "Chennai, India",
    capacity: "50,000",
    status: "upcoming",
    statusLabel: "Apr 28",
    accent: "#FF4141",
    tags: ["Historic Ground", "Test Venue"],
    image: "https://images.unsplash.com/photo-1540744158913-91185590c6ca?q=80&w=800&auto=format&fit=crop",
  },
];

/* ─────────────────────────────────────────────────────────────────
   UPCOMING MATCHES
───────────────────────────────────────────────────────────────── */
const MATCHES = [
  {
    id: 1,
    tournament: "ICC World Cup 2026",
    team1: { code: "IND", name: "India", color: "#0EFFE4" },
    team2: { code: "AUS", name: "Australia", color: "#FFB800" },
    date: "Today",
    time: "7:30 PM",
    venue: "Wankhede",
    format: "ODI",
    status: "live",
  },
  {
    id: 2,
    tournament: "IPL 2026",
    team1: { code: "MI", name: "Mumbai Indians", color: "#004BA0" },
    team2: { code: "CSK", name: "Chennai Super Kings", color: "#FDB913" },
    date: "Tomorrow",
    time: "8:00 PM",
    venue: "Eden Gardens",
    format: "T20",
    status: "upcoming",
  },
  {
    id: 3,
    tournament: "ICC World Cup 2026",
    team1: { code: "ENG", name: "England", color: "#CF081F" },
    team2: { code: "NZ", name: "New Zealand", color: "#000000" },
    date: "Apr 20",
    time: "3:00 PM",
    venue: "Chepauk",
    format: "ODI",
    status: "upcoming",
  },
  {
    id: 4,
    tournament: "IPL 2026",
    team1: { code: "RCB", name: "Royal Challengers", color: "#CF081F" },
    team2: { code: "KKR", name: "Kolkata Knight Riders", color: "#6C2FA7" },
    date: "Apr 22",
    time: "7:30 PM",
    venue: "Narendra Modi",
    format: "T20",
    status: "upcoming",
  },
];

/* ─────────────────────────────────────────────────────────────────
   VENUE CARD (horizontal with image header)
───────────────────────────────────────────────────────────────── */
function VenueCard({ venue }) {
  return (
    <div
      id={`venue-${venue.id}`}
      style={{
        background: "var(--bg-secondary)",
        border: `1px solid var(--surface-border)`,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Image header */}
      <div style={{ position: "relative", height: 140, overflow: "hidden" }}>
        <img
          src={venue.image}
          alt={venue.name}
          style={{
            width: "100%", height: "100%",
            objectFit: "cover",
            display: "block",
            filter: "brightness(0.75)",
          }}
        />
        {/* Gradient scrim */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.7) 100%)",
        }} />
        {/* Accent top bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: venue.accent,
        }} />
        {/* Status badge overlaid on image */}
        <div style={{
          position: "absolute", top: 12, right: 12,
          display: "inline-flex", alignItems: "center", gap: 5,
          background: venue.status === "live" ? "rgba(40,40,40,0.9)" : "rgba(0,0,0,0.65)",
          border: `1px solid ${venue.status === "live" ? "rgba(255,65,65,0.5)" : "rgba(255,255,255,0.15)"}`,
          color: venue.status === "live" ? "var(--accent-red)" : "var(--text-secondary)",
          fontSize: 9, fontWeight: 700, padding: "4px 8px",
          textTransform: "uppercase", letterSpacing: "0.08em",
          fontFamily: "var(--font-sans-main)",
          backdropFilter: "blur(4px)",
        }}>
          {venue.status === "live" && (
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent-red)", display: "inline-block", animation: "pulseLive 1.2s infinite" }} />
          )}
          {venue.statusLabel}
        </div>
        {/* Name overlaid bottom of image */}
        <div style={{
          position: "absolute", bottom: 10, left: 14,
          fontFamily: "var(--font-serif-main)", fontSize: 17, fontWeight: 700,
          color: "#FFFFFF", lineHeight: 1.2,
          textShadow: "0 1px 4px rgba(0,0,0,0.8)",
        }}>{venue.name}</div>
      </div>

      {/* Info panel */}
      <div style={{ padding: "12px 14px 14px" }}>
        {/* City + capacity */}
        <div style={{
          fontSize: 11, color: "var(--text-tertiary)",
          fontFamily: "var(--font-sans-main)", marginBottom: 10,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/>
          </svg>
          {venue.city}
          <span style={{ color: "var(--surface-border)" }}>·</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          Cap. {venue.capacity}
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
          {venue.tags.map(t => (
            <span key={t} style={{
              fontSize: 9, padding: "2px 6px",
              border: `1px solid ${venue.accent}44`,
              color: venue.accent,
              fontFamily: "var(--font-sans-main)",
              textTransform: "uppercase", letterSpacing: "0.05em",
            }}>{t}</span>
          ))}
        </div>

        {/* CTA row — two buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/map?tab=commute" className="btn-venue-commute" style={{
            flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5,
            background: venue.accent, color: "#0D0D0D",
            padding: "7px 10px", fontSize: 10, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.07em",
            fontFamily: "var(--font-sans-main)",
            textDecoration: "none",
            boxShadow: `2px 2px 0 rgba(0,0,0,0.3)`,
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
            Commute
          </Link>
          <Link href="/map" className="btn-venue-explore" style={{
            flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5,
            background: "transparent", color: venue.accent,
            border: `1px solid ${venue.accent}66`,
            padding: "7px 10px", fontSize: 10, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.07em",
            fontFamily: "var(--font-sans-main)",
            textDecoration: "none",
          }}>
            Explore Venue
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}


/* ─────────────────────────────────────────────────────────────────
   MATCH CARD
───────────────────────────────────────────────────────────────── */
function MatchCard({ match }) {
  const isLive = match.status === "live";
  return (
    <div
      id={`match-${match.id}`}
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--surface-border)",
        borderTop: isLive ? "3px solid var(--accent-green)" : "3px solid var(--surface-border)",
        padding: "14px 16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow for live */}
      {isLive && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 60,
          background: "radial-gradient(ellipse at 50% 0%, rgba(41,204,122,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
      )}

      {/* Tournament + format row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{
          fontSize: 9, fontWeight: 600, color: "var(--text-tertiary)",
          textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "var(--font-sans-main)",
        }}>{match.tournament}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{
            fontSize: 9, padding: "2px 7px",
            border: "1px solid var(--surface-border)",
            color: "var(--text-tertiary)",
            fontFamily: "var(--font-mono-main)",
            letterSpacing: "0.06em",
          }}>{match.format}</span>
          {isLive && (
            <span style={{
              display: "flex", alignItems: "center", gap: 4,
              fontSize: 9, fontWeight: 700, color: "var(--accent-red)",
              textTransform: "uppercase", letterSpacing: "0.1em",
              fontFamily: "var(--font-sans-main)",
              background: "#2A2A2A",
              border: "1px solid rgba(255,65,65,0.3)",
              padding: "3px 7px",
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent-red)", display: "inline-block", animation: "pulseLive 1.2s infinite" }}/>
              Live
            </span>
          )}
        </div>
      </div>

      {/* Teams matchup */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        {/* Team 1 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 }}>
          <div style={{
            width: 38, height: 38,
            background: `${match.team1.color}22`,
            border: `2px solid ${match.team1.color}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontFamily: "var(--font-mono-main)", fontSize: 10, fontWeight: 700, color: match.team1.color, letterSpacing: "0.04em" }}>
              {match.team1.code}
            </span>
          </div>
          <span style={{ fontSize: 10, color: "var(--text-secondary)", fontFamily: "var(--font-sans-main)" }}>
            {match.team1.name.split(" ")[0]}
          </span>
        </div>

        {/* VS divider */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <span style={{
            fontFamily: "var(--font-serif-main)", fontSize: 18, fontWeight: 700,
            color: "var(--text-tertiary)", lineHeight: 1,
          }}>vs</span>
          {isLive ? (
            <span style={{ fontFamily: "var(--font-mono-main)", fontSize: 9, color: "var(--accent-cyan)", letterSpacing: "0.06em" }}>
              152/3 • 16.2
            </span>
          ) : (
            <span style={{ fontFamily: "var(--font-mono-main)", fontSize: 9, color: "var(--text-tertiary)" }}>
              —
            </span>
          )}
        </div>

        {/* Team 2 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 }}>
          <div style={{
            width: 38, height: 38,
            background: `${match.team2.color}22`,
            border: `2px solid ${match.team2.color}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontFamily: "var(--font-mono-main)", fontSize: 10, fontWeight: 700, color: match.team2.color === "#000000" ? "#FFFFFF" : match.team2.color, letterSpacing: "0.04em" }}>
              {match.team2.code}
            </span>
          </div>
          <span style={{ fontSize: 10, color: "var(--text-secondary)", fontFamily: "var(--font-sans-main)" }}>
            {match.team2.name.split(" ")[0]}
          </span>
        </div>
      </div>

      {/* Footer info strip */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingTop: 10, borderTop: "1px solid var(--surface-border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
          </svg>
          <span style={{ fontSize: 10, color: "var(--text-tertiary)", fontFamily: "var(--font-sans-main)" }}>
            {match.date} · {match.time}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5">
            <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/>
          </svg>
          <span style={{ fontSize: 10, color: "var(--text-tertiary)", fontFamily: "var(--font-sans-main)" }}>
            {match.venue}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SECTION LABEL
───────────────────────────────────────────────────────────────── */
function SectionLabel({ children, accent = "var(--text-tertiary)" }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, marginBottom: 14,
    }}>
      <span style={{ display: "block", width: 16, height: 2, background: accent, flexShrink: 0 }} />
      <span style={{
        fontFamily: "var(--font-sans-main)", fontSize: 11, fontWeight: 600,
        color: accent, textTransform: "uppercase", letterSpacing: "0.1em",
      }}>{children}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────── */
export default function Home() {
  const [venueExpanded, setVenueExpanded] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div>

      {/* ══════════════════════════════════════════
          1. HERO — FanFlow Brand
      ══════════════════════════════════════════ */}
      <section id="hero" style={{ marginBottom: 36 }}>
        {/* Wordmark */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{
              fontFamily: "var(--font-mono-main)", fontSize: 10, color: "var(--accent-cyan)",
              letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6,
            }}>
              ◉ Smart Stadium App
            </div>
            <h1 style={{
              fontFamily: "var(--font-serif-main)", fontWeight: 700,
              fontSize: "clamp(30px, 8vw, 46px)", lineHeight: 1.05,
              color: "var(--text-primary)", margin: 0,
            }}>
              Fan<span style={{ color: "var(--accent-yellow)" }}>Flow</span>
            </h1>
          </div>
          <button
            aria-label="Notifications"
            style={{
              width: 40, height: 40, background: "var(--bg-tertiary)",
              border: "1px solid var(--surface-border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-secondary)", cursor: "pointer", marginTop: 6,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
            </svg>
          </button>
        </div>

        {/* Tagline */}
        <p style={{
          fontFamily: "var(--font-sans-main)", fontSize: 15, lineHeight: 1.6,
          color: "var(--text-secondary)", maxWidth: 340, marginBottom: 20,
        }}>
          Your entire matchday — <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>navigate, order, and exit</span> — all from one smart stadium companion.
        </p>


      </section>

      {/* ══════════════════════════════════════════
          2. ABOUT — What is FanFlow
      ══════════════════════════════════════════ */}
      <section id="about-fanflow" style={{ marginBottom: 36 }}>
        <SectionLabel accent="var(--accent-cyan)">What is FanFlow</SectionLabel>
        <div style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--surface-border)",
          borderLeft: "3px solid var(--accent-cyan)",
          padding: "18px 18px 18px 20px",
          marginBottom: 14,
        }}>
          <h2 style={{
            fontFamily: "var(--font-serif-main)", fontSize: 20, fontWeight: 700,
            color: "var(--text-primary)", lineHeight: 1.2, marginBottom: 10,
          }}>
            The stadium experience,<br />
            <span style={{ color: "var(--accent-cyan)" }}>finally smart.</span>
          </h2>
          <p style={{
            fontFamily: "var(--font-sans-main)", fontSize: 13, lineHeight: 1.65,
            color: "var(--text-secondary)",
          }}>
            FanFlow is a real-time stadium companion that connects fans to everything happening inside the ground — from live scores and seat navigation to queue-free food ordering and AI-powered exit routes. No more getting lost. No more missing goals.
          </p>
        </div>

        {/* HOW IT WORKS — 3 steps inline */}
        <SectionLabel>How it works</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {HOW_STEPS.map((step, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 14,
              background: "var(--bg-secondary)",
              border: "1px solid var(--surface-border)",
              padding: "14px 16px",
              position: "relative",
            }}>
              {/* Step number */}
              <div style={{
                fontFamily: "var(--font-mono-main)", fontSize: 11, fontWeight: 700,
                color: step.accent, letterSpacing: "0.04em", marginTop: 2, flexShrink: 0,
              }}>{step.num}</div>
              {/* Icon */}
              <div style={{
                width: 36, height: 36, minWidth: 36,
                background: `${step.accent}14`,
                border: `1px solid ${step.accent}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: step.accent, flexShrink: 0,
              }}>
                {step.icon}
              </div>
              {/* Text */}
              <div>
                <div style={{
                  fontFamily: "var(--font-sans-main)", fontSize: 14, fontWeight: 600,
                  color: "var(--text-primary)", marginBottom: 3,
                }}>{step.title}</div>
                <div style={{
                  fontFamily: "var(--font-sans-main)", fontSize: 12,
                  color: "var(--text-secondary)", lineHeight: 1.5,
                }}>{step.body}</div>
              </div>
              {/* Connector */}
              {i < HOW_STEPS.length - 1 && (
                <div style={{
                  position: "absolute", bottom: -8, left: 39,
                  width: 1, height: 8,
                  background: "var(--surface-border)",
                  zIndex: 1,
                }} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3. VENUES
      ══════════════════════════════════════════ */}
      <section id="venues" style={{ marginBottom: 36 }}>
        <SectionLabel accent="var(--accent-yellow)">Venues</SectionLabel>

        {/* 2 main venue cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
          {VENUES.map(v => <VenueCard key={v.id} venue={v} />)}
        </div>

        {/* Extra venues — animated reveal */}
        <div style={{
          maxHeight: venueExpanded ? "1200px" : "0px",
          overflow: "hidden",
          opacity: venueExpanded ? 1 : 0,
          transform: venueExpanded ? "translateY(0)" : "translateY(-12px)",
          transition: "max-height 1.2s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.8s ease, transform 0.8s cubic-bezier(0.19, 1, 0.22, 1)",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 8 }}>
            {EXTRA_VENUES.map((v, i) => (
              <div
                key={v.id}
                style={{
                  opacity: venueExpanded ? 1 : 0,
                  transform: venueExpanded ? "translateY(0)" : "translateY(12px)",
                  transition: `opacity 0.5s ease ${0.15 + i * 0.12}s, transform 0.5s ease ${0.15 + i * 0.12}s`,
                }}
              >
                <VenueCard venue={v} />
              </div>
            ))}
          </div>
        </div>

        {/* Explore More toggle */}
        <button
          id="explore-more-btn"
          onClick={() => setVenueExpanded(p => !p)}
          aria-expanded={venueExpanded}
          style={{
            width: "100%", marginTop: 10,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: "transparent",
            border: "1px solid var(--surface-border)",
            color: "var(--text-secondary)",
            padding: "12px",
            fontFamily: "var(--font-sans-main)", fontSize: 11, fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.1em",
            cursor: "pointer", transition: "border-color 0.15s, color 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent-yellow)"; e.currentTarget.style.color = "var(--accent-yellow)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--surface-border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
        >
          {venueExpanded ? "Show Less" : "Explore More Venues"}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ transform: venueExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}>
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
      </section>

      {/* ══════════════════════════════════════════
          4. UPCOMING SPORTING EVENTS
      ══════════════════════════════════════════ */}
      <section id="upcoming-events" style={{ marginBottom: 32 }}>
        {/* Filtered match list */}
        {(() => {
          const filtered = activeFilter === "All"
            ? MATCHES
            : MATCHES.filter(m => m.format === activeFilter);
          return (
            <>
              {/* Section header row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <SectionLabel accent="var(--accent-green)">Upcoming Events</SectionLabel>
                <span style={{
                  fontFamily: "var(--font-mono-main)", fontSize: 9, color: "var(--text-tertiary)",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                }}>{filtered.length} Match{filtered.length !== 1 ? "es" : ""}</span>
              </div>

              {/* Filter pills */}
              <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", paddingBottom: 2 }}>
                {["All", "ODI", "T20", "Test"].map(f => {
                  const isActive = activeFilter === f;
                  return (
                    <button
                      key={f}
                      id={`filter-${f.toLowerCase()}`}
                      onClick={() => setActiveFilter(f)}
                      style={{
                        padding: "5px 12px",
                        background: isActive ? "var(--accent-yellow)" : "transparent",
                        border: isActive ? "1px solid var(--accent-yellow)" : "1px solid var(--surface-border)",
                        color: isActive ? "#0D0D0D" : "var(--text-tertiary)",
                        fontFamily: "var(--font-sans-main)", fontSize: 10, fontWeight: 600,
                        textTransform: "uppercase", letterSpacing: "0.08em",
                        cursor: "pointer", flexShrink: 0,
                        transition: "background 0.12s, color 0.12s, border-color 0.12s",
                      }}
                    >{f}</button>
                  );
                })}
              </div>

              {/* Match cards grid */}
              {filtered.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                  {filtered.map(m => <MatchCard key={m.id} match={m} />)}
                </div>
              ) : (
                <div style={{
                  border: "1px solid var(--surface-border)",
                  padding: "32px 16px",
                  textAlign: "center",
                  color: "var(--text-tertiary)",
                  fontFamily: "var(--font-sans-main)",
                  fontSize: 12,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}>
                  No {activeFilter} matches scheduled
                </div>
              )}
            </>
          );
        })()}
      </section>

      {/* pulse keyframe injected inline */}
      <style>{`
        @keyframes pulseLive {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
