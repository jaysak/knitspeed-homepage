import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function CollapsibleInsightSection({
  title,
  children,
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-slate-50"
      >
        <span className="text-sm font-semibold text-slate-700">
          {title}
        </span>

        <ChevronDown
          size={18}
          className={
            "transition-transform duration-200 " +
            (open ? "rotate-180" : "")
          }
        />
      </button>

      {open ? <div className="border-t border-slate-100 p-4">{children}</div> : null}
    </div>
  );
}
