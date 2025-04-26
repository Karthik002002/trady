import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useLocalUserData } from "./UseLocalData";

const useDeleteItem = () => {
  const queryClient = useQueryClient();
  // const LocalData = JSON.parse(window.localStorage.getItem("user"));
  const LocalData = useLocalUserData();
  return useMutation({
    mutationFn: async (api) => {
      const response = await axios.delete(api, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LocalData.token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      
      
    },
    onError: (error) => {
      console.error("Delete failed:", error);
    },
  });
};

export { useDeleteItem };
