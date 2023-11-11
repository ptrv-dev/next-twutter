import Navbar from '@/components/Navbar';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container min-h-screen flex">
      <Navbar className="max-w-[240px] w-full" />
      <main className="w-full">{children}</main>
    </div>
  );
}
