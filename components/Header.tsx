// components/Header.tsx
import React from 'react';
import { Button } from 'antd';
import Link from 'next/link';

interface HeaderProps {
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
    return (
        <div className="px-4 py-5 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 border-b-2">
            <div className="relative flex items-center justify-between">
                <Link href="/" aria-label="Company" title="Company" className="inline-flex items-center">
                    <span className="ml-2 text-xl font-bold tracking-wide text-gray-800 uppercase">Wikan Simple Blog</span>
                </Link>
                <Button color="primary" danger  onClick={onLogout} className="h-10 px-4 font-medium tracking-wide transition duration-200 rounded shadow-md focus:shadow-outline focus:outline-none">
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default Header;