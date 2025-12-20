"use client"

import { useState } from "react"

export function Tooltip({ content, children }) {
    const [isVisible, setIsVisible] = useState(false)

    return (
        <div
            className="relative inline-block"
            suppressHydrationWarning={true}
        >
            <div
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
            >
                {children}
            </div>
            {isVisible && (
                <div className="absolute z-20 px-3 py-2 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap -top-10 left-1/2 transform -translate-x-1/2">
                    {content}
                    <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2" />
                </div>
            )}
        </div>
    )
}
