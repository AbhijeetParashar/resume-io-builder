"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  FileDown,
  Loader2,
  AlertCircle,
  Key,
  RefreshCw,
  ChevronDown,
  ExternalLink,
  Link2,
  Sparkles,
  Zap,
  ShieldCheck,
  X,
} from "lucide-react";

const TOKEN_REGEX = /^[a-zA-Z0-9]{24}$/;

interface Resume {
  id: number;
  name: string;
  renderingToken: string;
  template: string;
}

/* ── Social icons (inline SVG) ──────────────────────────────── */

const GitHubSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedInSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const XSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

/* ── Feature items ───────────────────────────────────────────── */

const FEATURES = [
  { Icon: Link2,       text: "All hyperlinks preserved in the final PDF" },
  { Icon: Sparkles,    text: "Crystal-clear 3000 px render quality" },
  { Icon: Zap,         text: "Done in under 30 seconds" },
  { Icon: ShieldCheck, text: "No watermarks · No sign-up · No tracking" },
];

const SOCIAL = [
  { label: "GitHub",    href: "https://github.com/AbhijeetParashar",                Icon: GitHubSvg },
  { label: "LinkedIn",  href: "https://www.linkedin.com/in/abhijeetkumar29/",       Icon: LinkedInSvg },
  { label: "X",         href: "https://x.com/AbhijeetParash7",                      Icon: XSvg },
  { label: "Instagram", href: "https://www.instagram.com/bas_kar_avi/",             Icon: InstagramSvg },
];

/* ── Main Page ───────────────────────────────────────────────── */

export default function Home() {
  const [token, setToken]           = useState("");
  const [resumes, setResumes]       = useState<Resume[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [fetching, setFetching]     = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [uiState, setUiState]       = useState<"idle" | "guide" | "error">("idle");
  const [errorMsg, setErrorMsg]     = useState("");
  const [showGuideModal, setShowGuideModal] = useState(false);

  const hasValidToken = TOKEN_REGEX.test(token.trim());

  async function getToken() {
    setFetching(true);
    setUiState("idle");
    setErrorMsg("");
    try {
      const res = await fetch("https://resume.io/api/app/resumes", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (res.status === 401 || res.status === 403) {
        setShowGuideModal(true);
        return;
      }
      if (!res.ok) {
        setErrorMsg(`resume.io returned ${res.status}. Please try again.`);
        setUiState("error");
        return;
      }

      const data = await res.json();
      const list: Resume[] = data.resumes ?? [];
      if (list.length === 0) {
        setErrorMsg("No resumes found in your account.");
        setUiState("error");
        return;
      }

      setResumes(list);
      setSelectedId(list[0].id);
      setToken(list[0].renderingToken);
    } catch {
      setShowGuideModal(true);
    } finally {
      setFetching(false);
    }
  }

  function handleResumeChange(id: number) {
    const r = resumes.find((r) => r.id === id);
    if (r) { setSelectedId(id); setToken(r.renderingToken); }
  }

  async function downloadPdf() {
    if (!hasValidToken) return;
    setDownloading(true);
    setUiState("idle");
    setErrorMsg("");
    try {
      const res = await fetch(
        `/api/download/${token.trim()}?image_size=3000&extension=jpeg`,
        { method: "POST" }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Failed: ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      Object.assign(document.createElement("a"), { href: url, download: `resume-${token.trim()}.pdf` }).click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Download failed. Please try again.");
      setUiState("error");
    } finally {
      setDownloading(false);
    }
  }

  function openResumeTab() {
    window.open("https://resume.io/api/app/resumes", "_blank", "noopener,noreferrer");
    setShowGuideModal(false);
    setUiState("guide");
  }

  return (
    <div
      className="min-h-screen font-(family-name:--font-inter) flex flex-col"
      style={{
        background:
          "radial-gradient(ellipse at 15% 25%, rgba(249,115,22,0.1) 0%, transparent 50%)," +
          "radial-gradient(ellipse at 85% 75%, rgba(251,191,36,0.07) 0%, transparent 50%)," +
          "#fffbf5",
        color: "#1c1917",
      }}
    >
      <Header />

      <main className="flex-1 flex items-center">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-0 grid lg:grid-cols-2 gap-12 lg:gap-20 lg:min-h-[calc(100svh-56px-61px)] items-center">

          {/* ── LEFT: Brand ── */}
          <div className="order-2 lg:order-1 space-y-8">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5"
              style={{
                background: "rgba(249,115,22,0.08)",
                border: "1px solid rgba(249,115,22,0.25)",
              }}
            >
              <Sparkles className="w-3 h-3 text-orange-500" />
              <span className="text-xs font-semibold text-orange-700 tracking-wide">
                Free · Open Source
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <h1 className="text-[2.75rem] sm:text-5xl font-extrabold tracking-tight leading-[1.1] text-stone-900">
                Download your
              </h1>
              <h1
                className="text-[2.75rem] sm:text-5xl font-extrabold tracking-tight leading-[1.1]"
                style={{
                  background: "linear-gradient(135deg, #f97316 0%, #c2410c 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                resume.io
              </h1>
              <h1 className="text-[2.75rem] sm:text-5xl font-extrabold tracking-tight leading-[1.1] text-stone-900">
                as a perfect PDF
              </h1>
            </div>

            <p className="text-stone-500 text-base leading-relaxed max-w-85">
              Fetch your rendering token with one click and get a pixel-perfect PDF with all
              your links fully intact — no sign-up needed.
            </p>

            {/* Feature list */}
            <div className="space-y-3 pt-1">
              {FEATURES.map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-3.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(249,115,22,0.08)",
                      border: "1px solid rgba(249,115,22,0.2)",
                    }}
                  >
                    <Icon className="w-3.75 h-3.75 text-orange-500" />
                  </div>
                  <span className="text-sm text-stone-600">{text}</span>
                </div>
              ))}
            </div>

            {/* Decorative divider */}
            <div className="w-16 h-px" style={{ background: "linear-gradient(90deg, #f97316, transparent)" }} />
          </div>

          {/* ── RIGHT: Form card ── */}
          <div className="order-1 lg:order-2">
            <div
              className="rounded-2xl border p-6 sm:p-8"
              style={{
                background: "white",
                borderColor: "rgba(249,115,22,0.15)",
                boxShadow:
                  "0 20px 60px rgba(249,115,22,0.08), 0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
              }}
            >
              {/* Card heading */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-stone-900">Get your PDF</h2>
                <p className="text-sm text-stone-400 mt-1">
                  Fetch your token automatically or paste it manually.
                </p>
              </div>

              <div className="space-y-4">
                {/* Resume picker (multiple resumes) */}
                {resumes.length > 1 && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">
                      Select resume
                    </label>
                    <div className="relative">
                      <select
                        value={selectedId ?? ""}
                        onChange={(e) => handleResumeChange(Number(e.target.value))}
                        className="w-full appearance-none rounded-xl border px-4 py-2.5 pr-10 text-sm text-stone-800 focus:outline-none transition-colors"
                        style={{
                          background: "#fafaf9",
                          borderColor: "rgba(249,115,22,0.18)",
                        }}
                      >
                        {resumes.map((r) => (
                          <option key={r.id} value={r.id} style={{ background: "white" }}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    </div>
                  </div>
                )}

                {/* Token input */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">
                    Rendering token
                  </label>
                  <div className="relative">
                    <input
                      value={token}
                      onChange={(e) => {
                        setToken(e.target.value);
                        setUiState("idle");
                        setErrorMsg("");
                        if (resumes.length > 0) setResumes([]);
                      }}
                      onKeyDown={(e) => {
                        if (e.key !== "Enter") return;
                        if (hasValidToken) downloadPdf(); else getToken();
                      }}
                      placeholder="24-character alphanumeric token"
                      maxLength={24}
                      spellCheck={false}
                      autoComplete="off"
                      className={cn(
                        "w-full h-12 rounded-xl border px-4 pr-14 text-sm font-mono text-stone-800 outline-none transition-all",
                        "placeholder:text-stone-300"
                      )}
                      style={{
                        background: "#fafaf9",
                        borderColor: hasValidToken
                          ? "rgba(249,115,22,0.5)"
                          : "rgba(249,115,22,0.15)",
                        boxShadow: hasValidToken
                          ? "0 0 0 3px rgba(249,115,22,0.1)"
                          : "none",
                      }}
                    />
                    <span
                      className={cn(
                        "absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono tabular-nums select-none",
                        token.length === 24
                          ? hasValidToken ? "text-orange-500" : "text-red-500"
                          : "text-stone-300"
                      )}
                    >
                      {token.length}/24
                    </span>
                  </div>
                </div>

                {/* Guide banner */}
                {uiState === "guide" && (
                  <div
                    className="rounded-xl border p-4 space-y-2"
                    style={{
                      background: "rgba(249,115,22,0.05)",
                      borderColor: "rgba(249,115,22,0.2)",
                    }}
                  >
                    <p className="text-sm font-semibold text-orange-700">
                      ⚡ A new tab opened with your resume data
                    </p>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      Find the{" "}
                      <code
                        className="font-mono text-[11px] px-1 py-0.5 rounded"
                        style={{ background: "rgba(249,115,22,0.1)", color: "#c2410c" }}
                      >
                        renderingToken
                      </code>{" "}
                      field and paste the 24-character value in the box above.
                    </p>
                    <button
                      onClick={() => window.open("https://resume.io/api/app/resumes", "_blank", "noopener,noreferrer")}
                      className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-600 transition-colors mt-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Open resume.io data again
                    </button>
                  </div>
                )}

                {/* Error banner */}
                {uiState === "error" && errorMsg && (
                  <div
                    className="flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm text-red-600"
                    style={{ background: "rgba(220,38,38,0.05)", borderColor: "rgba(220,38,38,0.15)" }}
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{errorMsg}</p>
                  </div>
                )}

                {/* CTA button */}
                <button
                  onClick={hasValidToken ? downloadPdf : getToken}
                  disabled={fetching || downloading}
                  className="relative w-full h-12 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
                  style={
                    fetching || downloading
                      ? { background: "rgba(249,115,22,0.4)" }
                      : {
                          background: "linear-gradient(135deg, #f97316 0%, #c2410c 100%)",
                          boxShadow: "0 4px 24px rgba(249,115,22,0.35), 0 1px 0 rgba(255,255,255,0.15) inset",
                        }
                  }
                >
                  {/* Shine layer */}
                  {!fetching && !downloading && (
                    <span
                      className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)" }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    {fetching ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Fetching token…</>
                    ) : downloading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Generating PDF…</>
                    ) : hasValidToken ? (
                      <><FileDown className="w-4 h-4" /> Download Resume</>
                    ) : (
                      <><Key className="w-4 h-4" /> Get My Rendering Token</>
                    )}
                  </span>
                </button>

                {/* Re-fetch */}
                {(hasValidToken || resumes.length > 0) && (
                  <button
                    onClick={getToken}
                    disabled={fetching}
                    className="w-full flex items-center justify-center gap-1.5 text-xs text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Re-fetch token from resume.io
                  </button>
                )}
              </div>

              {/* Card footer note */}
              <p className="mt-6 text-xs text-stone-400 text-center leading-relaxed">
                Make sure you are{" "}
                <a
                  href="https://resume.io/app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-600 underline underline-offset-2 transition-colors"
                >
                  logged into resume.io
                </a>{" "}
                in this browser before clicking the button.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />

      {showGuideModal && (
        <GuideModal
          onOpen={openResumeTab}
          onClose={() => setShowGuideModal(false)}
        />
      )}
    </div>
  );
}

/* ── Header ──────────────────────────────────────────────────── */

function Header() {
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
            style={{ background: "linear-gradient(135deg, #f97316 0%, #c2410c 100%)" }}
          >
            <span className="text-xs font-black text-white tracking-tight">AK</span>
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
            </span>
            {" "}PDF
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
            resume.io
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

/* ── Guide Modal ─────────────────────────────────────────────── */

function GuideModal({ onOpen, onClose }: { onOpen: () => void; onClose: () => void }) {
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

/* ── Footer ──────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer
      className="border-t"
      style={{
        borderColor: "rgba(249,115,22,0.1)",
        background: "rgba(255,251,245,0.8)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-stone-400">
          © {new Date().getFullYear()}{" "}
          <span className="text-stone-600 font-semibold">Abhijeet Kumar</span>
          <span className="text-stone-300 mx-1.5">·</span>
          All rights reserved
        </p>

        <div className="flex items-center gap-5">
          {SOCIAL.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-stone-400 hover:text-orange-500 transition-all duration-200 hover:scale-110"
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
