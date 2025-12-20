"use client"

import { useEffect, useRef, useState } from "react"
import { CgMoreVertical } from "react-icons/cg"

export function TableRowActions({ items, row }) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () =>
            document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div
            className="relative"
            ref={menuRef}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 rounded hover:bg-slate-100"
            >
                <CgMoreVertical className="w-4 h-4" />
            </button>
            {isOpen && (
                <div className="absolute right-0 z-30 w-48 mt-1 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        {items.map((item, index) => {
                            const Icon = item.icon
                            return (
                                <button
                                    key={index}
                                    onClick={() => {
                                        item.onClick(row)
                                        setIsOpen(false)
                                    }}
                                    className="w-full px-4 py-2 text-sm text-left hover:bg-slate-100 flex items-center gap-2"
                                    style={{ color: item.color }}
                                >
                                    {Icon && <Icon className="w-4 h-4" />}
                                    {item.label}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
