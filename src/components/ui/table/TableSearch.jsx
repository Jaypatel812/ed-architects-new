import { Search } from "lucide-react"

export function TableSearch({ value, onChange, placeholder = "Search..." }) {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="h-10 w-full rounded-md border border-slate-200 bg-white pl-10 pr-4 text-sm placeholder:text-gray-500 focus:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-300"
            />
        </div>
    )
}
