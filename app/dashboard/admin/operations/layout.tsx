import OperationsNav from "./components/OperationsNav";

export default function OperationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-foreground/60">
          Daily school operations, attendance, and class movement
        </p>
        <h1 className="mt-1 text-xl font-medium text-foreground">
          Operations
        </h1>
      </div>
      <OperationsNav />
      {children}
    </div>
  );
}
