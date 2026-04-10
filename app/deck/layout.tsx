export default function DeckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto">{children}</div>
  );
}
