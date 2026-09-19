import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../lib/mongodb";
import { getSession } from "../../../../../../lib/session";
import Student from "../../../../../../models/Student";
import Assessment from "../../../../../../models/Assessment";
import Term from "../../../../../../models/Term";

type ResultRow = {
  subject: string;
  score: number;
  grade: string;
};

function gradeFor(score: number) {
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function safePdfText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function crc32(buffer: Buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let index = 0; index < 8; index += 1) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function zipStored(files: { name: string; content: string }[]) {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;

  for (const file of files) {
    const name = Buffer.from(file.name);
    const content = Buffer.from(file.content);
    const crc = crc32(content);
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(0, 8);
    localHeader.writeUInt16LE(0, 10);
    localHeader.writeUInt16LE(0, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(content.length, 18);
    localHeader.writeUInt32LE(content.length, 22);
    localHeader.writeUInt16LE(name.length, 26);
    localHeader.writeUInt16LE(0, 28);
    localParts.push(localHeader, name, content);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(0, 10);
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(0, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(content.length, 20);
    centralHeader.writeUInt32LE(content.length, 24);
    centralHeader.writeUInt16LE(name.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);
    centralParts.push(centralHeader, name);

    offset += localHeader.length + name.length + content.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, centralDirectory, end]);
}

function createPdf({
  studentName,
  admissionNumber,
  term,
  session,
  results,
}: {
  studentName: string;
  admissionNumber: string;
  term: string;
  session: string;
  results: ResultRow[];
}) {
  const lines = [
    "Academic Result",
    `Student: ${studentName}`,
    `Admission No: ${admissionNumber}`,
    `Period: ${term} - ${session}`,
    "",
    "Subject                              Score     Grade",
    "---------------------------------------------------",
    ...results.map(
      (result) =>
        `${result.subject.padEnd(36).slice(0, 36)} ${String(result.score).padStart(5)}%     ${result.grade}`,
    ),
  ];
  const stream = [
    "BT",
    "/F1 12 Tf",
    "50 780 Td",
    ...lines.flatMap((line, index) => [
      index === 0 ? "/F1 18 Tf" : index === 1 ? "/F1 12 Tf" : "",
      `(${safePdfText(line)}) Tj`,
      "0 -20 Td",
    ]),
    "ET",
  ]
    .filter(Boolean)
    .join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) {
    pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf);
}

function createDocx({
  studentName,
  admissionNumber,
  term,
  session,
  results,
}: {
  studentName: string;
  admissionNumber: string;
  term: string;
  session: string;
  results: ResultRow[];
}) {
  const rows = results
    .map(
      (result) => `
        <w:tr>
          <w:tc><w:p><w:r><w:t>${escapeXml(result.subject)}</w:t></w:r></w:p></w:tc>
          <w:tc><w:p><w:r><w:t>${result.score}%</w:t></w:r></w:p></w:tc>
          <w:tc><w:p><w:r><w:t>${escapeXml(result.grade)}</w:t></w:r></w:p></w:tc>
        </w:tr>`,
    )
    .join("");
  const document = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:r><w:t>Academic Result</w:t></w:r></w:p>
    <w:p><w:r><w:t>Student: ${escapeXml(studentName)}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Admission No: ${escapeXml(admissionNumber)}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Period: ${escapeXml(term)} - ${escapeXml(session)}</w:t></w:r></w:p>
    <w:tbl>
      <w:tr>
        <w:tc><w:p><w:r><w:t>Subject</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Score</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Grade</w:t></w:r></w:p></w:tc>
      </w:tr>
      ${rows}
    </w:tbl>
    <w:sectPr/>
  </w:body>
</w:document>`;
  return zipStored([
    {
      name: "[Content_Types].xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`,
    },
    {
      name: "_rels/.rels",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`,
    },
    { name: "word/document.xml", content: document },
  ]);
}

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "STUDENT")
    return NextResponse.json(
      { error: "Student authentication is required." },
      { status: 401 },
    );

  const params = new URL(request.url).searchParams;
  const termId = params.get("termId");
  const format = params.get("format") === "docx" ? "docx" : "pdf";

  await connectDB();
  const student = await Student.findOne({ user: session.userId })
    .select("_id fullName admissionNumber")
    .lean();
  if (!student || !termId)
    return NextResponse.json(
      { error: "Student and term are required." },
      { status: 400 },
    );

  const term = await Term.findOne({ _id: termId, resultsPublished: true })
    .select("name session")
    .populate("session", "name")
    .lean();
  if (!term)
    return NextResponse.json(
      { error: "Result is not available for download." },
      { status: 404 },
    );

  const assessments = await Assessment.find({
    student: student._id,
    term: term._id,
  })
    .populate("subject", "name")
    .lean();
  const bySubject = new Map<string, { subject: string; score: number }>();
  for (const assessment of assessments) {
    const subject = assessment.subject as { _id?: string; name?: string };
    const key = subject?._id?.toString() ?? "unknown";
    const current = bySubject.get(key) ?? {
      subject: subject?.name ?? "Subject",
      score: 0,
    };
    current.score += assessment.score;
    bySubject.set(key, current);
  }
  const results = [...bySubject.values()].map((result) => ({
    ...result,
    grade: gradeFor(result.score),
  }));
  const sessionName = (term.session as { name?: string } | undefined)?.name ?? "";
  const payload = {
    studentName: student.fullName,
    admissionNumber: student.admissionNumber,
    term: term.name,
    session: sessionName,
    results,
  };
  const fileBase = `${student.admissionNumber}-${term.name}`.replace(
    /[^a-z0-9-]+/gi,
    "-",
  );
  const body = format === "docx" ? createDocx(payload) : createPdf(payload);

  return new NextResponse(body, {
    headers: {
      "Content-Type":
        format === "docx"
          ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          : "application/pdf",
      "Content-Disposition": `attachment; filename="${fileBase}.${format}"`,
    },
  });
}
