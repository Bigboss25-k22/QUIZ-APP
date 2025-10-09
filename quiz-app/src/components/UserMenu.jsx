import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function UserMenu({ showUserMenu, setShowUserMenu, setIsMenuOpen, userMenuRef, avatarSize = 8, isMobile = false }) {
    const { user, isLoggedIn, logout } = useAuth();
    const userName = user?.name || user?.email || "User";
    const navigate = useNavigate();
    const handleLoginClick = () => {
        navigate('/login');
    };
    if (!isLoggedIn) {
        if (isMobile) {
            return (
                <div className="w-full flex flex-col items-center mb-4">
                    <button
                        className="w-full flex items-center justify-center px-8 py-4 rounded-full text-xl font-bold tracking-wide shadow-md hover:shadow-lg focus:outline-none transition-all duration-200 bg-transparent border border-border hover:border-primary text-foreground dark:text-foreground mb-4"
                        style={{ minHeight: 60 }}
                        onClick={handleLoginClick}
                    >
                        Login
                    </button>
                </div>
            );
        }
        return (
            <button
                className="px-6 py-2 rounded-full text-base font-semibold tracking-wide shadow-md hover:shadow-lg focus:outline-none transition-all duration-200 bg-transparent border border-border hover:border-primary text-foreground dark:text-foreground"
                onClick={handleLoginClick}
            >
                Login
            </button>
        );
    }
    if (isMobile) {
        return (
            <div className="w-full flex flex-col items-center mb-4">
                <button
                    className="w-full flex items-center justify-between px-8 py-4 rounded-full text-xl font-bold tracking-wide shadow-md hover:shadow-lg focus:outline-none transition-all duration-200 bg-transparent border border-border hover:border-primary text-foreground dark:text-foreground mb-4"
                    style={{ minHeight: 60 }}
                    onClick={() => setShowUserMenu((v) => !v)}
                >
                    <span className="pl-1 pr-2 drop-shadow-sm select-none">{userName}</span>
                    <svg className={`w-6 h-6 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showUserMenu && (
                    <div className="mt-2 w-full rounded-xl shadow-xl z-50 py-2 animate-fadeIn border border-border bg-white/80 dark:bg-background/90 backdrop-blur-md">
                        <a href="#profile" className="block px-6 py-2 text-base font-medium text-foreground hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors rounded-md">Quản lý tài khoản</a>
                        <a href="#settings" className="block px-6 py-2 text-base font-medium text-foreground hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors rounded-md">Cài đặt</a>
                        <button
                            className="block w-full text-center px-6 py-2 text-base font-medium text-red-500 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors rounded-md"
                            onClick={() => { logout(); setShowUserMenu(false); if (setIsMenuOpen) setIsMenuOpen(false); }}
                        >
                            Đăng xuất
                        </button>
                    </div>
                )}
            </div>
        );
    }
    // Desktop: chỉ hiện tên, bấm vào xổ menu
    return (
        <div className="relative" ref={userMenuRef}>
            <button
                className="flex items-center gap-2 px-6 py-2 rounded-full text-base font-semibold tracking-wide shadow-md hover:shadow-lg focus:outline-none transition-all duration-200 bg-transparent border border-border hover:border-primary text-foreground dark:text-foreground"
                onClick={() => setShowUserMenu((v) => !v)}
                tabIndex={0}
            >
                <span className="pl-1 pr-2 drop-shadow-sm select-none">{userName}</span>
                <svg className={`w-5 h-5 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {showUserMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-background rounded-xl shadow-xl z-50 py-2 animate-fadeIn border border-border">
                    <a href="#profile" className="block px-6 py-2 text-base font-medium text-foreground hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors rounded-md">Quản lý tài khoản</a>
                    <a href="#settings" className="block px-6 py-2 text-base font-medium text-foreground hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors rounded-md">Cài đặt</a>
                    <button
                        className="block w-full px-6 py-2 text-base font-medium text-red-500 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors rounded-md"
                        onClick={() => { logout(); setShowUserMenu(false); if (setIsMenuOpen) setIsMenuOpen(false); }}
                    >
                        Đăng xuất
                    </button>
                </div>
            )}
        </div>
    );
}
