import { Fragment, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";

import { useMutation } from "@tanstack/react-query";
import { APPURL } from "../../../URL";
import { useLocalUserData } from "../queries/UseLocalData";
import { ActiveData, MarginData } from "../common/ComFuncs";

const AddExecution = ({
  journals = [],
  portfolios = [],
  strategies = [],
  symbols = [],
  ReFetch,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    symbol_id: "",
    strategy_id: "",
    user_id: 1,
    entry: "",
    exit: "",
    target: "",
    quantity: "",
    margin_type: "1",
    commission_percent: 0.045,
    active_status: "1",
    trade_type: "buy",
  });
  const [errors, setErrors] = useState({});
  const LocalData = useLocalUserData();

  const inputRef = useRef(null);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file)
      setFormData((prev) => ({
        ...prev,
        photo: file,
        display_file_name: file.name,
      }));
  };
  const submitTrade = async (formData) => {
    const token = LocalData.token;

    const res = await fetch(`${APPURL.execution}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData, // FormData must be passed directly; do NOT set Content-Type manually
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
      setIsOpen(false);

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
      "entry",
      "exit",
      "target",
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

    // const data = new FormData();
    // data.append("journal_id", formData.journal_id);
    // if (formData.portfolio_id !== 0) {
    //   data.append("portfolio_id", formData.portfolio_id);
    // }

    // data.append("strategy_id", formData.strategy_id);
    // data.append("symbol_id", formData.symbol_id);
    // data.append("quantity", formData.quantity);
    // data.append("entry_price", formData.entry_price);
    // data.append("exit_price", formData.exit_price);
    // data.append("price", formData.price);
    // data.append("type", formData.type || "buy");
    // data.append(
    //   "trade_date",
    //   new Date(formData.trade_date).toISOString() || new Date().toISOString()
    // );
    // data.append("fees", formData.fees);
    // data.append("confidence_level", formData.confidence_level);
    // data.append("entry_reason", formData.entry_reason);
    // data.append("exit_reason", formData.exit_reason);
    // data.append("notes", formData.notes);
    // data.append("outcome", formData.outcome || "win");
    // if (formData.photo) data.append("photo", formData.photo);
    // for (const [key, value] of data) {
    //   console.log(key, value, formData[key]);
    // }

    // console.log(formData);
    // return;
    if (!formData.journal_id) {
      delete formData.journal_id;
    }
    if (!formData.confidence_level) {
      delete formData.confidence_level;
    }

    submitTradeMutation(JSON.stringify(formData));

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
    active_status: "Active Status",
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
      <button
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 "
        onClick={() => setIsOpen(true)}
      >
        <FaPlus className="" size={20} />
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(false)}
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
              <Dialog.Panel className="bg-stone-900 rounded-xl shadow-lg max-w-5xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto z-[1002]">
                <Dialog.Title className="text-xl font-semibold">
                  Add Execution
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
                      name="trady_type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full p-2 border rounded mt-2"
                    >
                      <option value="buy">Buy</option>
                      <option value="sell">Sell</option>
                    </select>
                    {errors.type && (
                      <p className="text-sm text-red-600">
                        {errors.trade_type}
                      </p>
                    )}
                  </div>
                  {renderSelect(
                    "active_status",
                    ActiveData,
                    "value",
                    "id",
                    "Select Margin"
                  )}
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 hidden">
                  <div>
                    <label>Trade Date</label>
                    <input
                      type="date"
                      name="trade_date"
                      value={formData.trade_date}
                      onChange={handleChange}
                      className="w-full p-2 border rounded mt-2"
                    />
                    {errors.trade_date && (
                      <p className="text-sm text-red-600">
                        {errors.trade_date}
                      </p>
                    )}
                  </div>
                  {renderInput("fees", "Fees", "number")}
                  {renderInput(
                    "confidence_level",
                    "Confidence Level (1-10)",
                    "number"
                  )}
                  <div>
                    <label>Entry reason</label>
                    <textarea
                      name="entry_reason"
                      value={formData.entry_reason}
                      onChange={handleChange}
                      placeholder="Entry Reason"
                      className="w-full p-2 border rounded mt-2"
                    />
                    {errors.entry_reason && (
                      <p className="text-sm text-red-600">
                        {errors.entry_reason}
                      </p>
                    )}
                  </div>
                </div>

                {/* Date, fees, confidence, entry reason */}
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                </div> */}

                {/* Exit reason, notes, outcome, file */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 hidden">
                  <div>
                    <label>Exit reason</label>
                    <textarea
                      name="exit_reason"
                      value={formData.exit_reason}
                      onChange={handleChange}
                      placeholder="Exit Reason"
                      className="w-full p-2 border rounded mt-2"
                    />
                    {errors.exit_reason && (
                      <p className="text-sm text-red-600">
                        {errors.exit_reason}
                      </p>
                    )}
                  </div>
                  <div>
                    <label>Outcome</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Notes"
                      className="w-full p-2 border rounded mt-2"
                    />
                    {errors.notes && (
                      <p className="text-sm text-red-600">{errors.notes}</p>
                    )}
                  </div>
                  <div>
                    <label>Outcome</label>
                    <select
                      name="outcome"
                      value={formData.outcome}
                      onChange={handleChange}
                      className="w-full p-2 border rounded mt-2"
                    >
                      <option value="win">Win</option>
                      <option value="loss">Loss</option>
                      <option value="neutral">Neutral</option>
                    </select>
                    {errors.outcome && (
                      <p className="text-sm text-red-600">{errors.outcome}</p>
                    )}
                  </div>
                  <div>
                    <label>Trade Reference</label>
                    <div className="flex flex-col space-y-2 mt-2">
                      <label
                        htmlFor="customFileUpload"
                        className="cursor-pointer w-fit px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-500 transition"
                      >
                        Upload Photo
                      </label>
                      <input
                        id="customFileUpload"
                        ref={inputRef}
                        type="file"
                        accept="image/jpg,image/jpeg,image/png"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {formData?.display_file_name && (
                        <span className="text-gray-200 text-sm break-words break-all max-w-[12em] ms-2 overflow-hidden max-h-[3em]">
                          Selected: {formData?.display_file_name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setIsOpen(false);
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

export default AddExecution;
