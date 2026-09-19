import CommunicationsNav from "./components/CommunicationsNav";

export default function CommunicationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-foreground/60">
          Announcements, notices, and public school news
        </p>
        <h1 className="mt-1 text-xl font-medium text-foreground">
          Communications
        </h1>
      </div>
      <CommunicationsNav />
      {children}
    </div>
  );
}
