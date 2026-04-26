import { Link2, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { GitHubSvg, LinkedInSvg, XSvg, InstagramSvg } from "@/assets/icons";

export const FEATURES = [
  { Icon: Link2,       text: "All hyperlinks preserved in the final PDF" },
  { Icon: Sparkles,    text: "Crystal-clear 3000 px render quality" },
  { Icon: Zap,         text: "Done in under 30 seconds" },
  { Icon: ShieldCheck, text: "No watermarks · No sign-up · No tracking" },
];

export const SOCIAL = [
  { label: "GitHub",    href: "https://github.com/AbhijeetParashar",                Icon: GitHubSvg },
  { label: "LinkedIn",  href: "https://www.linkedin.com/in/abhijeetkumar29/",       Icon: LinkedInSvg },
  { label: "X",         href: "https://x.com/AbhijeetParash7",                      Icon: XSvg },
  { label: "Instagram", href: "https://www.instagram.com/bas_kar_avi/",             Icon: InstagramSvg },
];
