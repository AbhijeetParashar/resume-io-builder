# 🚀 Resume.io PDF Downloader

Download your **resume.io** resume as a pixel-perfect, high-quality PDF — with all hyperlinks fully preserved. No watermarks, no sign-up, no tracking.

# 🚀 Live Demo

[![Click Here](https://img.shields.io/badge/Click%20Here-blue?style=for-the-badge)](https://resume-io-download.vercel.app/)

---

## 🚀 Features

- **One-click token fetch** — automatically pulls your rendering token if you're logged into resume.io in the same browser
- **Guided flow** — if automatic fetch fails, a step-by-step modal walks you through copying the token manually
- **Link-preserved PDF** — all URLs in your resume remain clickable in the final PDF
- **3000 px render quality** — crisp output suitable for printing or sharing
- **Multi-resume support** — pick from any resume in your account via a dropdown
- **No dependencies on your end** — paste token → download PDF, done

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm / bun

### Local development

```bash
# Clone the repo
git clone https://github.com/AbhijeetParashar/resume-io-builder.git
cd resume-io-builder

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start
```

---

## 🛠️ How It Works

1. Click **Get My Rendering Token**
2. If you're logged in, the token is auto-populated
3. If not, a modal guides you to open the endpoint in a new tab and copy the token manually
4. Click **Download Resume** — the server fetches the resume images via resume.io's SSR API, assembles a PDF using `pdf-lib`, embeds link annotations, and streams the file back to your browser

---

## 🛠️ Tech Stack

| Layer          | Technology                  |
| -------------- | --------------------------- |
| Framework      | Next.js 16 (App Router)     |
| Styling        | Tailwind CSS v4 + Shadcn UI |
| PDF generation | pdf-lib                     |
| Language       | TypeScript                  |
| Font           | Inter (Google Fonts)        |

---

## 📦 Author ✅

**Abhijeet Kumar**

| Platform    | Link                                                            |
| ----------- | --------------------------------------------------------------- |
| Website     | [iamabhijeet.com](https://www.iamabhijeet.com/)                 |
| GitHub      | [@AbhijeetParashar](https://github.com/AbhijeetParashar)        |
| LinkedIn    | [abhijeetkumar29](https://www.linkedin.com/in/abhijeetkumar29/) |
| X (Twitter) | [@AbhijeetParash7](https://x.com/AbhijeetParash7)               |
| Instagram   | [@bas_kar_avi](https://www.instagram.com/bas_kar_avi/)          |

---
