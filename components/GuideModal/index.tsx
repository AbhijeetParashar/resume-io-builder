import { Key, X, Sparkles, ExternalLink } from "lucide-react";

interface GuideModalProps {
  onOpen: () => void;
  onClose: () => void;
}

export function GuideModal({ onOpen, onClose }: GuideModalProps) {
  const steps = [
    { n: "1", text: <>Click <strong className="text-stone-900 font-semibold">Open Resume.io</strong> below</> },
    { n: "2", text: "A new tab opens with your resume data in JSON format" },
    {
      n: "3",
      text: (
        <>
          Find the{" "}
          <code
            className="font-mono text-[11px] px-1.5 py-0.5 rounded"
            style={{ background: "rgba(249,115,22,0.1)", color: "#c2410c" }}
          >
            renderingToken
          </code>{" "}
          field in the JSON
        </>
      ),
    },
    { n: "4", text: "Copy the 24-character value and paste it in the input box" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border p-8"
        style={{
          background: "white",
          borderColor: "rgba(249,115,22,0.25)",
          boxShadow:
            "0 40px 100px rgba(0,0,0,0.12), 0 0 0 1px rgba(249,115,22,0.08), 0 4px 16px rgba(249,115,22,0.06)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-800 transition-all"
          style={{ background: "transparent" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f4")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
          style={{
            background: "linear-gradient(135deg, rgba(249,115,22,0.12) 0%, rgba(194,65,12,0.12) 100%)",
            border: "1px solid rgba(249,115,22,0.25)",
          }}
        >
          <Key className="w-5 h-5 text-orange-500" />
        </div>

        {/* Header */}
        <h2 className="text-xl font-bold text-stone-900 mb-1">
          Login to Resume.io first
        </h2>
        <p className="text-sm text-stone-500 leading-relaxed mb-6">
          We couldn&apos;t fetch your token automatically. You need to be{" "}
          <a
            href="https://resume.io/app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-600 underline underline-offset-2 transition-colors"
          >
            logged into Resume.io
          </a>{" "}
          in this browser. Follow the steps below to grab it manually.
        </p>

        {/* Steps */}
        <div className="space-y-3 mb-8">
          {steps.map(({ n, text }) => (
            <div key={n} className="flex items-start gap-3">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-orange-700 mt-0.5"
                style={{
                  background: "rgba(249,115,22,0.1)",
                  border: "1px solid rgba(249,115,22,0.3)",
                }}
              >
                {n}
              </span>
              <span className="text-sm text-stone-600 leading-relaxed">{text}</span>
            </div>
          ))}
        </div>

        {/* Tip */}
        <div
          className="flex items-start gap-2.5 rounded-xl px-4 py-3 mb-6"
          style={{
            background: "rgba(251,191,36,0.07)",
            border: "1px solid rgba(251,191,36,0.25)",
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-stone-500 leading-relaxed">
            <span className="text-amber-600 font-semibold">Tip: </span>
            Chrome &amp; Firefox automatically pretty-print the JSON — the token is easy to spot.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onOpen}
            className="relative flex-1 h-11 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 overflow-hidden transition-all active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #f97316 0%, #c2410c 100%)",
              boxShadow: "0 4px 24px rgba(249,115,22,0.35)",
            }}
          >
            <span
              className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)" }}
            />
            <ExternalLink className="w-4 h-4 relative" />
            <span className="relative">Open Resume.io</span>
          </button>
          <button
            onClick={onClose}
            className="h-11 px-5 rounded-xl text-sm text-stone-500 font-medium transition-all"
            style={{ border: "1px solid #e7e5e4", background: "transparent" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f5f5f4";
              e.currentTarget.style.color = "#1c1917";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#78716c";
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
