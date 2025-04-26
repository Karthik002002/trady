import React, { useState } from "react";
import { TbSortDescending, TbSortAscending } from "react-icons/tb";

const ReusableTable = ({ columns, data, height = "max-h-[70vh]" }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    // If same key clicked and currently descending, reset sorting
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      setSortConfig({ key: null, direction: "asc" });
      return;
    }

    // If same key clicked and currently ascending, switch to descending
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    // Set new sort config
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === undefined || bValue === undefined) return 0;

      if (typeof aValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    });
  }, [data, sortConfig]);

  return (
    <div
      className={`overflow-y-auto border rounded ${height} custom-scrollbar`}
    >
      <table className="min-w-full text-sm text-left text-white">
        <thead className="sticky top-0 bg-stone-800 z-10 text-xs uppercase font-semibold border-b">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="px-4 py-2 cursor-pointer select-none"
                onClick={() => col.sortable && handleSort(col.accessor)}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.sortable &&
                    (sortConfig.key === col.accessor ? (
                      sortConfig.direction === "asc" ? (
                        <TbSortAscending size={16} />
                      ) : (
                        <TbSortDescending size={16} />
                      )
                    ) : (
                      <TbSortAscending size={16} className="opacity-30" />
                    ))}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, idx) => (
            <tr key={idx} className="border-b hover:bg-gray-800">
              {columns.map((col) => (
                <td key={col.accessor} className="px-4 py-2">
                  {col.render ? col.render(row) : row[col.accessor] || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReusableTable;
