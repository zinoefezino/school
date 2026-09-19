import FinanceNav from "./components/FinanceNav";

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-foreground/60">
          Fees, invoices, collections, balances, and reports
        </p>
        <h1 className="mt-1 text-xl font-medium text-foreground">Finance</h1>
      </div>
      <FinanceNav />
      {children}
    </div>
  );
}
