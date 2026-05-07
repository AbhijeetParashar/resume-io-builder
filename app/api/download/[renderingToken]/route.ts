import { PDFDocument, PDFName, PDFString, PDFArray, PDFRef } from "pdf-lib";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/136.0.0.0 Safari/537.36";

const METADATA_URL =
  "https://ssr.resume.tools/meta/{token}?cache={cache}";

// width=1800 returns native 1800×2329 px JPEG (~211 DPI); width≥2400 falls back to placeholder
const IMAGE_URL_HI =
  "https://ssr.resume.tools/to-image/{token}-{page}.jpeg?cache={cache}&image_size=3000&width=1800";

// Fallback without width — SSR may only have width=1800 cached for page 1
const IMAGE_URL_LO =
  "https://ssr.resume.tools/to-image/{token}-{page}.jpeg?cache={cache}&image_size=3000";

// Images smaller than this are ssr.resume.tools placeholder tiles, not real pages
const PLACEHOLDER_THRESHOLD_BYTES = 15_000;

// Safety cap so we never loop forever on a malformed token
const MAX_PAGES = 20;

interface PageLink {
  url: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface PageMeta {
  viewport: { width: number; height: number };
  links?: PageLink[];
}

const DEFAULT_VIEWPORT = { width: 612, height: 792 };

function getCacheDate(): string {
  return new Date().toISOString().slice(0, 13) + "Z";
}

async function resumeFetch(url: string): Promise<Response> {
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) {
    throw new Error(`resume.io fetch failed: ${res.status} ${res.statusText}`);
  }
  return res;
}

function buildImageUrl(template: string, renderingToken: string, pageNumber: number, cache: string): string {
  return template
    .replace("{token}", renderingToken)
    .replace("{page}", String(pageNumber))
    .replace("{cache}", cache);
}

async function fetchImageBytes(
  renderingToken: string,
  pageNumber: number,
  cache: string
): Promise<Uint8Array> {
  const hiBytes = new Uint8Array(
    await (await resumeFetch(buildImageUrl(IMAGE_URL_HI, renderingToken, pageNumber, cache))).arrayBuffer()
  );
  if (hiBytes.length >= PLACEHOLDER_THRESHOLD_BYTES) return hiBytes;

  // width=1800 may not be cached for pages beyond page 1 — fall back to default width
  return new Uint8Array(
    await (await resumeFetch(buildImageUrl(IMAGE_URL_LO, renderingToken, pageNumber, cache))).arrayBuffer()
  );
}

async function normalizeToJpeg(imgBytes: Uint8Array): Promise<Uint8Array> {
  const isWebP =
    imgBytes[0] === 0x52 && imgBytes[1] === 0x49 &&
    imgBytes[2] === 0x46 && imgBytes[3] === 0x46 &&
    imgBytes[8] === 0x57 && imgBytes[9] === 0x45 &&
    imgBytes[10] === 0x42 && imgBytes[11] === 0x50;

  if (isWebP) {
    return new Uint8Array(
      await sharp(imgBytes).jpeg({ quality: 97 }).toBuffer()
    );
  }
  return imgBytes;
}

async function buildPdf(renderingToken: string): Promise<Uint8Array> {
  const cache = getCacheDate();

  const metaRes = await resumeFetch(
    METADATA_URL.replace("{token}", renderingToken).replace("{cache}", cache)
  );
  const metaJson: { pages: PageMeta[] } = await metaRes.json();
  const metaPages: PageMeta[] = metaJson.pages ?? [];

  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < MAX_PAGES; i++) {
    const imgBytes = await fetchImageBytes(renderingToken, i + 1, cache);

    // Stop when we receive a placeholder tile instead of a real resume page
    if (imgBytes.length < PLACEHOLDER_THRESHOLD_BYTES) break;

    // SSR returns 1800×~2329 px JPEG natively at width=1800 — no upscaling needed
    const jpegBytes = await normalizeToJpeg(imgBytes);
    const embeddedImg = await pdfDoc.embedJpg(jpegBytes);

    // PDF page matches the viewport in pts; the hi-res image fills it exactly (~211 DPI)
    const viewport = metaPages[i]?.viewport ?? DEFAULT_VIEWPORT;
    const page = pdfDoc.addPage([viewport.width, viewport.height]);
    page.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width: viewport.width,
      height: viewport.height,
    });

    // Links are already in viewport-pt space; only Y-axis needs flipping
    const links = metaPages[i]?.links ?? [];
    const annotRefs: PDFRef[] = [];

    for (const link of links) {
      const pdfY = viewport.height - link.y - link.h;

      const annotDict = pdfDoc.context.obj({
        Type: "Annot",
        Subtype: "Link",
        Rect: [link.x, pdfY, link.x + link.w, pdfY + link.h],
        A: {
          Type: "Action",
          S: "URI",
          URI: PDFString.of(link.url),
        },
        Border: [0, 0, 0],
        F: 4,
      });
      annotRefs.push(pdfDoc.context.register(annotDict));
    }

    if (annotRefs.length > 0) {
      page.node.set(PDFName.of("Annots"), PDFArray.withContext(pdfDoc.context));
      const annots = page.node.get(PDFName.of("Annots")) as PDFArray;
      for (const ref of annotRefs) annots.push(ref);
    }
  }

  if (pdfDoc.getPageCount() === 0) {
    throw new Error("No pages rendered — the rendering token may be invalid or expired.");
  }

  return pdfDoc.save();
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ renderingToken: string }> }
) {
  const { renderingToken } = await params;

  if (!/^[a-zA-Z0-9]{24}$/.test(renderingToken)) {
    return NextResponse.json(
      { error: "renderingToken must be a 24-character alphanumeric string" },
      { status: 422 }
    );
  }

  try {
    const pdfBytes = await buildPdf(renderingToken);
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="resume-${renderingToken}.pdf"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.includes("404") ? 404 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
