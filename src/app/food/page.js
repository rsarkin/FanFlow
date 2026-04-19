"use client";
import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useRetail } from "../../context/RetailContext";
import Header from "../../components/Header";
import CheckoutModal from "../../components/CheckoutModal";

const menuItems = [
  { id: 11, name: "Gourmet Burger", price: 340, emoji: "🍔", type: "pickup", stall: "Buns & Co" },
  { id: 12, name: "Margherita Pizza", price: 420, emoji: "🍕", type: "pickup", stall: "Wood Fire" },
  { id: 13, name: "Artisanal Water", price: 90, emoji: "💧", type: "pickup", stall: "Hydrate" },
  { id: 14, name: "Loaded Nachos", price: 280, emoji: "🌮", type: "seat", stall: "MexiGrill" },
  { id: 15, name: "Iced Americano", price: 190, emoji: "☕", type: "seat", stall: "Brew Bar" },
];

function FoodOrderingInner() {
  const router = useRouter();
  const { addOrder, selectedSeats } = useRetail();
  const [errorMsg, setErrorMsg] = useState("");
  const [checkoutItem, setCheckoutItem] = useState(null);

  const handleOrder = (item) => {
    if (item.type === "seat" && selectedSeats.length === 0) {
      setErrorMsg("Please select your seat on the map first to enable in-seat delivery.");
      setTimeout(() => setErrorMsg(""), 4000);
      return;
    }
    setCheckoutItem(item);
  };

  const handleFinalConfirm = (payMode) => {
    const finalOrder = {
      ...checkoutItem,
      id: `FOOD-${Math.floor(Math.random() * 9000) + 1000}`,
      status: "active",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      qrVal: `FANFLOW-FOOD-${Date.now()}`,
      eta: "5-10 mins",
      paymentMode: payMode,
      seats: checkoutItem.type === "seat" ? selectedSeats : []
    };

    addOrder(finalOrder);
    setCheckoutItem(null);
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      <Header />
      
      <div style={{ padding: "20px 0" }}>
        <h1 style={{ fontFamily: "var(--font-serif-main)", fontSize: 32, color: "var(--text-primary)", marginBottom: 8 }}>Matchday Fuel</h1>
        <p style={{ fontFamily: "var(--font-sans-main)", fontSize: 13, color: "var(--text-secondary)", marginBottom: 32 }}>Skip the queue. Pre-order and collect or get it delivered to your seat.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {menuItems.map((item) => (
            <div key={item.id} style={{ 
              background: "var(--bg-secondary)", 
              border: "1px solid var(--surface-border)", 
              padding: "20px",
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              boxShadow: "4px 4px 0 rgba(0,0,0,0.2)"
            }}>
              <div>
                <div style={{ fontSize: 11, color: item.type === "seat" ? "var(--accent-yellow)" : "var(--accent-cyan)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                  {item.type === "seat" ? "💺 Seat Delivery" : "🎯 Stall Pickup"}
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>
                  {item.emoji} {item.name}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{item.stall} · ₹{item.price}</div>
              </div>
              <button 
                onClick={() => handleOrder(item)}
                style={{ 
                  background: "var(--text-primary)", 
                  color: "var(--bg-primary)", 
                  border: "none", 
                  padding: "10px 20px", 
                  fontWeight: 900, 
                  fontSize: 12, 
                  textTransform: "uppercase", 
                  cursor: "pointer",
                  boxShadow: "3px 3px 0 var(--accent-yellow)"
                }}
              >
                Order
              </button>
            </div>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div style={{ 
          position: "fixed", bottom: 100, left: 20, right: 20, 
          background: "var(--bg-secondary)", color: "#fff", padding: "24px", 
          fontFamily: "var(--font-sans-main)", zIndex: 3000, 
          boxShadow: "10px 10px 0 #FF4141",
          border: "1px solid #FF4141"
        }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: "#FF4141", marginBottom: 8, textTransform: "uppercase" }}>⚠️ Seats Required</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 20, lineHeight: 1.5 }}>
            {errorMsg}
          </div>
          <button 
            onClick={() => router.push('/map?tab=map&ref=order_reminder')}
            style={{ 
              width: "100%", padding: "14px", background: "#FF4141", color: "#fff", 
              border: "none", fontWeight: 900, fontSize: 12, textTransform: "uppercase",
              boxShadow: "4px 4px 0 rgba(0,0,0,0.3)", cursor: "pointer"
            }}
          >
            Go to Stadium Map
          </button>
        </div>
      )}
      <CheckoutModal 
        item={checkoutItem}
        onClose={() => setCheckoutItem(null)}
        onConfirm={handleFinalConfirm}
      />
    </div>
  );
}

export default function FoodOrdering() {
  return (
    <Suspense fallback={null}>
      <FoodOrderingInner />
    </Suspense>
  );
}
