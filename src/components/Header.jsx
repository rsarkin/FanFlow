"use client";

import { Bell, ShoppingBag } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useRetail } from '../context/RetailContext';

export default function Header() {
  const searchParams = useSearchParams();
  const { orderHistory, toggleHistory, notifications, toggleNotifications } = useRetail();
  const basketCount = orderHistory.filter(o => o.status === "active").length;
  const unreadCount = notifications.filter(n => n.unread).length;
  const activeParking = orderHistory.find(o => o.type === "parking" && o.status === "active");
  const isCommuteTab = searchParams.get("tab") === "commute";

  return (
    <>
      {activeParking && isCommuteTab && (
        <div style={{
          background: "var(--accent-cyan)", color: "#000", padding: "10px 16px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontFamily: "var(--font-sans-main)", position: "sticky", top: 0, zIndex: 1100,
          borderBottom: "2px solid #000", animation: "slideDown 0.4s ease-out"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 16 }}>🅿️</div>
            <div>
              <div style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.8 }}>Allocated Parking</div>
              <div style={{ fontSize: 12, fontWeight: 900 }}>BEAM {activeParking.beam} · SPOT {activeParking.space}</div>
            </div>
          </div>
          <button 
            onClick={() => toggleHistory(true)}
            style={{ background: "#000", color: "var(--accent-cyan)", border: "none", padding: "6px 10px", fontSize: 9, fontWeight: 900, textTransform: "uppercase" }}
          >
            Details
          </button>
        </div>
      )}
      <header className="screen-header justify-between w-full">
      <h1 className="headline-2">FANFLOW</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button 
          onClick={() => toggleHistory(true)} 
          aria-label="Order Basket" 
          style={{ position: "relative", background: "none", border: "none", color: "white", padding: 0 }}
        >
          <ShoppingBag size={24} stroke="currentColor" strokeWidth={1.5} />
          {basketCount > 0 && (
            <div style={{
              position: "absolute", top: -6, right: -6, background: "var(--accent-red)",
              color: "#fff", fontSize: 9, fontWeight: 900, width: 16, height: 16,
              borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              border: "1.5px solid var(--bg-primary)"
            }}>
              {basketCount}
            </div>
          )}
        </button>
        <button 
          onClick={() => toggleNotifications()}
          aria-label="Notifications" 
          style={{ position: "relative", background: "none", border: "none", color: "white", padding: 0 }}
        >
          <Bell size={24} stroke="currentColor" strokeWidth={1.5} />
          {unreadCount > 0 && (
            <div style={{
              position: "absolute", top: -6, right: -6, background: "var(--accent-red)",
              color: "#fff", fontSize: 9, fontWeight: 900, width: 16, height: 16,
              borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              border: "1.5px solid var(--bg-primary)"
            }}>
              {unreadCount}
            </div>
          )}
        </button>
      </div>
    </header>
    </>
  );
}
