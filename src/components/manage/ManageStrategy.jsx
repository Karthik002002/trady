import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useFetchData } from "../queries/UseFetchData";
import { TbEditCircle } from "react-icons/tb";
import { AiTwotoneDelete } from "react-icons/ai";
import ReusableModal from "../common/ReusableModal";
import { APPURL } from "../../../URL";
// import { LocalData } from "../common/ComFuncs";
import { useToast } from "../toast/CustomToast";
import { faL } from "@fortawesome/free-solid-svg-icons";
import { useLocalUserData } from "../queries/UseLocalData";
import ReusableTable from "../common/ReusableTable";

export default function ManagePortfolio() {
  const LocalData = useLocalUserData();
  const [modal, setModal] = useState({ show: false, mode: "add", item: null });
  const [deleteData, setDeleteData] = useState({ show: false, data: null });
  const [formData, setFormData] = useState({ description: "", name: "" });

  const toast = useToast();

  // const {
  //   data: portfolio = [],
  //   isLoading: portfolioLoading,
  //   isError: portfolioError,
  //   refetch: refetchportfolio,
  // } = useFetchData("portfolio");
  const {
    data: strategy = [],
    isLoading: strategyLoading,
    isError: strategyError,
    refetch: refetchStrategy,
  } = useFetchData("strategy");

  const submitHandler = async ({ mode, item, name, description, token }) => {
    const url =
      mode === "add" ? APPURL.strategy : `${APPURL.strategy}${item?.id}/`;
    const method = mode === "add" ? "POST" : "PUT";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Something went wrong");
    }

    return await response.json();
  };

  const {
    mutate: savePortfolio,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: ({ mode, item, name, description }) =>
      submitHandler({
        mode,
        item,
        name,
        description,
        token: LocalData?.token,
      }),
    onSuccess: () => {
      setModal({ show: false, mode: "add", item: null });
      setFormData({ symbol: "", name: "" });
      refetchStrategy();
    },
    onError: (err) => {
      toast.error(err.message);
      console.error("Error saving:", err);
    },
  });

  const deleteHandler = async ({ id, token }) => {
    const url = `${APPURL.strategy}${id}/`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete symbol");
    }

    return true;
  };

  const {
    mutate: deleteSymbol,
    isPending: isDeleting,
    isError: isDeleteError,
    error: deleteError,
  } = useMutation({
    mutationFn: ({ id }) => deleteHandler({ id, token: LocalData?.token }),
    onSuccess: () => {
      toast.success("Strategy deleted");
      refetchStrategy();
      setDeleteData({ data: null, show: false });
    },
    onError: (err) => {
      toast.error(err.message || "Error deleting Strategy");
      console.error("Delete Error:", err);
    },
  });

  const openModal = (mode, item = null) => {
    setFormData({ ...item });
    setModal({ show: true, mode, item: item });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">List</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
          onClick={() => openModal("add")}
        >
          Add
        </button>
      </div>
      <ReusableTable
        columns={[
          { label: "ID", accessor: "id", sortable: true },
          { label: "Name", accessor: "name", sortable: true },
          {
            label: "Description",
            accessor: "description",
            render: (row) => (
              <div
                className="max-w-[25em] w-[25em] overflow-hidden whitespace-nowrap text-ellipsis"
                title={row.description}
              >
                {row.description || "-"}
              </div>
            ),
          },
          {
            label: "Actions",
            accessor: "actions",
            render: (row) => (
              <div className="flex items-center">
                <div
                  className="rounded-lg hover:bg-sky-400 hover:text-gray-800 transition p-1 cursor-pointer"
                  onClick={() => openModal("edit", row)}
                >
                  <TbEditCircle size={20} />
                </div>
                <div
                  className="rounded-lg hover:bg-red-500 hover:text-gray-800 transition p-1 cursor-pointer ms-2"
                  onClick={() => setDeleteData({ data: row, show: true })}
                >
                  <AiTwotoneDelete size={20} />
                </div>
              </div>
            ),
          },
        ]}
        data={strategy}
      />

      <ReusableModal
        isOpen={modal.show}
        handleClose={() => setModal({ show: false, mode: "add", item: null })}
      >
        <div className="bg-stone-900 max-w-md w-full rounded-lg p-6 text-white">
          <h3 className="text-lg mb-4">
            {modal.mode === "add" ? "Add Item" : "Edit Item"}
          </h3>
          <input
            className="w-full p-2 rounded bg-stone-700 text-white border mb-4"
            placeholder="Enter symbol"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <textarea
            className="w-full p-2 rounded bg-stone-700 text-white border mb-4"
            placeholder="Enter description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:!bg-green-700 hover:!outline-green-400 hover:!border-green-400"
              onClick={() => {
                if (!formData.name) {
                  toast.error("Name is mandatory");
                  return;
                }
                if (!formData.description) {
                  toast.error("Description is mandatory");
                  return;
                }
                savePortfolio({
                  mode: modal.mode,
                  item: modal.item,
                  ...formData,
                });
              }}
            >
              {modal.mode === "add" ? "Add" : "Save"}
            </button>
          </div>
        </div>
      </ReusableModal>
      <ReusableModal
        isOpen={deleteData.show}
        handleClose={() => {
          setDeleteData({ data: null, show: false });
        }}
      >
        <div className="bg-stone-900 max-w-md w-full rounded-lg p-6 text-white">
          <h2 className="text-xl font-semibold mb-4">
            Confirm Deletion - {deleteData.data?.symbol}
          </h2>
          <p className="mb-6">
            Are you sure you want to delete this item? This action cannot be
            undone.
          </p>

          <div className="flex justify-end gap-4">
            <button
              onClick={() => setDeleteData({ show: false, data: null })}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                deleteSymbol({ id: deleteData?.data?.id });
              }}
              className="px-4 py-2 text-red-500 !border-red-500 !border-2 hover:!bg-red-600 hover:!text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </ReusableModal>
    </>
  );
}
