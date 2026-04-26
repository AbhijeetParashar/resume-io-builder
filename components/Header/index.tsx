import { FileDown } from "lucide-react";

export function Header() {
  return (
    <header
      className="sticky top-0 z-20 w-full border-b h-14"
      style={{
        background: "rgba(255,251,245,0.92)",
        backdropFilter: "blur(16px)",
        borderColor: "rgba(249,115,22,0.12)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full grid grid-cols-3 items-center">
        {/* LEFT: AK monogram */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, #f97316 0%, #c2410c 100%)",
            }}
          >
            <span className="text-xs font-black text-white tracking-tight">
              AK
            </span>
          </div>
          <a
            href="https://www.iamabhijeet.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-stone-600 hover:text-orange-500 transition-colors hidden sm:block"
          >
            Abhijeet Kumar
          </a>
        </div>

        {/* CENTER: App title */}
        <div className="flex items-center justify-center gap-2">
          <FileDown className="w-4 h-4 text-stone-400 shrink-0" />
          <span className="text-sm font-bold tracking-tight text-stone-800 whitespace-nowrap">
            Resume
            <span
              className="font-black"
              style={{
                background: "linear-gradient(135deg, #f97316 0%, #c2410c 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              .io
            </span>{" "}
            PDF
          </span>
        </div>

        {/* RIGHT: Nav links */}
        <nav className="flex items-center justify-end gap-4 text-xs text-stone-400">
          <a
            href="https://resume.io/app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-stone-700 transition-colors hidden sm:block"
          >
            Resume.io
          </a>
          <a
            href="https://github.com/AbhijeetParashar/resume-io-builder"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-stone-700 transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
