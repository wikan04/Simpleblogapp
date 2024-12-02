import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WelcomeDialog from '../components/WelcomeDialog';
import Header from '../components/Header';
import '../styles/globals.css';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: any) {
    const [token, setToken] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const storedToken = localStorage.getItem('goRestToken');
        setToken(storedToken);
    }, []);

    const handleLogin = (newToken: string, name: string) => {
        localStorage.setItem('goRestToken', newToken);
        localStorage.setItem('userName', name);
        setToken(newToken);
    };

    const handleLogout = () => {
        localStorage.removeItem('goRestToken');
        localStorage.removeItem('userName');
        setToken(null);
    };

    if (!isClient) return null; // Menghindari SSR

    return (
        <QueryClientProvider client={queryClient}>
            {token && <Header onLogout={handleLogout} />}
            {token ? (
                <Component {...pageProps} token={token} />
            ) : (
                <WelcomeDialog onLogin={handleLogin} />
            )}
        </QueryClientProvider>
    );
}

export default MyApp;