'use client';

import html2pdf from "html2pdf.js";

export function downloadHtmlAsPdf(
  element: HTMLElement,
  filename: string
) {
  const wrapper = document.createElement("div");

  wrapper.innerHTML = `
    <div style="
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      color: #111827;
    ">
      <style>
        p {
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .no-break {
          page-break-inside: avoid;
          break-inside: avoid;
        }
      </style>

      <!-- TOP BRAND BAR -->
      <div style="
        height:6px;
        background: linear-gradient(90deg, #86efac, #93c5fd);
        border-radius: 4px;
        margin-bottom: 20px;
      "></div>

      <!-- HEADER -->
      <div style="
        display:flex;
        justify-content:space-between;
        align-items:flex-start;
        margin-bottom: 24px;
      ">
        <div>
          <h1 style="
            margin:0;
            font-size:22px;
            font-weight:700;
            letter-spacing:-0.02em;
          ">
            Omada Growth Report
          </h1>
          <p style="
            margin:4px 0 0;
            font-size:13px;
            color:#6b7280;
          ">
            AI-powered social performance & growth insights
          </p>
        </div>

        <div style="
          text-align:right;
          font-size:11px;
          color:#6b7280;
          line-height:1.4;
        ">
          <div><strong>Generated</strong></div>
          <div>${new Date().toLocaleDateString()}</div>
        </div>
      </div>

      <!-- DIVIDER -->
      <div style="
        height:1px;
        background:#e5e7eb;
        margin-bottom: 24px;
      "></div>
    </div>
  `;

  // ====== REPORT CONTENT (NO SPLITTING) ======
  const reportContent = element.cloneNode(true) as HTMLElement;
  reportContent.style.pageBreakInside = "avoid";
  reportContent.style.breakInside = "avoid";

  wrapper.appendChild(reportContent);

  // ====== FOOTER (SAFE FROM CUTS) ======
  const footer = document.createElement("div");
  footer.innerHTML = `
    <div style="
      margin-top: 40px;
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
      font-size: 11px;
      color: #9ca3af;
      display:flex;
      justify-content:space-between;
      page-break-inside: avoid;
      break-inside: avoid;
    ">
      <span>© ${new Date().getFullYear()} Omada</span>
      <span>Confidential · For internal & client use</span>
    </div>
  `;
  wrapper.appendChild(footer);

  const options = {
    margin: 14,
    filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
    pagebreak: {
      mode: ["css", "legacy"],
      avoid: ["p", ".no-break"],
    },
  } as any; 
  html2pdf()
    .set(options)
    .from(wrapper)
    .save();
}
