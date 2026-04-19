# FanFlow: The Smart Stadium Assistant

**FanFlow** is an immersive, mobile-first Matchday Companion designed to bridge the gap between physical stadium environments and the digital fan experience. It transforms the often-chaotic stadium visit into a streamlined, "smart" experience.

## 🏆 Chosen Vertical: Smart Stadium & Venue Assistant
FanFlow falls under the **Matchday Experience & Hospitality** vertical. It targets the friction points of modern sporting events: long food queues, navigational confusion, and overwhelming exit crowds.

---

## 🧠 Approach & Logic

### 1. Immersive Notification Engine
At the heart of FanFlow is a dynamic "Assistant" logic that monitors the live state of the match and the stadium environment:
- **Event-Driven Alerts**: The system triggers context-aware notifications (e.g., "Wicket Down", "Boundary Hit", "Drinks Break") to keep fans engaged even if they are away from their seats.
- **Safety & Logistics**: Logic-based "Danger" and "Parking" alerts (e.g., parking beam allocation, emergency updates) prioritize user safety and convenience.
- **Smart Delays**: Notifications are weighted by priority and shuffled to feel organic, preventing "alert fatigue."

### 2. Cognitive Load Reduction (Map & Navigation)
Instead of overwhelming users with a 1,000-point vector map, FanFlow uses a **Sector-Based Navigation** approach:
- **Tiers of Detail**: The high-level map focuses on Entry/Exit gates. Selecting a sector "drills down" into specific amenities (Washrooms, Food, Lifts).
- **Logical Grouping**: Features are categorized and color-coded using the "NeoPOP" aesthetic for instant recognition in a high-stress, noisy stadium environment.

### 3. Queue-Free Retail Ecosystem
FanFlow implements a dual-mode ordering system:
- **In-Seat Delivery**: Logic checks for "Selected Seats" state. If a user hasn't selected a seat on the map, the app intelligently prompts them before allowing an in-seat order.
- **Stall Pickup**: Integrated QR mapping for quick physical collection.

### 4. Smart Exit Recommendations
Using simulated "Crowd Density" sensors, the app calculates the fastest route to the parking lot or main gates post-match, recommending specific gates (e.g., Gate C) while suggesting a "5-minute wait" if the density exceeds safety thresholds.

---

## 🛠️ How it Works

- **Frontend**: Built with **Next.js 15+** and **React 19**, utilizing the **App Router** for optimized routing.
- **State Management**: Uses a centralized `RetailContext` (React Context API) to manage notification streams, order history, and stadium state globally.
- **Design System**: A custom **NeoPOP Design Language** — characterized by high-contrast colors, glassmorphism, and sharp-cornered components — to ensure visibility under stadium lighting and high-glare conditions.
- **PWA (Progressive Web App)**: Fully installable via `@ducanh2912/next-pwa`, ensuring matchday reliability and offline access to seat information.
- **Asset Optimization**: Aggressive repository management (< 1MB) through CDN offloading, ensuring the app is lightweight and fast-loading even on congested stadium networks.

---

## 📎 Assumptions & Real-World Considerations

1. **Simulated Data**: For the purpose of this demonstration, stadium crowd density and match events are simulated via a 13.5-second logic loop to showcase the Assistant's responsiveness.
2. **Location & Connectivity (Bluetooth Mesh)**: The application is architected to support **Bluetooth Mesh** and BLE Beacon technology. In a stadium's "dead zone" (where 5G is congested), FanFlow can utilize a mesh of low-power nodes to deliver notifications and sub-meter positioning without relying on centralized cellular networks.
3. **Connectivity**: While designed as a PWA for resilience, the app assumes a "data-light" environment, prioritizing minimal transfer sizes to function on overloaded 5G/LTE networks.
4. **Google Services**: The app is designed with Google Maps API integration in mind for broader venue navigation, though currently uses a custom SVG-based high-performance map for specific stadium interiors.

---

## 🚀 Vision
FanFlow isn't just an app; it's a **Matchday Operating System**. By digitizing the physical stadium, we return the fan's focus to where it belongs: **the game.**
