import { cn } from "../../../utils"

export function TableCheckbox({ checked, onChange, className }) {
    return (
        <div className="flex items-center justify-center">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className={cn(
                    "h-4 w-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900",
                    className
                )}
            />
        </div>
    )
}
