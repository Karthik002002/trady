import axios from "axios";
import { APPURL } from "../../../URL";
import { useQuery } from "@tanstack/react-query";
import { useLocalUserData } from "./UseLocalData";

// const LocalData = JSON.parse(window.localStorage.getItem("user"));

export const useFetchData = (key) => {
  const fetchMap = {
    real_journals: async () => {
      const res = await axios.get(APPURL.real_journal, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LocalData.token}`,
        },
      });
      return res.data;
    },
    test_journals: async () => {
      const res = await axios.get(APPURL.test_journal, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LocalData.token}`,
        },
      });
      return res.data;
    },
    all_journal: async () => {
      const res = await axios.get(APPURL.all_journal, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LocalData.token}`,
        },
      });
      return res.data;
    },
    execution: async () => {
      const res = await axios.get(APPURL.execution, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LocalData.token}`,
        },
      });
      return res.data;
    },

    journal: async () => {
      const res = await axios.get(`${APPURL.journal}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LocalData.token}`,
        },
      });
      return res.data;
    },
    symbol: async () => {
      const res = await axios.get(`${APPURL.symbol}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LocalData.token}`,
        },
      });
      return res.data;
    },
    portfolio: async () => {
      const res = await axios.get(`${APPURL.portfolio}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LocalData.token}`,
        },
      });
      return res.data;
    },

    strategy: async () => {
      const res = await axios.get(APPURL.strategy, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LocalData.token}`,
        },
      });
      return res.data;
    },
    goal: async () => {
      const res = await axios.get(APPURL.goal, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LocalData.token}`,
        },
      });
      return res.data;
    },
  };
  const LocalData = useLocalUserData();
  const query = useQuery({
    queryKey: [key],
    queryFn: fetchMap[key],

    staleTime: 60 * 1000,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};
