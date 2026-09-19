"use client";

import { useEffect, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Certificate01Icon,
  CheckmarkCircle02Icon,
  Upload01Icon,
} from "@hugeicons/core-free-icons";
import LoadingState from "../../components/LoadingState";

type Subject = { id: string; name: string };
type AssignedClass = { id: string; classSection: string; subjects?: Subject[] };
type ResultRow = {
  id: string;
  name: string;
  admissionNumber: string;
  ca1: number;
  ca2: number;
  exam: number;
};
type Submission = {
  status?: "SUBMITTED" | "APPROVED" | "REJECTED";
  rejectionNote?: string;
};

export default function StaffResultsPage() {
  const [classes, setClasses] = useState<AssignedClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [students, setStudents] = useState<ResultRow[]>([]);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/dashboard/staff/classes")
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => {
        const nextClasses = data?.classes ?? [];
        setClasses(nextClasses);
        setSelectedClassId(nextClasses[0]?.id ?? "");
        setSelectedSubjectId(nextClasses[0]?.subjects?.[0]?.id ?? "");
      })
      .catch(() => {
        setClasses([]);
      });
  }, []);

  useEffect(() => {
    if (!selectedClassId || !selectedSubjectId) {
      Promise.resolve().then(() => {
        setStudents([]);
        setSubmission(null);
        setLoading(false);
      });
      return;
    }
    Promise.resolve().then(() => {
      setLoading(true);
      setStatus("");
    });
    fetch(
      `/api/dashboard/staff/results?classSectionId=${selectedClassId}&subjectId=${selectedSubjectId}`,
    )
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => {
        setStudents(data?.students ?? []);
        setSubmission(data?.submission ?? null);
      })
      .catch(() => {
        setStudents([]);
        setSubmission(null);
      })
      .finally(() => setLoading(false));
  }, [selectedClassId, selectedSubjectId]);

  const updateScore = (
    studentId: string,
    field: "ca1" | "ca2" | "exam",
    value: string,
  ) => {
    const numericValue = Number(value);
    setStudents((current) =>
      current.map((student) =>
        student.id === studentId
          ? { ...student, [field]: Number.isNaN(numericValue) ? 0 : numericValue }
          : student,
      ),
    );
  };

  const saveResults = async (submit: boolean) => {
    if (!selectedClassId || !selectedSubjectId) return;
    setSaving(true);
    setStatus("");
    try {
      const response = await fetch("/api/dashboard/staff/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classSectionId: selectedClassId,
          subjectId: selectedSubjectId,
          submit,
          records: students.map((student) => ({
            studentId: student.id,
            ca1: student.ca1,
            ca2: student.ca2,
            exam: student.exam,
          })),
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error ?? "Unable to save results.");
      setStatus(
        submit ? "Results submitted for review." : "Result draft saved.",
      );
      if (submit) setSubmission({ status: "SUBMITTED" });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save results.");
    } finally {
      setSaving(false);
    }
  };

  const selectedClass = classes.find((item) => item.id === selectedClassId);
  const availableSubjects =
    selectedClass?.subjects && selectedClass.subjects.length > 0
      ? selectedClass.subjects
      : [];
  const hasAssignments = classes.length > 0 && availableSubjects.length > 0;
  const notice = useMemo(() => {
    if (!submission) return null;
    if (submission.status === "REJECTED")
      return {
        tone: "error",
        title: "This submission needs changes",
        body:
          submission.rejectionNote ??
          "Review the scores flagged by the administrator, then submit again for approval.",
      };
    if (submission.status === "SUBMITTED")
      return {
        tone: "info",
        title: "Submission awaiting review",
        body: "An administrator can now review this result submission.",
      };
    if (submission.status === "APPROVED")
      return {
        tone: "success",
        title: "Submission approved",
        body: "These results have been approved by the administrator.",
      };
    return null;
  }, [submission]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-foreground/60">
            Enter and submit continuous assessment and exam scores
          </p>
          <h2 className="mt-1 text-xl font-medium text-foreground">Results</h2>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedClassId}
            onChange={(event) => {
              const nextClassId = event.target.value;
              const nextClass = classes.find((item) => item.id === nextClassId);
              setSelectedClassId(nextClassId);
              setSelectedSubjectId(nextClass?.subjects?.[0]?.id ?? "");
            }}
            className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm text-foreground"
          >
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.classSection}
              </option>
            ))}
          </select>
          <select
            value={selectedSubjectId}
            onChange={(event) => setSelectedSubjectId(event.target.value)}
            className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm text-foreground"
          >
            {availableSubjects.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {!hasAssignments && (
        <p className="rounded-2xl bg-white p-6 text-sm text-foreground/60">
          No class or subject assignments are available yet.
        </p>
      )}
      {notice && (
        <div
          className={`flex items-start gap-3 rounded-2xl p-5 ${
            notice.tone === "error"
              ? "border border-[#B4483B]/20 bg-[#B4483B]/5"
              : "border border-blue/20 bg-blue-light"
          }`}
        >
          <HugeiconsIcon
            icon={Certificate01Icon}
            size={20}
            className={`mt-0.5 shrink-0 ${
              notice.tone === "error" ? "text-[#B4483B]" : "text-blue"
            }`}
          />
          <div>
            <p className="text-sm font-medium text-foreground">
              {notice.title}
            </p>
            <p className="mt-1 text-sm text-foreground/70">{notice.body}</p>
          </div>
        </div>
      )}
      <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-navy/10 text-xs font-medium uppercase tracking-wide text-foreground/50">
              <th className="px-6 py-3.5">Student</th>
              <th className="px-6 py-3.5">CA1 / 20</th>
              <th className="px-6 py-3.5">CA2 / 20</th>
              <th className="px-6 py-3.5">Exam / 60</th>
              <th className="px-6 py-3.5">Total / 100</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {loading ? (
              <tr>
                <td colSpan={5}>
                  <LoadingState
                    label="Loading results..."
                    className="min-h-32"
                  />
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-sm text-foreground/60"
                >
                  No students found for this class.
                </td>
              </tr>
            ) : (
              students.map((student) => (
              <tr key={student.id} className="text-sm">
                <td className="whitespace-nowrap px-6 py-4 font-medium text-foreground">
                  {student.name}
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={student.ca1}
                    onChange={(event) =>
                      updateScore(student.id, "ca1", event.target.value)
                    }
                    min="0"
                    max="20"
                    className="w-20 rounded-lg border border-black/10 px-3 py-2 text-sm text-foreground outline-none focus:border-blue"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={student.ca2}
                    onChange={(event) =>
                      updateScore(student.id, "ca2", event.target.value)
                    }
                    min="0"
                    max="20"
                    className="w-20 rounded-lg border border-black/10 px-3 py-2 text-sm text-foreground outline-none focus:border-blue"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={student.exam}
                    onChange={(event) =>
                      updateScore(student.id, "exam", event.target.value)
                    }
                    min="0"
                    max="60"
                    className="w-20 rounded-lg border border-black/10 px-3 py-2 text-sm text-foreground outline-none focus:border-blue"
                  />
                </td>
                <td className="px-6 py-4 font-medium text-foreground">
                  {student.ca1 + student.ca2 + student.exam}
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {status && <p className="text-sm text-foreground/70">{status}</p>}
      <div className="flex flex-wrap justify-end gap-3">
        <button
          type="button"
          disabled={saving || students.length === 0}
          onClick={() => saveResults(false)}
          className="flex items-center gap-2 rounded-full border border-navy/15 px-5 py-2.5 text-sm font-medium text-navy hover:bg-blue-light disabled:cursor-not-allowed disabled:opacity-40"
        >
          <HugeiconsIcon icon={Upload01Icon} size={17} />
          {saving ? "Saving..." : "Save draft"}
        </button>
        <button
          type="button"
          disabled={saving || students.length === 0}
          onClick={() => saveResults(true)}
          className="flex items-center gap-2 rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={17} />
          Submit for review
        </button>
      </div>
    </div>
  );
}
