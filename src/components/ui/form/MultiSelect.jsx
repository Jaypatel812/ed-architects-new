import React, { useEffect, useRef, useState } from "react"

export default function MultiSelect({ options, onChange, value, placeholder = "Select options", className = "" }) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedOptions, setSelectedOptions] = useState([])
    const dropdownRef = useRef(null)

    const normalizedOptions = options?.map((opt) =>
        typeof opt === "string" ? { value: opt, label: opt } : opt
    )

    const isAllSelected = selectedOptions.length === normalizedOptions.length

    const toggleOption = (option) => {
        const exists = selectedOptions.some((item) => item.value === option.value)
        const updatedSelection = exists
            ? selectedOptions.filter((item) => item.value !== option.value)
            : [...selectedOptions, option]
        setSelectedOptions(updatedSelection)
        onChange(updatedSelection)
    }

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedOptions([])
            onChange([])
        } else {
            setSelectedOptions(normalizedOptions)
            onChange(normalizedOptions)
        }
    }

    const renderValue = () => {
        return isAllSelected
            ? "All " + placeholder
            : selectedOptions.length > 0
                ? selectedOptions.length === 1
                    ? selectedOptions[0].label
                    : `${selectedOptions.length} items selected`
                : "Select " + placeholder
    }

    useEffect(() => {
        if (Array.isArray(value)) {
            setSelectedOptions(
                value
                    .map((val) =>
                        normalizedOptions.find(
                            (opt) => opt.value === val || opt.value === val.value
                        )
                    )
                    .filter((opt) => opt !== undefined)
            )
        }
    }, [value, options])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <div className={`relative w-full ${className}`} ref={dropdownRef}>
            <div
                className={`w-full p-2 border border-gray-300 rounded-md bg-white cursor-pointer flex items-center justify-between ${selectedOptions.length === 0 ? "text-gray-400" : "text-gray-700"
                    }`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{renderValue()}</span>
                <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>
            {isOpen && (
                <div className="absolute z-[999] w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-52 overflow-y-auto">
                    {/* Select All option */}
                    <div
                        className="w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={toggleSelectAll}
                    >
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox h-3 w-3 text-blue-600"
                                checked={isAllSelected}
                                readOnly
                            />
                            <span className="ml-2 text-gray-700">
                                Select All
                            </span>
                        </div>
                    </div>
                    <hr className="my-1" />
                    {normalizedOptions.map((option) => (
                        <div
                            key={option.value}
                            className="w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => toggleOption(option)}
                        >
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-3 w-3 text-blue-600"
                                    checked={selectedOptions.some((item) => item.value === option.value)}
                                    readOnly
                                />
                                <span className="ml-2 text-gray-700">{option.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
