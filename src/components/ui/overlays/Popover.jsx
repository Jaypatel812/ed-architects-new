"use client"

import { cn } from "@/utils"
import React, { useEffect, useRef, useState } from "react"

export default function Popover({
    children,
    trigger,
    handlePopoverClose,
    popOverStyle
}) {
    const [isOpen, setIsOpen] = useState(false)
    const popoverRef = useRef(null)
    const triggerRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    useEffect(() => {
        if (isOpen) {
            positionPopover()
        }
    }, [isOpen])

    // const positionPopover = () => {
    //     if (!popoverRef.current || !triggerRef.current) return

    //     const triggerRect = triggerRef.current.getBoundingClientRect()
    //     const popoverRect = popoverRef.current.getBoundingClientRect()
    //     const viewportWidth = window.innerWidth

    //     let left = triggerRect.left
    //     const top = triggerRect.bottom + window.scrollY

    //     // Check if popover goes beyond right edge of viewport
    //     if (left + popoverRect.width > viewportWidth) {
    //         left = viewportWidth - popoverRect.width - 10 // 10px padding
    //     }

    //     popoverRef.current.style.top = `${top}px`
    //     popoverRef.current.style.left = `${left}px`
    // }

    const togglePopover = () => {
        if (!handlePopoverClose) {
            setIsOpen(!isOpen)
        }
    }

    return (
        <>
            <div
                ref={triggerRef}
                onClick={togglePopover}
                className={cn("w-12 relative h-12", popOverStyle)}
            >
                {trigger}
                {!handlePopoverClose && isOpen && (
                    <div
                        ref={popoverRef}
                        className="sticky z-50 bg-white border border-gray-200 rounded-md shadow-lg p-4 min-w-[200px]"
                        aria-modal="true"
                        role="dialog"
                    >
                        {children}
                    </div>
                )}
            </div>
        </>
    )
}
