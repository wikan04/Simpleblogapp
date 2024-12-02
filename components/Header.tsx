import React from 'react';
import { Button } from 'antd';

interface HeaderProps {
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
    return (
        <header className="flex justify-between p-4 bg-white border-b-2">
            <h1 className="text-xl font-bold text-black">
                Wikan Simple Blog
            </h1>
            <Button type="primary" danger onClick={onLogout}>
                Logout
            </Button>
        </header>
    );
};

export default Header;
