import { PDFDocument, PDFName, PDFString, PDFArray, PDFRef } from "pdf-lib";
import { NextRequest, NextResponse } from "next/server";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/136.0.0.0 Safari/537.36";

const METADATA_URL =
  "https://ssr.resume.tools/meta/{token}?cache={cache}";
const IMAGE_URL =
  "https://ssr.resume.tools/to-image/{token}-{page}.{ext}?cache={cache}&size={size}";

interface PageLink {
  url: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface PageMeta {
  viewport: { width: number; height: number };
  links: PageLink[];
}

function getCacheDate(): string {
  return new Date().toISOString().slice(0, -10) + "Z";
}

async function resumeFetch(url: string): Promise<Response> {
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) {
    throw new Error(`resume.io fetch failed: ${res.status} ${res.statusText}`);
  }
  return res;
}

async function buildPdf(
  renderingToken: string,
  imageSize: number,
  extension: "jpeg" | "png" | "webp"
): Promise<Uint8Array> {
  const cache = getCacheDate();

  const metaRes = await resumeFetch(
    METADATA_URL.replace("{token}", renderingToken).replace("{cache}", cache)
  );
  const metaJson: { pages: PageMeta[] } = await metaRes.json();
  const pages = metaJson.pages;

  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < pages.length; i++) {
    const pageMeta = pages[i];
    const { viewport, links } = pageMeta;

    const imgUrl = IMAGE_URL.replace("{token}", renderingToken)
      .replace("{page}", String(i + 1))
      .replace("{ext}", extension)
      .replace("{cache}", cache)
      .replace("{size}", String(imageSize));

    const imgRes = await resumeFetch(imgUrl);
    const imgBytes = await imgRes.arrayBuffer();

    const embeddedImg =
      extension === "png"
        ? await pdfDoc.embedPng(imgBytes)
        : await pdfDoc.embedJpg(imgBytes);

    const { width: imgW, height: imgH } = embeddedImg;
    const page = pdfDoc.addPage([imgW, imgH]);
    page.drawImage(embeddedImg, { x: 0, y: 0, width: imgW, height: imgH });

    // Scale link coords from viewport space to image/PDF space and flip y-axis
    const scaleX = imgW / viewport.width;
    const scaleY = imgH / viewport.height;
    const annotRefs: PDFRef[] = [];

    for (const link of links) {
      const pdfX = link.x * scaleX;
      const pdfW = link.w * scaleX;
      const pdfH = link.h * scaleY;
      // PDF origin is bottom-left; viewport origin is top-left
      const pdfY = imgH - link.y * scaleY - pdfH;

      const annotDict = pdfDoc.context.obj({
        Type: "Annot",
        Subtype: "Link",
        Rect: [pdfX, pdfY, pdfX + pdfW, pdfY + pdfH],
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

  return pdfDoc.save();
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ renderingToken: string }> }
) {
  const { renderingToken } = await params;

  if (!/^[a-zA-Z0-9]{24}$/.test(renderingToken)) {
    return NextResponse.json(
      { error: "renderingToken must be a 24-character alphanumeric string" },
      { status: 422 }
    );
  }

  const { searchParams } = new URL(request.url);
  const imageSize = Math.max(1, parseInt(searchParams.get("image_size") ?? "3000", 10) || 3000);
  const extParam = searchParams.get("extension") ?? "jpeg";
  const extension = (["jpeg", "png", "webp"].includes(extParam) ? extParam : "jpeg") as
    | "jpeg"
    | "png"
    | "webp";

  try {
    const pdfBytes = await buildPdf(renderingToken, imageSize, extension);
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${renderingToken}.pdf"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.includes("404") ? 404 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
