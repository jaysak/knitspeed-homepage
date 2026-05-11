export default function KnowledgeWatermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-6 top-24 z-0 hidden xl:block"
    >
      <img
        src="/branding/knitspeed-watermark.png"
        alt=""
        className="w-[220px] opacity-[0.045] select-none"
      />
    </div>
  );
}
