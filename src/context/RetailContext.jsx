"use client";

import React, { createContext, useContext, useState } from 'react';

const RetailContext = createContext();

export function RetailProvider({ children }) {
  const [orderHistory, setOrderHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [orderedItem, setOrderedItem] = useState(null);
  const [basketTab, setBasketTab] = useState("active");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const addNotification = (title, message, type = "info") => {
    const newNotif = {
      id: `NT-${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread: true
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const toggleNotifications = (val) => {
    setShowNotifications(val !== undefined ? val : !showNotifications);
    // Mark as read when opened
    if (val === true || (val === undefined && !showNotifications)) {
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    }
  };

  const addOrder = (order, skipPopup = false) => {
    // If the order is for seat delivery, attach the current selected seats
    const enrichedOrder = {
      ...order,
      seats: order.type === "seat" ? [...selectedSeats] : []
    };
    setOrderHistory(prev => [enrichedOrder, ...prev]);
    
    // Simulate Order Tracking for Seat Delivery
    if (order.type === "seat") {
      addNotification("Order Received! 🍔", `We're preparing your ${order.name}. Sit back and enjoy the match.`, "order");
      
      // Simulate "On its way" after 20 seconds (ensures a gap with match alerts)
      setTimeout(() => {
        addNotification("Order on its way! 🚴", `A runner is heading to Stand ${enrichedOrder.stand || ""}, Row ${enrichedOrder.seats[0]?.row}, Seat ${enrichedOrder.seats[0]?.seat}.`, "order");
      }, 20000);
    }

    if (!skipPopup) {
      setOrderedItem(enrichedOrder);
    }
  };

  const markAsReceived = (orderId) => {
    setOrderHistory(prev => prev.map(o => o.id === orderId ? { ...o, status: "delivered" } : o));
    setOrderedItem(null);
  };

  const openQR = (order) => {
    setOrderedItem(order);
  };

  const toggleHistory = (val) => {
    setShowHistory(val !== undefined ? val : !showHistory);
  };

  return (
    <RetailContext.Provider value={{
      orderHistory,
      showHistory,
      orderedItem,
      basketTab,
      selectedSeats,
      notifications,
      showNotifications,
      addNotification,
      clearNotifications,
      toggleNotifications,
      setSelectedSeats,
      setBasketTab,
      addOrder,
      markAsReceived,
      openQR,
      setOrderedItem,
      toggleHistory
    }}>
      {children}
    </RetailContext.Provider>
  );
}

export const useRetail = () => useContext(RetailContext);
