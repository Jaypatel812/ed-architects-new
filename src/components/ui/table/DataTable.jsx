"use client";

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useMemo, useRef, useState } from "react";

import { cn } from "../../../utils";
import { TableCell } from "./TableCell";
import { TableCheckbox } from "./TableCheckbox";
import { TablePagination } from "./TablePagination";
import { TableRowActions } from "./TableRowActions";

export function DataTable({
  data,
  columns: userColumns,
  showSrNo = false,
  enableRowSelection = false,
  enableActions = false,
  actionItems = [],
  enableStriped = true,
  globalFilter = "",
  useVirtualScroll = false,
  height = 400,
  enablePagination = true,
  pageSize = 10,
  onRowSelectionChange,
  onRowClick = () => {},
  pagination,
  onPaginationChange,
}) {
  const tableContainerRef = useRef(null);

  const [internalPagination, setInternalPagination] = useState({
    pageIndex: 0,
    pageSize: useVirtualScroll ? data.length : pageSize,
  });

  const finalPagination = pagination ?? internalPagination;
  const finalOnPaginationChange = onPaginationChange ?? setInternalPagination;

  const columns = useMemo(() => {
    const cols = [];

    if (showSrNo) {
      cols.push({
        id: "srNo",
        header: "Sr. No",
        cell: ({ row }) => row.index + 1,
        width: 70,
        align: "center",
      });
    }

    if (enableRowSelection) {
      cols.push({
        id: "select",
        header: ({ table }) => (
          <TableCheckbox
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <TableCheckbox
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        width: 50,
        align: "center",
      });
    }

    cols.push(...userColumns);

    if (enableActions) {
      cols.push({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <TableRowActions items={actionItems} row={row.original} />
        ),
        width: 100,
        align: "center",
      });
    }

    return cols;
  }, [userColumns, showSrNo, enableRowSelection, enableActions, actionItems]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
      pagination: finalPagination,
    },
    onPaginationChange: finalOnPaginationChange,
    enableRowSelection,
    autoResetPageIndex: false, // Prevent page reset on data refresh
    autoResetGlobalFilter: false, // Prevent search reset on data refresh
  });

  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 100,
    overscan: 3,
    paddingEnd: 0,
    paddingStart: 0,
  });

  const virtualRows = useVirtualScroll
    ? rowVirtualizer.getVirtualItems()
    : null;

  const totalSize = virtualRows?.length ? rowVirtualizer.getTotalSize() : 0;

  const paddingTop = virtualRows?.length ? virtualRows[0].start : 0;
  const paddingBottom = virtualRows?.length
    ? Math.max(0, totalSize - virtualRows[virtualRows.length - 1].end)
    : 0;

  return (
    <div className="w-full">
      <div
        ref={tableContainerRef}
        className={cn(
          "relative w-full overflow-auto border border-slate-200 rounded-lg",
          useVirtualScroll && "border-slate-200"
        )}
        style={
          useVirtualScroll
            ? {
                height: typeof height === "number" ? `${height}px` : height,
              }
            : undefined
        }
      >
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    cell={header}
                    row={header.getContext().row}
                    isHeader
                  />
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {virtualRows ? (
              <>
                {paddingTop > 0 && (
                  <tr>
                    <td
                      style={{
                        height: `${paddingTop}px`,
                      }}
                    />
                  </tr>
                )}
                {virtualRows.length > 0 ? (
                  virtualRows.map((virtualRow) => {
                    const row = rows[virtualRow.index];
                    return (
                      <tr
                        key={row.id}
                        data-index={virtualRow.index}
                        ref={rowVirtualizer.measureElement}
                        className={cn(
                          enableStriped &&
                            virtualRow.index % 2 === 0 &&
                            "bg-zinc-50",
                          "hover:bg-slate-200/50"
                        )}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} cell={cell} row={row} />
                        ))}
                      </tr>
                    );
                  })
                ) : (
                  <tr className="border-b border-gray-200 bg-white hover:bg-gray-50">
                    <td
                      colSpan={columns.length}
                      className="h-24 text-center font-medium text-gray-500"
                    >
                      No results found.
                    </td>
                  </tr>
                )}
                {paddingBottom > 0 && (
                  <tr>
                    <td
                      style={{
                        height: `${paddingBottom}px`,
                      }}
                    />
                  </tr>
                )}
              </>
            ) : rows.length > 0 ? (
              table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row.original, row.index)}
                  className={cn(
                    enableStriped && i % 2 === 0 && "bg-zinc-50",
                    "hover:bg-slate-200/50"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} cell={cell} row={row} />
                  ))}
                </tr>
              ))
            ) : (
              <tr className="border-b border-gray-200 bg-white hover:bg-gray-50">
                <td
                  colSpan={columns.length}
                  className="h-24 text-center font-medium text-gray-500"
                >
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {!useVirtualScroll && enablePagination && (
        <TablePagination table={table} />
      )}
    </div>
  );
}
