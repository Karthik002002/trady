import React from "react";
import ReusableModal from "../common/ReusableModal";

export default function ViewReal({ ModalData, show, handleShow }) {
  return (
    <ReusableModal
      isOpen={show}
      handleClose={() => {
        if (handleShow) {
          handleShow();
        }
      }}
    >
      <div className="min-h-[80vh] w-full bg-stone-900 rounded-2xl p-6 flex flex-col md:flex-row gap-6">
        {/* Left side: Image */}
        <div className="flex-1 flex justify-center items-center">
          {ModalData?.photo ? (
            <img
              src={ModalData.photo}
              alt="Trade Photo"
              className="max-w-full max-h-[400px] rounded-lg object-contain"
            />
          ) : (
            <div className="text-white text-center">No Image Available</div>
          )}
        </div>

        {/* Right side: Key-Value Details */}
        <div className="flex-1 grid grid-cols-2 gap-2">
          {[
            { label: "Type", value: ModalData?.type },
            { label: "Quantity", value: ModalData?.quantity },
            { label: "Outcome", value: ModalData?.outcome },
            { label: "Entry Price", value: ModalData?.entry_price },
            { label: "Exit Price", value: ModalData?.exit_price },
            { label: "P/L", value: ModalData?.pl },
            { label: "Confidence Level", value: ModalData?.confidence_level },
            { label: "Entry Reason", value: ModalData?.entry_reason },
            { label: "Exit Reason", value: ModalData?.exit_reason },
            { label: "Symbol", value: ModalData?.symbol_display },
            { label: "Strategy", value: ModalData?.strategy_display },
            { label: "Portfolio", value: ModalData?.portfolio_display },
          ].map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b border-gray-700  text-white"
            >
              <span className="font-semibold text-gray-200 bg-stone-700 px-3 w-[50%] rounded-lg py-2">
                {item.label}
              </span>
              <span className="px-3 w-[50%] text-right">
                {item.value !== null && item.value !== undefined
                  ? item.value
                  : "-"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ReusableModal>
  );
}
