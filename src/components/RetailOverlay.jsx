"use client";

import React from 'react';
import QRCode from "react-qr-code";
import { useRouter } from 'next/navigation';
import { useRetail } from '../context/RetailContext';

export default function RetailOverlay() {
  const router = useRouter();
  const { 
    orderHistory, 
    showHistory, 
    toggleHistory, 
    orderedItem, 
    setOrderedItem, 
    markAsReceived, 
    basketTab, 
    setBasketTab 
  } = useRetail();

  if (!showHistory && !orderedItem) return null;

  return (
    <>
      {/* Order Basket Modal */}
      {showHistory && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => toggleHistory(false)}>
          <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--surface-border)", width: "100%", maxWidth: 430, maxHeight: "85vh", display: "flex", flexDirection: "column", padding: "24px", boxShadow: "10px 10px 0 rgba(0,0,0,0.5)", borderRadius: 4 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <h2 style={{ fontFamily: "var(--font-serif-main)", fontSize: 24, fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>Order Basket</h2>
              </div>
              <button onClick={() => toggleHistory(false)} style={{ color: "var(--text-tertiary)", background: "none", border: "none" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>

            <div style={{ display: "flex", gap: 16, borderBottom: "1px solid var(--surface-border)", marginBottom: 20 }}>
              {[
                { id: "active", label: "Active" },
                { id: "history", label: "History" }
              ].map(t => (
                <button 
                  key={t.id} 
                  onClick={() => setBasketTab(t.id)}
                  style={{
                    padding: "10px 0", background: "none", border: "none",
                    borderBottom: basketTab === t.id ? "2px solid var(--accent-yellow)" : "2px solid transparent",
                    color: basketTab === t.id ? "var(--accent-yellow)" : "var(--text-tertiary)",
                    fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em"
                  }}
                >
                  {t.label} 
                  <span style={{ fontSize: 9, marginLeft: 4, background: basketTab === t.id ? "var(--accent-yellow)" : "var(--bg-tertiary)", color: basketTab === t.id ? "#000" : "var(--text-tertiary)", padding: "2px 5px", borderRadius: 10 }}>
                    {orderHistory.filter(o => o.status === (t.id === "active" ? "active" : "delivered")).length}
                  </span>
                </button>
              ))}
            </div>

            <div style={{ flex: 1, overflowY: "auto" }}>
              {(() => {
                const filtered = orderHistory.filter(o => o.status === (basketTab === "active" ? "active" : "delivered"));
                
                if (filtered.length === 0) {
                  return (
                    <div style={{ textAlign: "center", paddingTop: 80, color: "var(--text-tertiary)" }}>
                      <div style={{ fontSize: 40, marginBottom: 16 }}>{basketTab === "active" ? "🥡" : "📜"}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase" }}>
                        {basketTab === "active" ? "No active orders" : "No order history"}
                      </div>
                      <div style={{ fontSize: 11, marginTop: 4 }}>
                        {basketTab === "active" ? "Time to fuel up for the match!" : "Your past orders will appear here."}
                      </div>
                    </div>
                  );
                }

                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {filtered.map(order => (
                      <div key={order.id} style={{ background: "var(--bg-tertiary)", border: "1px solid var(--surface-border)", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: 11, color: "var(--text-tertiary)", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>{order.timestamp} · {order.id}</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: order.status === "delivered" ? "var(--text-tertiary)" : "var(--text-primary)" }}>{order.emoji} {order.name}</div>
                          {order.type === "seat" && order.seats && order.seats.length > 0 && (
                            <div style={{ fontSize: 9, color: "var(--accent-cyan)", fontWeight: 700, marginTop: 2 }}>
                              💺 {(() => {
                                const grouped = order.seats.reduce((acc, s) => {
                                  acc[s.row] = acc[s.row] || [];
                                  acc[s.row].push(s.seat);
                                  return acc;
                                }, {});
                                return Object.entries(grouped).map(([row, seats]) => 
                                  `R${row}: S${seats.join(", ")}`
                                ).join("; ");
                              })()}
                            </div>
                          )}
                          {order.type === "parking" && (
                            <div style={{ fontSize: 9, color: "var(--accent-cyan)", fontWeight: 700, marginTop: 2 }}>
                              🅿️ BEAM {order.beam} · SPOT {order.space}
                            </div>
                          )}
                          <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 2 }}>
                            <div style={{ fontSize: 10, color: order.status === "delivered" ? "var(--text-tertiary)" : "var(--accent-cyan)", fontWeight: 700, textTransform: "uppercase" }}>{order.type === "pickup" ? "🎯 Pickup" : order.type === "seat" ? "💺 Delivery" : order.type === "parking" ? "🅿️ Parking" : "📦 Merch"}</div>
                            <div style={{ fontSize: 10, color: "var(--text-tertiary)", fontWeight: 700 }}>⏱️ {order.eta}</div>
                          </div>
                        </div>
                        {order.status === "delivered" ? (
                          <div style={{ padding: "6px 12px", border: "1px solid var(--surface-border)", color: "var(--text-tertiary)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", background: "rgba(255,255,255,0.05)" }}>
                            ✅ Delivered
                          </div>
                        ) : (
                          <button 
                            onClick={() => setOrderedItem(order)}
                            style={{ padding: "8px 12px", background: "none", border: "1px solid var(--accent-yellow)", color: "var(--accent-yellow)", fontSize: 10, fontWeight: 900, textTransform: "uppercase" }}
                          >
                            Get QR
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
            
            <button 
              onClick={() => toggleHistory(false)}
              style={{ width: "100%", padding: "14px", background: "var(--text-primary)", color: "var(--bg-primary)", border: "none", fontWeight: 900, fontSize: 12, textTransform: "uppercase", marginTop: 20 }}
            >
              Close Basket
            </button>
          </div>
        </div>
      )}

      {/* QR Verification Modal */}
      {orderedItem && (
        <div 
          onClick={() => setOrderedItem(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)" }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--accent-yellow)", width: "340px", padding: "30px", textAlign: "center", boxShadow: "12px 12px 0 var(--accent-yellow)" }}
          >
            <div style={{ fontSize: 44, marginBottom: 16 }}>{orderedItem.emoji || "✅"}</div>
            <div style={{ fontFamily: "var(--font-serif-main)", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>Verify Collection</div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20, lineHeight: 1.4 }}>
              {orderedItem.name} {orderedItem.stall ? `from ${orderedItem.stall}` : ""}
              {orderedItem.type === "seat" && orderedItem.seats && orderedItem.seats.length > 0 && (
                <div style={{ color: "var(--accent-cyan)", fontWeight: 700, marginTop: 4 }}>
                  Delivering to: {(() => {
                    const grouped = orderedItem.seats.reduce((acc, s) => {
                      acc[s.row] = acc[s.row] || [];
                      acc[s.row].push(s.seat);
                      return acc;
                    }, {});
                    return Object.entries(grouped).map(([row, seats]) => 
                      `Row ${row}, Seat${seats.length > 1 ? 's' : ''} ${seats.join(", ")}`
                    ).join("; ");
                  })()}
                </div>
              )}
               {orderedItem.type === "parking" && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ color: "var(--accent-cyan)", fontWeight: 700, marginTop: 4 }}>
                    🅿️ ALLOTTED: BEAM {orderedItem.beam} · SPOT {orderedItem.space}
                  </div>
                </div>
              )}
            </div>

            <div style={{ background: "#000", padding: "16px", marginBottom: 20, border: "1px solid var(--surface-border)", width: "fit-content", margin: "0 auto 20px" }}>
              <QRCode
                value={orderedItem.qrVal}
                size={160}
                bgColor="#000000"
                fgColor="#FFFFFF"
              />
            </div>
            
            <div style={{ 
              background: "var(--bg-tertiary)", padding: "14px", border: "1px solid var(--surface-border)", 
              marginBottom: 24, textAlign: "left"
            }}>
              <div style={{ fontSize: 9, color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: 6 }}>Instruction</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-cyan)", marginBottom: 8 }}>
                {orderedItem.type === "parking" ? "SCAN QR WHILE EXITING" : "SCAN QR WHILE COLLECTING"}
              </div>
              <div style={{ fontSize: 9, color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: 4 }}>Mode</div>
              <div style={{ fontSize: 10, color: "var(--text-primary)", fontWeight: 700 }}>
                {orderedItem.paymentMode === "cod" ? "Cash on Delivery" : "Paid via Digital Wallet"}
              </div>
            </div>

            <button 
              onClick={() => {
                markAsReceived(orderedItem.id);
                setOrderedItem(null);
                toggleHistory(false);
                if (orderedItem.type === "parking") {
                  router.push("/map?tab=map");
                }
              }}
              style={{ width: "100%", padding: "14px", background: "var(--accent-yellow)", color: "#000", border: "none", fontWeight: 900, fontSize: 12, textTransform: "uppercase", marginBottom: 12, boxShadow: "4px 4px 0 rgba(0,0,0,0.3)" }}
            >
              {orderedItem.type === "parking" ? "Confirm" : "Order Received"}
            </button>

            {orderedItem.type !== "parking" && (
              <button 
                onClick={() => setOrderedItem(null)}
                style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.05)", color: "var(--text-primary)", border: "1px solid var(--surface-border)", fontWeight: 900, fontSize: 12, textTransform: "uppercase", marginBottom: 12, boxShadow: "4px 4px 0 rgba(0,0,0,0.2)" }}
              >
                Order Not Received
              </button>
            )}

            <button 
              onClick={() => setOrderedItem(null)}
              style={{ width: "100%", padding: "8px", background: "none", border: "none", color: "var(--text-tertiary)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}
            >
              Back to History
            </button>
          </div>
        </div>
      )}
    </>
  );
}
