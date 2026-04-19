"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 7 6-3 6 3 6-3v13l-6 3-6-3-6 3Z" />
      <path d="M9 4v13" />
      <path d="M15 7v13" />
    </svg>
  );
}

function PizzaIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a8.53 8.53 0 0 0-3.59.8 9.78 9.78 0 0 0-5 5A8.53 8.53 0 0 0 2.6 12L12 22l9.4-10a8.53 8.53 0 0 0-.8-4.2 9.78 9.78 0 0 0-5-5A8.53 8.53 0 0 0 12 2Z" />
      <circle cx="12" cy="11" r="1" />
      <circle cx="9" cy="8" r="1" />
      <circle cx="15" cy="9" r="1" />
    </svg>
  );
}

function ExitIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

const navItems = [
  { label: "Home", path: "/", icon: HomeIcon },
  { label: "Map", path: "/map", icon: MapIcon },
  { label: "Food", path: "/food", icon: PizzaIcon },
  { label: "Exit", path: "/exit", icon: ExitIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Only show inside a venue — hide on the home/landing page
  if (pathname === "/") return null;

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`nav-item${pathname === item.path ? " active" : ""}`}
          >
            <Icon />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
