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
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GuideModal } from "@/components/GuideModal";
import { FEATURES } from "@/constants";

const TOKEN_REGEX = /^[a-zA-Z0-9]{24}$/;

interface Resume {
  id: number;
  name: string;
  renderingToken: string;
  template: string;
}

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
