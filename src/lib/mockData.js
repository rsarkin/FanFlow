export const matchScoreData = {
  homeTeam: "Eagles",
  homeScore: 24,
  awayTeam: "Falcons",
  awayScore: 17,
  quarter: "4th Quarter",
  timeRemaining: "12:45",
  lastAction: "Touchdown - Eagles (J. Hurts)",
  smartAlert: "Halftime crowds subsiding. Best time to visit food stalls!",
  alertType: "success" // 'success', 'warning', 'danger'
};

export const crowdData = {
  "gate-a": "Low", 
  "gate-b": "High", // High traffic
  "wait-time-gate-a": 5, // mins
  "wait-time-gate-b": 25,
  "food-stall-1": "Moderate",
  "washroom-east": "High"
};

export const foodMenu = [
  { id: "f1", name: "Stadium Hot Dog", price: 6.50, category: "Hot Food", waitTime: 5 },
  { id: "f2", name: "Loaded Nachos", price: 8.00, category: "Snacks", waitTime: 8 },
  { id: "f3", name: "Cold Beer (Pint)", price: 10.00, category: "Drinks", waitTime: 2 },
  { id: "f4", name: "Fountain Soda", price: 4.50, category: "Drinks", waitTime: 2 },
  { id: "f5", name: "Pretzel with Cheese", price: 5.50, category: "Snacks", waitTime: 4 },
];

// Simulated backend delay for API calls
export const simulateDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));
