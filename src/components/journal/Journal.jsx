import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import { APPURL } from "../../../URL";
import { useFetchData } from "../queries/UseFetchData";
import AddTradeModal from "./AddRealTrade";
import { TbEditCircle } from "react-icons/tb";
import { AiTwotoneDelete } from "react-icons/ai";
import { HiMiniPhoto } from "react-icons/hi2";
import EditTradeModal from "./EditRealTrade";
import ReusableModal from "../common/ReusableModal";
import { useDeleteItem } from "../queries/UseDelete";
// import { LocalData } from "../common/ComFuncs";
import { useLocalUserData } from "../queries/UseLocalData";

const Journal = () => {
  const LocalData = useLocalUserData();
  const [portfolioFilter, setPortfolioFilter] = useState("");

  const [editStatus, setEditStatus] = useState({ show: false, data: null });
  const [DeleteStatus, setDeleteStatus] = useState({ show: false, data: null });
  const [ViewImage, setViewImage] = useState({ show: false, image: null });
  const {
    data: journals = [],
    isLoading,
    isError,
    refetch: refetchJournals,
  } = useFetchData("real_journals");
  const [JournalData, setJournalData] = useState([]);

  useEffect(() => {
    if (journals) {
      setPortfolioFilter(journals[0]?.journalTitle);
    }
  }, [journals]);

  const {
    data: symbol = [],
    isLoading: symbolLoading,
    isError: SymbolError,
    refetch: refetchSymbol,
  } = useFetchData("symbol");
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
  const allTrades = journals.flatMap((journal) =>
    journal.trades.map((trade) => ({
      ...trade,
      journalTitle: journal.title,
      journalType: journal.type,
    }))
  );

  const RefetchAll = () => {
    refetchJournals();
  };

  const { mutate: handleDelete, isLoading: isDeleting } = useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(APPURL.trade + `${id}/`, {
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

  // Apply filter
  const filteredTrades = allTrades.filter((t) =>
    portfolioFilter ? t.journalTitle === portfolioFilter : true
  );

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
  let filterJournals = [...journals];

  if (portfolioFilter) {
    filterJournals = filterJournals.filter(
      (val) => val.title === portfolioFilter
    );
  }

  filterJournals.forEach((journal) => {
    win_trades += journal.win_trades;
    loss_trades += journal.loss_trades;
    neutral_trades += journal.neutral_trades;
    total_pl += journal.total_pl;
  });

  total_trades = win_trades + loss_trades + neutral_trades;

  const overall = {
    win_rate: total_trades ? (win_trades / total_trades) * 100 : 0,
    win_trades,
    loss_trades,
    neutral_trades,
    avg_return: Math.round(total_trades ? total_pl / total_trades : 0, 2),
  };

  // console.log(overall);

  return (
    <>
      <div className="p-4">
        {/* Filter */}
        <div className="flex flex-row justify-between mb-3 items-center">
          <div className="">
            <label className="mr-2 text-sm font-medium">
              Filter by Journal:
            </label>
            <select
              className="border px-2 py-1 rounded text-sm "
              value={portfolioFilter}
              onChange={(e) => setPortfolioFilter(e.target.value)}
            >
              <option value="">All</option>
              {uniquePortfolios.map((id) => (
                <option key={id} value={id} className="text-gray-800">
                  {id}
                </option>
              ))}
            </select>
          </div>
          <div>
            <AddTradeModal
              journals={journals}
              symbols={symbol}
              portfolios={portfolio}
              strategies={strategy.length > 0 ? strategy : []}
              ReFetch={RefetchAll}
            />
          </div>
        </div>

        <StatsDisplay {...overall} />
        {/* Table */}
        <div className="overflow-y-auto border rounded max-h-[70vh] custom-scrollbar">
          <table className="min-w-full text-sm text-left">
            <thead className="sticky top-0 bg-stone-800 z-10 text-xs uppercase font-semibold border-b">
              <tr>
                <th className="px-4 py-2">Date</th>
                {/* <th className="px-4 py-2">Portfolio</th> */}
                <th className="px-4 py-2">Journal</th>
                <th className="px-4 py-2">Symbol</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Entry</th>
                <th className="px-4 py-2">Exit</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">P&L</th>
                <th className="px-4 py-2">Outcome</th>
                <th className="px-4 py-2">Reference</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {[...filteredTrades].map((trade) => (
                <tr key={trade.id} className="border-b hover:bg-gray-800">
                  <td className="px-4 py-2">
                    {moment(trade.trade_date).format("YYYY-MM-DD")}
                  </td>
                  {/* <td className="px-4 py-2">{trade.portfolio_id}</td> */}
                  <td className="px-4 py-2">{trade.journalTitle}</td>
                  <td className="px-4 py-2">{GetSymbol(trade.symbol_id)}</td>
                  <td className="px-4 py-2 capitalize">{trade.type}</td>
                  <td className="px-4 py-2 capitalize">{trade.entry_price}</td>
                  <td className="px-4 py-2 capitalize">{trade.exit_price}</td>
                  <td className="px-4 py-2">{trade.quantity}</td>
                  <td
                    className={`px-4 py-2 ${
                      trade.pl < 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    ₹{trade.pl}
                  </td>
                  <td className="px-4 py-2">{displayOutcome[trade.outcome]}</td>
                  <td className="px-4 py-2">
                    {trade.photo ? (
                      <div
                        className="hover:bg-purple-800 hover:text-white transition-all duration-300 w-fit p-1 cursor-pointer rounded-md"
                        onClick={(e) => {
                          e.preventDefault();
                          setViewImage({ show: true, image: trade.photo });
                        }}
                      >
                        <HiMiniPhoto size={18} />
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="text-left flex flex-row items-center ">
                    <div
                      className="rounded-lg hover:bg-sky-400 w-fit hover:text-gray-800 transition-all duration-300 p-1 cursor-pointer mt-1"
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
                setDeleteStatus({ show: false, data: null });
              }}
              className="px-4 py-2 text-red-500 !border-red-500 !border-2 hover:!bg-red-600 hover:!text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </ReusableModal>

      <EditTradeModal
        journals={journals}
        portfolios={portfolio}
        strategies={strategy}
        symbols={symbol}
        ReFetch={RefetchAll}
        EditData={editStatus.data}
        isOpen={editStatus.show}
        setIsOpen={setEditStatus}
      />
    </>
  );
};

export default Journal;

const StatsCard = ({ title, value, bgColor }) => (
  <div
    className={`${bgColor} bg-stone-800 p-4 rounded-lg w-full max-w-[15vw] text-center content-center flex flex-row justify-evenly items-center`}
  >
    <h3 className=" text-white font-semibold">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const StatsDisplay = ({
  win_rate,
  win_trades,
  loss_trades,
  neutral_trades,
  avg_return,
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
  </div>
);
