import AcademicsNav from "./components/AcademicsNav";

export default function AcademicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-foreground/60">
          Sessions, terms, classes, subjects, teachers, assignments, and
          timetable
        </p>
        <h1 className="mt-1 text-xl font-medium text-foreground">Academics</h1>
      </div>
      <AcademicsNav />
      {children}
    </div>
  );
}
