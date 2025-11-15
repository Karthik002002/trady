import { Fragment, useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";

import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { SpinnerCircularFixed } from "spinners-react";
import { APPURL } from "../../../URL";
import { useLocalUserData } from "../queries/UseLocalData";
import { ActiveData, MarginData } from "../common/ComFuncs";

const EditExecution = ({
  journals = [],
  portfolios = [],
  strategies = [],
  symbols = [],
  ReFetch,
  isOpen,
  setIsOpen,
  EditData,
}) => {
  const [formData, setFormData] = useState({
    journal_id: "",
    portfolio_id: "",
    strategy_id: "",
    symbol_id: "",
    quantity: "",
    entry: "",
    exit: "",
    target: "",
    trade_type: "buy",
  });
  const [errors, setErrors] = useState({});
  const LocalData = useLocalUserData();
  const inputRef = useRef(null);

  useEffect(() => {
    if (EditData) {
      setFormData({
        ...EditData,
      });
    } else {
      setFormData({
        journal_id: "",
        portfolio_id: "",
        strategy_id: "",
        symbol_id: "",
        quantity: "",
        entry: "",
        exit: "",
        target: "",
        trade_type: "buy",
      });
    }
  }, [EditData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file)
      setFormData((prev) => ({
        ...prev,
        photo: file,
        display_file_name: file.name,
      }));
    else
      setFormData((prev) => ({
        ...prev,
        photo: null,
        display_file_name: null,
      }));
  };
  const submitTrade = async (formData) => {
    const token = LocalData.token;

    const res = await fetch(`${APPURL.execution}${EditData?.id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to submit trade");
    }

    return res.json();
  };
  const {
    mutate: submitTradeMutation,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: submitTrade,
    onSuccess: () => {
      //   console.log("Trade submitted successfully");
      ReFetch();
      setIsOpen({ show: false, data: null });

      setFormData({
        journal_id: "",
        portfolio_id: "",
        strategy_id: "",
        symbol_id: "",
        quantity: "",
        entry_price: "",
        exit_price: "",
        price: "",
        type: "buy",
        trade_date: new Date().toISOString().split("T")[0],
        fees: "",
        confidence_level: "",
        entry_reason: "",
        exit_reason: "",
        notes: "",
        photo: null,
        display_file_name: null,
        outcome: "win",
      });
    },
    onError: (err) => {
      console.error("Error submitting trade:", err.message);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numberField = [
      "quantity",
      "entry_price",
      "exit_price",
      "confidence_level",
    ];
    if (name.includes("id") || numberField.includes(name)) {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const requiredFields = [
      // "journal_id",
      // "portfolio_id",
      "strategy_id",
      "symbol_id",
      "quantity",
      "entry",
      "exit",
      "target",
      "trade_type",
      "commission_percent",
    ];

    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    setErrors(newErrors);
    console.log(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    console.log(formData);

    // const updatedData = new FormData();

    // const fields = [
    //   "journal_id",
    //   "portfolio_id",
    //   "strategy_id",
    //   "symbol_id",
    //   "quantity",
    //   "entry_price",
    //   "exit_price",
    //   "price",
    //   "type",
    //   "trade_date",
    //   "fees",
    //   "confidence_level",
    //   "entry_reason",
    //   "exit_reason",
    //   "notes",
    //   "outcome",
    // ];

    // fields.forEach((field) => {
    //   let current = formData[field];
    //   let original = EditData[field];

    //   if (field === "trade_date") {
    //     current = new Date(current).toISOString();
    //     original = new Date(original).toISOString();
    //   }

    //   if (current !== original) {
    //     updatedData.append(field, current ?? "");
    //   }
    // });

    // if (formData.photo) {
    //   updatedData.append("photo", formData.photo);
    // }
    // for (const [key, value] of updatedData) {
    //   console.log(key, value);
    // }
    submitTradeMutation(formData);

    setErrors({});
  };

  const renderInput = (name, placeholder, type = "text") => (
    <div>
      <label>{placeholder}</label>
      <input
        name={name}
        type={type}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full p-2 border rounded mt-2"
      />
      {errors[name] && <p className="text-sm text-red-600">{errors[name]}</p>}
    </div>
  );

  const DisplayData = {
    journal_id: "Journal",
    margin_type: "Margin",
    portfolio_id: "Portfolio",
    strategy_id: "Strategy",
    symbol_id: "Symbol",
    active_status: "Status",
  };
  const renderSelect = (
    name,
    options,
    labelKey = "name",
    valueKey = "id",
    defaultLabel = "Select"
  ) => (
    <div>
      <label className="">{DisplayData[name] || name}</label>
      <select
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="w-full p-2 border rounded mt-2"
      >
        <option value="" disabled>
          {defaultLabel}
        </option>
        {options.map((item) => (
          <option key={item[valueKey]} value={item[valueKey]}>
            {item[labelKey]}
          </option>
        ))}
      </select>
      {errors[name] && <p className="text-sm text-red-600">{errors[name]}</p>}
    </div>
  );

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen({ show: false, data: null })}
        >
          {/* Overlay */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
          </Transition.Child>

          {/* Modal Panel */}
          <div className="fixed inset-0 flex items-center justify-center p-4 text-gray-200">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-stone-900 rounded-xl shadow-lg max-w-4xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto z-[1002]">
                <Dialog.Title className="text-xl font-semibold">
                  Edit Trade
                </Dialog.Title>

                {/* Dropdowns */}
                <div className="grid grid-cols-3 gap-4">
                  {renderSelect(
                    "journal_id",
                    journals,
                    "title",
                    "id",
                    "Select Journal"
                  )}
                  {renderSelect(
                    "strategy_id",
                    strategies,
                    "name",
                    "id",
                    "Select Strategy"
                  )}
                  {renderSelect(
                    "symbol_id",
                    symbols,
                    "symbol",
                    "id",
                    "Select Symbol"
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {/* {renderSelect(
                    "portfolio_id",
                    portfolios,
                    "name",
                    "id",
                    "Select Portfolio"
                  )} */}

                  {renderInput("entry", "Entry", "number")}
                  {renderInput("exit", "Exit", "number")}
                  {renderInput("target", "Target", "number")}
                  {renderInput("quantity", "Quantity", "number")}
                  {renderSelect(
                    "margin_type",
                    MarginData,
                    "value",
                    "key",
                    "Select Margin"
                  )}

                  {renderInput("commission_percent", "Commission", "number")}

                  <div>
                    <label>Trade type</label>
                    <select
                      name="trade_type"
                      value={formData.trade_type}
                      onChange={handleChange}
                      className="w-full p-2 border rounded mt-2"
                    >
                      <option value="buy">Buy</option>
                      <option value="sell">Sell</option>
                    </select>
                    {errors.trade_type && (
                      <p className="text-sm text-red-600">
                        {errors.trade_type}
                      </p>
                    )}
                  </div>
                  {renderSelect(
                    "active_status",
                    ActiveData,
                    "value",
                    "key",
                    "Select Status"
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setIsOpen({ show: false, data: null });
                      setErrors({});
                    }}
                    className="px-4 py-2 border rounded text-gray-400 hover:text-white hover:!bg-red-700 hover:!outline-red-400 hover:!border-red-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:!bg-green-700 hover:!outline-green-400 hover:!border-green-400"
                  >
                    Save Trade
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default EditExecution;
