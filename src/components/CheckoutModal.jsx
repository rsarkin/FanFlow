"use client";
import React, { useState } from 'react';
import { Wallet, Banknote } from 'lucide-react';

export default function CheckoutModal({ item, onClose, onConfirm }) {
  const [payMode, setPayMode] = useState('now'); // 'now' or 'cod'

  if (!item) return null;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ 
        background: "var(--bg-secondary)", 
        border: "1px solid var(--accent-yellow)", 
        width: "100%", 
        maxWidth: 400, 
        padding: "32px", 
        boxShadow: "12px 12px 0 rgba(0,0,0,0.5)",
        animation: "slideUp 0.3s ease-out"
      }}>
        
        <div style={{ fontSize: 10, color: "var(--accent-yellow)", fontWeight: 900, textTransform: "uppercase", marginBottom: 8, letterSpacing: "0.1em" }}>Order Checkout</div>
        <div style={{ fontFamily: "var(--font-serif-main)", fontSize: 24, fontWeight: 700, color: "var(--text-primary)", marginBottom: 20 }}>Confirm Your Order</div>

        {/* Order Info */}
        <div style={{ background: "var(--bg-tertiary)", padding: "16px", marginBottom: 24, border: "1px solid var(--surface-border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>{item.emoji} {item.name}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "var(--accent-yellow)" }}>₹{item.price}</div>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-tertiary)", textTransform: "uppercase", fontWeight: 700 }}>{item.stall || "Stall Selection"}</div>
        </div>

        {/* Payment Selection */}
        <div style={{ fontSize: 10, color: "var(--text-tertiary)", fontWeight: 900, textTransform: "uppercase", marginBottom: 12 }}>Select Payment Method</div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
          <button 
            onClick={() => setPayMode('now')}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "16px",
              background: payMode === 'now' ? "rgba(34, 211, 238, 0.1)" : "transparent",
              border: payMode === 'now' ? "2px solid var(--accent-cyan)" : "1px solid var(--surface-border)",
              color: payMode === 'now' ? "var(--accent-cyan)" : "var(--text-secondary)",
              textAlign: "left", cursor: "pointer", transition: "all 0.2s"
            }}
          >
            <Wallet size={20} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Pay Digital Now</div>
              <div style={{ fontSize: 9, opacity: 0.7 }}>Instant deduction from FanFlow Wallet</div>
            </div>
            {payMode === 'now' && <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--accent-cyan)" }} />}
          </button>

          <button 
            onClick={() => setPayMode('cod')}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "16px",
              background: payMode === 'cod' ? "rgba(255, 232, 31, 0.1)" : "transparent",
              border: payMode === 'cod' ? "2px solid var(--accent-yellow)" : "1px solid var(--surface-border)",
              color: payMode === 'cod' ? "var(--accent-yellow)" : "var(--text-secondary)",
              textAlign: "left", cursor: "pointer", transition: "all 0.2s"
            }}
          >
            <Banknote size={20} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Cash on Delivery</div>
              <div style={{ fontSize: 9, opacity: 0.7 }}>Pay when your order arrives</div>
            </div>
            {payMode === 'cod' && <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--accent-yellow)" }} />}
          </button>
        </div>

        {/* Actions */}
        <button 
          onClick={() => onConfirm(payMode)}
          style={{ width: "100%", padding: "16px", background: "var(--text-primary)", color: "var(--bg-primary)", border: "none", fontWeight: 900, fontSize: 13, textTransform: "uppercase", cursor: "pointer", boxShadow: "6px 6px 0 var(--accent-green)" }}
        >
          {payMode === 'now' ? "Authorized & Pay ₹" + item.price : "Place Order (COD)"}
        </button>

        <button 
          onClick={onClose}
          style={{ width: "100%", border: "none", background: "none", color: "var(--text-tertiary)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", marginTop: 16, cursor: "pointer" }}
        >
          Back to browsing
        </button>

      </div>
    </div>
  );
}
