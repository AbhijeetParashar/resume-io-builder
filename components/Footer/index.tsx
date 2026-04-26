import { SOCIAL } from "@/constants";

export function Footer() {
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
