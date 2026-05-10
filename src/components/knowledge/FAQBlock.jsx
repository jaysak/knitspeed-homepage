export default function FAQBlock({ title = "FAQ", items = [] }) {
  if (!items.length) return null;

  return (
    <section aria-labelledby="knowledge-faq-heading">
      <h2 id="knowledge-faq-heading" className="text-2xl font-extrabold text-slate-900">
        {title}
      </h2>
      <div className="mt-5 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {items.map((item) => (
          <details key={item.question} className="group p-5">
            <summary className="cursor-pointer list-none text-base font-bold text-slate-900">
              {item.question}
            </summary>
            <div className="mt-3 text-sm leading-6 text-slate-600">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
