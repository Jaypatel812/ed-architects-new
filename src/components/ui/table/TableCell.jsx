"use client"

import { flexRender } from "@tanstack/react-table"

import { cn } from "../../../utils"
import { Tooltip } from "../overlays/ToolTip"

export function TableCell({ cell, row, isHeader = false }) {
    const col = cell.column.columnDef
    const width = col.width
    const minWidth = col.minWidth || 100
    const align = col.align || "left"
    const tooltip = !isHeader && col.tooltip?.(row.original)

    const content = flexRender(
        isHeader ? cell.column.columnDef.header : cell.column.columnDef.cell,
        cell.getContext()
    )

    const cellContent = tooltip ? (
        <Tooltip content={tooltip}>
            <div>{content}</div>
        </Tooltip>
    ) : (
        content
    )

    const commonStyles = {
        width: width ? `${width}px` : undefined,
        minWidth: `${minWidth}px`
    }

    const commonClasses = cn(
        "px-4 py-3 border-b border-slate-200",
        align === "center" && "text-center",
        align === "right" && "text-right"
    )

    if (isHeader) {
        return (
            <th
                style={commonStyles}
                className={cn(
                    commonClasses,
                    "font-normal text-xs text-left text-slate-700 bg-slate-100"
                )}
            >
                {cellContent}
            </th>
        )
    }

    return (
        <td
            style={commonStyles}
            className={cn(commonClasses, "text-sm text-slate-900")}
        >
            {cellContent}
        </td>
    )
}
