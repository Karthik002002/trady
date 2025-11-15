import React, { useEffect, useState } from "react";
import ManagePortfolio from "./ManagePortfolio";
import ManageSymbol from "./ManageSymbol";
import ManageStrategy from "./ManageStrategy";
import ManageJournals from "./ManageJournal";
import { useSearchParams } from "react-router-dom";
import ManageEntrySetups from "./MangeEntrySetups";

export default function Manage() {
  const menu = [
    {
      display: "Portfolio",
      link: "portfolio",
      component: <ManagePortfolio />,
    },
    {
      display: "Symbol",
      link: "symbol",
      component: <ManageSymbol />,
    },
    {
      display: "Strategy",
      link: "strategy",
      component: <ManageStrategy />,
    },
    {
      display: "Journal",
      link: "journal",
      component: <ManageJournals />,
    },
    {
      display: "Entry Setup",
      link: "entry_setup",
      component: <ManageEntrySetups />,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeParams, setActiveParams] = useSearchParams();

  useEffect(() => {
    const tab = activeParams.get("tab");
    if (activeParams) {
      const getindex = menu.findIndex((val) => val.link === tab);

      if (getindex >= 0) {
        console.log(getindex);

        setActiveIndex(getindex);
      }
    }
  }, [activeParams]);

  return (
    <div className="flex max-h-[90vh] min-h-[80vh] rounded-lg overflow-hidden pt-4">
      {/* Left Menu - 20% */}
      <div className="w-1/5  p-4 space-y-2">
        {menu.map((item, index) => (
          <div
            key={item.link}
            className={`cursor-pointer px-4 py-2 rounded-lg ${
              index === activeIndex
                ? "bg-stone-600 text-white"
                : "text-gray-300 hover:bg-stone-700"
            }`}
            onClick={() => {
              setActiveIndex(index);
              setActiveParams({ tab: item.link });
            }}
          >
            {item.display}
          </div>
        ))}
      </div>

      {/* Right Component - 80% */}
      <div className="w-4/5 bg-stone-900 p-6 text-white overflow-auto rounded-lg">
        {menu[activeIndex].component}
      </div>
    </div>
  );
}
