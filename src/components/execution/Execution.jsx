import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import { APPURL } from "../../../URL";
import { useFetchData } from "../queries/UseFetchData";
// import AddTradeModal from "../AddRealTrade";
import { TbEditCircle } from "react-icons/tb";
import { AiTwotoneDelete } from "react-icons/ai";
import ReusableModal from "../common/ReusableModal";
import { useLocalUserData } from "../queries/UseLocalData";

import { MdCrisisAlert, MdWarning } from "react-icons/md";

import { FiArrowDownCircle, FiArrowUpCircle } from "react-icons/fi";

import AddExecution from "./AddExecution";
import EditExecution from "./EditExecution";
import ReusableTable from "../common/ReusableTable";

const Execution = () => {
  const LocalData = useLocalUserData();
  const [portfolioFilter, setPortfolioFilter] = useState("");
  const [SymbolFilter, setSymbolFilter] = useState(null);

  const [editStatus, setEditStatus] = useState({ show: false, data: null });
  const [DeleteStatus, setDeleteStatus] = useState({ show: false, data: null });
  const [StrategyStatus, setStrategyStatus] = useState({
    show: false,
    id: null,
  });
  const [ViewStatus, setViewStatus] = useState({ show: false, data: null });
  const [ViewImage, setViewImage] = useState({ show: false, image: null });
  const {
    data: execution = [],
    isLoading,
    isError,
    refetch: refetchExecutions,
  } = useFetchData("execution");

  useEffect(() => {
    if (execution) {
      setPortfolioFilter(execution[0]?.title);
    }
  }, [execution]);

  const {
    data: symbol = [],
    isLoading: symbolLoading,
    isError: SymbolError,
    refetch: refetchSymbol,
  } = useFetchData("symbol");
  const {
    data: journal = [],
    isLoading: journalLoading,
    isError: journalError,
    refetch: refetchJournal,
  } = useFetchData("journal");

  const {
    data: portfolio = [],
    isLoading: portfolioLoading,
    isError: portfolioError,
    refetch: refetchportfolio,
  } = useFetchData("portfolio");

  const {
    data: strategy = [],
    isLoading: strategyLoading,
    isError: strategyError,
    refetch: refetchstrategy,
  } = useFetchData("strategy");

  const GetSymbol = (id) => {
    if (symbol.length > 0) {
      return symbol.find((val) => val.id === id).symbol || "-";
    }
  };
  // Flatten all trades from all journals
  const allTrades = execution.flatMap((journal) => ({
    ...journal,
    journalTitle: journal.title,
    journalType: journal.type,
  }));

  const RefetchAll = () => {
    refetchExecutions();
  };

  const { mutate: handleDelete, isLoading: isDeleting } = useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(APPURL.execution + `${id}/`, {
        headers: { Authorization: `Bearer ${LocalData.token}` },
      });
      return res.data;
    },
    onSuccess: () => {
      setDeleteStatus({ show: false, data: null });
      RefetchAll();
    },
    onError: (err) => {
      console.error("Delete failed:", err);
    },
  });

  // Unique portfolio IDs for filter dropdown
  const uniquePortfolios = [...new Set(allTrades.map((t) => t.journalTitle))];
  const FilteredMemotrades = useMemo(() => {
    const filteredTrades = allTrades
      .filter((t) =>
        portfolioFilter && SymbolFilter
          ? t.active_status === portfolioFilter &&
            t.symbol_id === Number(SymbolFilter)
          : portfolioFilter
          ? t.active_status === portfolioFilter
          : SymbolFilter
          ? t.symbol_id === Number(SymbolFilter)
          : true
      )

      .map((t) => {
        const portfolioDisplay = t.portfolio_id
          ? portfolio.find((val) => val.id === t.portfolio_id)?.name
          : "-";
        const strategyDisplay = t.strategy_id
          ? strategy.find((val) => val.id === t.strategy_id)?.name
          : "-";

        return {
          ...t,
          portfolio_display: portfolioDisplay,
          strategy_display: strategyDisplay,
          symbol_display: GetSymbol(t.symbol_id),
        };
      });

    return filteredTrades;
  }, [allTrades, portfolioFilter, SymbolFilter]);
  // Apply filter
  // const filteredTrades = allTrades
  //   .filter((t) =>
  //     portfolioFilter && SymbolFilter
  //       ? t.active_status === portfolioFilter &&
  //         t.symbol_id === Number(SymbolFilter)
  //       : portfolioFilter
  //       ? t.active_status === portfolioFilter
  //       : SymbolFilter
  //       ? t.symbol_id === Number(SymbolFilter)
  //       : true
  //   )

  //   .map((t) => {
  //     const portfolioDisplay = t.portfolio_id
  //       ? portfolio.find((val) => val.id === t.portfolio_id)?.name
  //       : "-";
  //     const strategyDisplay = t.strategy_id
  //       ? strategy.find((val) => val.id === t.strategy_id)?.name
  //       : "-";

  //     return {
  //       ...t,
  //       portfolio_display: portfolioDisplay,
  //       strategy_display: strategyDisplay,
  //       symbol_display: GetSymbol(t.symbol_id),
  //     };
  //   });

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (isError)
    return <div className="p-4 text-red-500">Error fetching journal data.</div>;

  const displayOutcome = {
    win: "Win",
    loss: "Loss",
  };

  let win_trades = 0;
  let loss_trades = 0;
  let neutral_trades = 0;
  let total_pl = 0;
  let total_trades = 0;
  let filterJournals = [...execution];
  let pl = 0;

  if (portfolioFilter || SymbolFilter) {
    filterJournals = filterJournals.filter((val) => {
      return val.title === portfolioFilter || val.symbol_id === SymbolFilter;
    });
  }

  total_trades = win_trades + loss_trades + neutral_trades;

  // 🛠️ Correct win_rate calculation
  const win_rate = total_trades
    ? Math.round((win_trades / total_trades) * 100)
    : 0;

  const overall = {
    win_rate,
    win_trades,
    loss_trades,
    neutral_trades,
    avg_return: total_trades
      ? Math.round((total_pl / total_trades) * 100) / 100
      : 0, // avg_return rounded to 2 decimal places
    pl: pl.toFixed(2),
  };

  const ActiveStatus = { active: "Active", inactive: "Inactive" };
  // console.log(overall);

  const FilteredStrategy = StrategyStatus.show
    ? strategy.find((val) => val.id === StrategyStatus.id)
    : {};

  return (
    <>
      <div className="p-4">
        {/* Filter */}
        <div className="flex flex-row justify-between  items-center mb-4">
          <div className=" ">
            <select
              className="border px-2 py-1 rounded text-sm "
              value={portfolioFilter}
              onChange={(e) => setPortfolioFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">InActive</option>
            </select>
            <select
              className="border px-2 py-1 rounded text-sm ml-2 max-w-[10em]"
              value={SymbolFilter}
              onChange={(e) => setSymbolFilter(e.target.value)}
            >
              <option value="">Select Symbol</option>
              {symbol.map((val) => (
                <option value={val.id}>{val.symbol}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-row items-center">
            {/* <div className="px-2  py-2.5 bg-sky-300 hover:bg-sky-800 hover:text-white cursor-pointer text-gray-800 rounded-lg mr-2">
              <PiMicrosoftExcelLogoFill size={24} />
            </div> */}
            <AddExecution
              journals={journal}
              symbols={symbol}
              portfolios={portfolio}
              strategies={strategy.length > 0 ? strategy : []}
              ReFetch={RefetchAll}
            />
          </div>
        </div>

        {/* <StatsDisplay {...overall} /> */}
        {/* Table */}

        <div className="overflow-y-auto border rounded max-h-[70vh] custom-scrollbar">
          <table className="min-w-full text-sm text-left">
            <thead className="sticky top-0 bg-stone-800 z-10 text-xs uppercase font-semibold border-b">
              <tr>
                <th className="px-4 py-2">Date</th>
                {/* <th className="px-4 py-2">Portfolio</th> */}
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Symbol</th>
                <th className="px-4 py-2">Strategy</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Entry</th>
                <th className="px-4 py-2">SL</th>
                <th className="px-4 py-2">TR</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">RR</th>
                <th className="px-4 py-2">Stoploss</th>
                <th className="px-4 py-2">Target</th>
                <th className="px-4 py-2">Traded</th>
                <th className="px-4 py-2">Margin</th>

                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {FilteredMemotrades?.length === 0 ? (
                <tr>
                  <td colSpan={15} className=" text-center py-3 font-bold ">
                    <div className=" flex justify-center flex-row items-center">
                      <MdWarning className="mr-2 text-red-700" size={20} /> No
                      Data found
                    </div>
                  </td>
                </tr>
              ) : (
                FilteredMemotrades.map((trade) => (
                  <tr key={trade.id} className="border-b hover:bg-gray-800">
                    <td className="px-4 py-2">
                      {moment(trade.trade_date).format("DD-MM-yyyy")}
                    </td>
                    {/* <td className="px-4 py-2">{trade.portfolio_id}</td> */}
                    <td
                      className={`px-4 py-2 font-semibold ${
                        trade.active_status === "active"
                          ? "bg-green-800 "
                          : "bg-red-800"
                      }`}
                    >
                      {ActiveStatus[trade.active_status] || "-"}
                    </td>
                    <td className="px-4 py-2">{GetSymbol(trade.symbol_id)}</td>
                    <td
                      className="px-4 py-2 text-amber-500 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        setStrategyStatus({
                          show: true,
                          id: trade.strategy_id,
                        });
                      }}
                    >
                      {trade.strategy_display}
                    </td>

                    <td className="px-4 py-2 capitalize">
                      <div className=" flex flex-row items-center">
                        {trade.trade_type}
                        {trade.trade_type === "Sell" ? (
                          <FiArrowDownCircle
                            className="text-red-500 hover:text-red-600 duration-300 transition-all ml-1"
                            size={16}
                          />
                        ) : (
                          <FiArrowUpCircle
                            className="text-green-500 hover:text-green-600 duration-300 transition-all ml-1"
                            size={16}
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 capitalize">₹ {trade.entry}</td>
                    <td className="px-4 py-2 capitalize">₹ {trade.exit}</td>
                    <td className="px-4 py-2 capitalize">₹ {trade.target}</td>
                    <td className="px-4 py-2">{trade.quantity}</td>

                    <td className="px-4 py-2 ">
                      <div className="flex flex-row items-center">
                        {trade.rr_ratio}
                        {trade.rr_ratio < 3 && (
                          <MdCrisisAlert
                            className="ml-1 text-red-400 cursor-pointer hover:text-red-600 transition-all duration-300"
                            title="Risk Reward should be above 3."
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2">{trade.exit_on_sl}</td>
                    <td className="px-4 py-2">{trade.exit_on_target}</td>
                    <td className="px-4 py-2">₹ {trade.traded_value}</td>
                    <td className="px-4 py-2">₹ {trade.margin_amount}</td>

                    <td className="text-left flex flex-row items-center pl-3 ">
                      <div
                        className="rounded-lg ml-2 hover:bg-sky-400 w-fit hover:text-gray-800 transition-all duration-300 p-1 cursor-pointer mt-1"
                        onClick={(e) => {
                          e.preventDefault();
                          setEditStatus({ show: true, data: trade });
                        }}
                      >
                        <TbEditCircle size={20} />
                      </div>
                      <div
                        className="rounded-lg hover:bg-red-500 w-fit hover:text-gray-800 transition-all duration-300 p-1 cursor-pointer mt-1 ms-2"
                        onClick={(e) => {
                          e.preventDefault();
                          setDeleteStatus({ show: true, data: trade });
                        }}
                      >
                        <AiTwotoneDelete size={20} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EditExecution
        journals={journal}
        portfolios={portfolio}
        strategies={strategy}
        symbols={symbol}
        ReFetch={RefetchAll}
        isOpen={editStatus.show}
        setIsOpen={setEditStatus}
        EditData={editStatus.data}
      />

      <ReusableModal
        isOpen={ViewImage.show}
        handleClose={() => {
          setViewImage((prev) => ({ ...prev, show: false }));

          setTimeout(() => {
            setViewImage((prev) => ({ ...prev, show: false, image: null }));
          }, 300);
        }}
      >
        <div className="bg-stone-900 max-h-[80vh] max-w-6xl min-w-4xl rounded-lg overflow-hidden flex items-center justify-center py-3">
          <img
            src={ViewImage.image}
            alt="Preview"
            className="object-contain max-h-[90%] w-full"
          />
        </div>
      </ReusableModal>
      <ReusableModal
        isOpen={DeleteStatus.show}
        handleClose={() => {
          setTimeout(() => {
            // You can reset DeleteStatus or handle cleanup here if needed
          }, 300);
        }}
      >
        <div className="bg-stone-900 max-w-md w-full rounded-lg p-6 text-white">
          <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
          <p className="mb-6">
            Are you sure you want to delete this item? This action cannot be
            undone.
          </p>

          <div className="flex justify-end gap-4">
            <button
              onClick={() => setDeleteStatus({ show: false, data: null })}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleDelete(DeleteStatus?.data?.id);
                // setDeleteStatus({ show: false, data: null });
              }}
              className="px-4 py-2 text-red-500 !border-red-500 !border-2 hover:!bg-red-600 hover:!text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </ReusableModal>
      <ReusableModal
        isOpen={StrategyStatus.show}
        handleClose={() => {
          setStrategyStatus((prev) => ({ ...prev, show: false }));
          setTimeout(() => {
            // You can reset DeleteStatus or handle cleanup here if needed
            setStrategyStatus((prev) => ({ ...prev, show: false, id: null }));
          }, 300);
        }}
      >
        <div className="bg-stone-900 max-w-xl w-full rounded-lg p-6 text-white">
          <h2 className="text-xl font-semibold mb-4">
            {FilteredStrategy?.name}
          </h2>
          {FilteredStrategy?.description && (
            <ul className="mb-6 list-disc list-inside space-y-2 text-sm text-gray-200">
              {FilteredStrategy.description
                .split(" .")
                .filter((point) => point.trim() !== "")
                .map((point, index) => (
                  <>
                    <li key={index} className=" list-none">
                      {point.trim()}
                    </li>
                    <br />
                  </>
                ))}
            </ul>
          )}

          {/* <div className="flex justify-end gap-4">

          </div> */}
        </div>
      </ReusableModal>
    </>
  );
};

export default Execution;
