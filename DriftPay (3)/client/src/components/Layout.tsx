import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import StarryBackground from "./ShootingStars";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [satsBalance, setSatsBalance] = useState(0);

  useEffect(() => {
    const savedSats = localStorage.getItem("dp_default_sats_balance");
    setSatsBalance(Number(savedSats) || 0);

    const handleStorageChange = () => {
      const newSats = localStorage.getItem("dp_default_sats_balance");
      setSatsBalance(Number(newSats) || 0);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("owner");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <div className="driftpay-theme min-h-screen">
      <StarryBackground />
      <div className="wrap pt-12">
        <nav
          className="row"
          style={{
            justifyContent: "center",
            marginBottom: "10px",
            gap: "0.5rem",
            background: "rgba(10, 10, 35, 0.5)",
            backdropFilter: "blur(4px)",
            padding: "8px",
            borderRadius: "16px",
          }}
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              `btn ghost ${isActive ? "primary" : ""}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/journal"
            className={({ isActive }) =>
              `btn ghost ${isActive ? "primary" : ""}`
            }
          >
            Journal
          </NavLink>
          <NavLink
            to="/stats"
            className={({ isActive }) =>
              `btn ghost ${isActive ? "primary" : ""}`
            }
          >
            Rewards
          </NavLink>
          <NavLink
            to="/market"
            className={({ isActive }) =>
              `btn ghost ${isActive ? "primary" : ""}`
            }
          >
            Market
          </NavLink>
        </nav>
        <div className="flex justify-center mb-4">
          <div className="bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full text-sm mr-[0px]">
            ⚡ {satsBalance.toLocaleString()} SATs
          </div>
        </div>
        <main>{children}</main>
      </div>
      <div className="fixed bottom-4 left-4 z-20">
        <button
          onClick={handleLogout}
          className="text-xs text-muted-foreground underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Layout;
