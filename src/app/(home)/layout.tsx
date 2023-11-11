import Navbar from '@/components/Navbar';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container min-h-screen flex">
      <Navbar className="w-[240px] flex-shrink-0" />
      <main className="w-full">{children}</main>
    </div>
  );
}
