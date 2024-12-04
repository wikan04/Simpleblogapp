import BlogList from '../components/BlogList';
import WelcomeDialog from '../components/WelcomeDialog';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Button } from 'antd';
import { useRouter } from 'next/router';

const queryClient = new QueryClient();

export default function Home({ token }: { token: string | null }) {
  const router = useRouter();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
        <div className="max-w-xl mb-2 md:mx-auto sm:text-center lg:max-w-2xl md:mb-2">
          <h2 className="max-w-2xl mb-4 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
            <span className="relative inline-block">
              <span className="relative">Selamat datang di Wikan Simple Blog</span>
            </span>
          </h2>
          <p className="text-base text-gray-700 md:text-lg">
            Blog ini dibuat untuk kepentingan Test Interview
          </p>
        </div>

        {token ? (
          <div className="mx-auto">
            <BlogList token={token} /> {/* Meneruskan token ke BlogList */}
            <Button className='mt-4' type="primary" onClick={() => router.push('/blog/create')}>Buat Postingan Baru</Button>
          </div>
        ) : (
          <WelcomeDialog onLogin={(newToken: string, name: string) => {
            localStorage.setItem('goRestToken', newToken);
            localStorage.setItem('userName', name);
          }} />
        )}
      </div>
    </QueryClientProvider>
  );
}