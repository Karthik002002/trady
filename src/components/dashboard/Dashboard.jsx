import React, { useState } from "react";
import { useFetchData } from "../queries/UseFetchData";

import { FaCheckCircle, FaRegClock } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  SpinnerCircularFixed,
  SpinnerDiamond,
  SpinnerDotted,
} from "spinners-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const {
    data: goal = [],
    isLoading: goalLoading,
    isError: goalError,
    refetch: refetchGoal,
  } = useFetchData("goal");
  const {
    data: allJournal = [],
    isLoading: allJournalLoading,
    isError: allJournalError,
    refetch: refetchallJournal,
  } = useFetchData("all_journal");

  return (
    <div className=" grid grid-cols-8">
      <div className="pt-4 col-span-4">
        <h4 className=" font-semibold text-xl mb-4">Goals</h4>
        <div className="max-w-[50%] place-content-center place-items-center">
          {goalLoading ? (
            <SpinnerDotted
              size={30}
              className=" text-white/40"
              thickness={200}
              speed={200}
            />
          ) : (
            <GoalList goals={goal} />
          )}
        </div>
      </div>
      <div className="flex flex-row col-span-4 w-full">
        <PieCharts data={allJournal} />
      </div>
    </div>
  );
}

const GoalList = ({ goals }) => {
  const [hoveredGoal, setHoveredGoal] = useState(null);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  return (
    <>
      <div className="relative w-full">
        {/* Popover Host (outside scroll area) */}
        {hoveredGoal && (
          <div
            className="absolute z-50 bg-black text-white text-sm px-3 py-1 rounded shadow-md whitespace-nowrap"
            style={{
              left: popoverPosition.x,
              top: popoverPosition.y,
              transform: "translate(-50%, 0%)",
            }}
          >
            Goal: ₹ {hoveredGoal.goal} | Reached: ₹ {hoveredGoal.current}
          </div>
        )}

        {/* Scrollable Goals Row */}
        <div className="overflow-x-auto custom-scrollbar">
          <div className="flex flex-row gap-5  w-max">
            {[...goals].map((goal) => (
              <div
                key={goal.id}
                className="group flex items-center gap-3 hover:bg-white/10 w-fit p-4 rounded-lg relative cursor-pointer"
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setPopoverPosition({
                    x: rect.left + rect.width / 2,
                    y: (rect.bottom - 50) / 50,
                  });
                  setHoveredGoal(goal);
                }}
                onMouseLeave={() => setHoveredGoal(null)}
              >
                <h3 className="font-semibold">{goal.title}</h3>
                <GoalProgressCircle
                  percent={goal.percent}
                  reached={goal.reached}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const GoalProgressCircle = ({ percent, reached }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex items-center justify-center text-sm text-white">
        {reached ? (
          <FaCheckCircle size={20} color="green" />
        ) : (
          <FaRegClock size={20} className="text-blue-500" />
        )}
      </div>
    </div>
  );
};

import { PieChart, Pie, Cell } from "recharts";

// Aggregate win/loss totals by type
const getPieData = (type, data) => {
  const filtered = data.filter((item) => item.type === type);
  

  const winTotal = filtered.reduce((sum, cur) => sum + cur.win_trades, 0);
  const lossTotal = filtered.reduce((sum, cur) => sum + cur.loss_trades, 0);
  return [
    { name: "Wins", value: winTotal },
    { name: "Losses", value: lossTotal },
  ];
};

const COLORS = ["#808080", "#ffff"];

const PieChartSection = ({ title, data }) => (
  <div style={{ width: "100%", maxWidth: 300, margin: "0 auto" }}>
    <h4 style={{ textAlign: "center" }}>{title}</h4>
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={60}
          fill="#00a63e"
          label
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

const PieCharts = ({ data }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-around",
      flexWrap: "wrap",
    }}
  >
    <PieChartSection title="Test Journals" data={getPieData("test", data)} />
    <PieChartSection title="Real Journals" data={getPieData("real", data)} />
  </div>
);
