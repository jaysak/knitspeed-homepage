import { useState } from "react";

export default function MobileDisclosure({
  title,
  defaultOpen = false,
  children,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 shadow-sm">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:hidden"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
      >
        <span className="text-sm font-semibold uppercase tracking-wide text-slate-900">
          {title}
        </span>

        <span className="text-lg leading-none text-slate-500">
          {isOpen ? "−" : "+"}
        </span>
      </button>

      <div className={isOpen ? "block md:block" : "hidden md:block"}>
        <div className="px-5 pb-5 pt-0 md:p-0">
          {children}
        </div>
      </div>
    </section>
  );
}
