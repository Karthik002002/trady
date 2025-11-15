import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import RandomAnimatedText from "../login/RandomText";
import ProfileMenu from "./ProfileMenu";

export default function Navbar() {
  const tabs = [
    { display: "Dashboard", link: "/dashboard" },
    { display: "Execution", link: "/execution" },
    { display: "Journal", link: "/journal" },
    { display: "Testing", link: "/testing" },
    { display: "Manage", link: "/manage" },
  ];
  const location = useLocation();
  const [activeTab, setActiveTab] = useState({
    display: "Dashboard",
    link: "/dashboard",
  });
  return (
    <div className="min-h-[100vh] px-4 py-2">
      <nav className="w-full bg-none flex flex-row justify-between ">
        <div className="max-w-5xl  flex space-x-2">
          {tabs.map((tab, idx) => (
            <Link to={tab.link}>
              <button
                key={idx}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-t-lg text-sm font-medium transition-all duration-300
                    ${
                      location.pathname.includes(tab.link)
                        ? "text-green-600 shadow-md  "
                        : "text-gray-600 hover:text-green-600 hover:!outline-green-600 hover:!border-green-600"
                    }`}
              >
                {tab.display}
              </button>
            </Link>
          ))}
        </div>
        <div>
          <ProfileMenu />
        </div>
      </nav>

      <Outlet />
    </div>
  );
}
