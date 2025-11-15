const StatsCard = ({ title, value, bgColor }) => (
  <div
    className={`${bgColor} relative bg-stone-800 p-4 rounded-lg w-full max-w-[10vw] text-center flex flex-row justify-center items-center group`}
  >
    <p className="text-2xl font-bold">{value}</p>

    {/* Tooltip / Popover */}
    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-sm rounded py-1 px-2 whitespace-nowrap">
      {title}
    </div>
  </div>
);

const StatsDisplay = ({
  win_rate,
  win_trades,
  loss_trades,
  neutral_trades,
  avg_return,
  pl,
}) => (
  <div className="flex flex-wrap gap-4 p-4 justify-center">
    <StatsCard
      title="Win Rate"
      value={`${win_rate}%`}
      bgColor="text-blue-500 "
    />
    <StatsCard title="Win Trades" value={win_trades} bgColor="text-green-500" />
    <StatsCard title="Loss Trades" value={loss_trades} bgColor="text-red-500" />
    <StatsCard
      title="Neutral Trades"
      value={neutral_trades}
      bgColor="text-sky-600"
    />
    <StatsCard
      title="Average Return"
      value={`${avg_return}%`}
      bgColor="text-purple-500"
    />
    <StatsCard
      title="P&L"
      value={`₹${pl}`}
      bgColor={pl > 0 ? "text-green-500" : "text-red-500"}
    />
  </div>
);

export default StatsDisplay;
