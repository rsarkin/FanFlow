"use client";

import React from 'react';
import { X, Bell, Info, ShieldAlert, Zap, Truck } from 'lucide-react';
import { useRetail } from '../context/RetailContext';

export default function NotificationOverlay() {
  const { notifications, showNotifications, toggleNotifications, clearNotifications } = useRetail();

  if (!showNotifications) return null;

  const getIcon = (type) => {
    switch (type) {
      case "order": return <Truck size={18} className="text-cyan-400" />;
      case "match": return <Zap size={18} className="text-yellow-400" />;
      case "danger": return <ShieldAlert size={18} className="text-red-500" />;
      default: return <Bell size={18} className="text-gray-400" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case "order": return "var(--accent-cyan)";
      case "match": return "var(--accent-yellow)";
      case "danger": return "var(--accent-red)";
      default: return "var(--surface-border)";
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[2000] flex justify-end"
      onClick={() => toggleNotifications(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" />

      {/* Pane */}
      <div 
        className="relative w-full max-w-[340px] bg-[#0A0A0A] border-l border-white/10 flex flex-col h-full shadow-2xl animate-slideLeft"
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--accent-yellow)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Live Updates</div>
            <h2 style={{ fontFamily: 'var(--font-serif-main)', fontSize: 24, fontWeight: 700, color: '#fff' }}>Activity Log</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <p style={{ fontSize: 13, fontFamily: 'var(--font-sans-main)' }}>No recent activity to show.</p>
              <p style={{ fontSize: 11, fontFamily: 'var(--font-mono-main)', marginTop: 8 }}>Notifications will appear here as the match progresses.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {notifications.map((n) => (
                <div 
                  key={n.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--surface-border)',
                    borderLeft: `3px solid ${getBorderColor(n.type)}`,
                    padding: '16px',
                    position: 'relative',
                    animation: 'fadeInSlide 0.4s ease-out both'
                  }}
                >
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ marginTop: 2 }}>{getIcon(n.type)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{n.title}</h3>
                        <span style={{ fontSize: 9, fontFamily: 'var(--font-mono-main)', color: 'var(--text-tertiary)' }}>{n.timestamp}</span>
                      </div>
                      <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{n.message}</p>
                    </div>
                  </div>
                  {n.unread && (
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--surface-border)' }}>
            <button 
              onClick={clearNotifications}
              style={{
                width: '100%',
                padding: '12px',
                background: 'none',
                border: '1px solid var(--surface-border)',
                color: 'var(--text-tertiary)',
                fontSize: 10,
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                cursor: 'pointer'
              }}
              className="hover:border-white/20 transition-colors"
            >
              Clear All Logs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
