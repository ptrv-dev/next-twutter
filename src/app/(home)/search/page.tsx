import Search from '@/components/Search';
import { Input } from '@/components/ui';
import { getSession } from '@/utils/getSession';
import { redirect } from 'next/navigation';

const SearchPage = async () => {
  const session = await getSession();
  if (!session) return redirect('/auth/sign-in');
  return (
    <div className="border-r h-full">
      <div className="border-b p-4">
        <h1 className="text-2xl">Search</h1>
      </div>
      <div className="p-4">
        <Search />
      </div>
    </div>
  );
};

export default SearchPage;
