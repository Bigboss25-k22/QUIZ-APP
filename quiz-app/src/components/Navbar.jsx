import { cn } from "@/lib/utils"
import { useState, useEffect, useRef } from 'react';
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import { Link } from "react-router-dom";    

const navItem = [
    { name: 'Home', to: '/', type: 'link' },
    { name: 'Test', to: '/tests', type: 'link' },
    { name: 'Contact', to: '/contact', type: 'link' }
]

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // Tách riêng state cho từng UserMenu
    const [showUserMenuDesktop, setShowUserMenuDesktop] = useState(false);
    const [showUserMenuMobile, setShowUserMenuMobile] = useState(false);
    const userMenuRefDesktop = useRef(null);
    const userMenuRefMobile = useRef(null);
    // Đóng menu user khi click ra ngoài (desktop)
    useEffect(() => {
        function handleClickOutside(event) {
            if (userMenuRefDesktop.current && !userMenuRefDesktop.current.contains(event.target)) {
                setShowUserMenuDesktop(false);
            }
        }
        if (showUserMenuDesktop) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showUserMenuDesktop]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <nav className={cn('fixed w-full z-40 transition-all duration-300', 
            isScrolled ? 'py-3 bg-background/80 backdrop-blur-md shadow-sc' : 'py-5'
        )}>
            {/* ThemeToggle desktop: luôn sát góc phải */}
            <div className="hidden md:block">
                <ThemeToggle className="absolute top-4 right-6" />
            </div>
            <div className="container mx-auto flex items-center relative">
                <a className="text-lg font-bold text-primary flex items-center flex-grow" href="#hero">
                    <span className="relative z-10">
                        <img 
                            src="https://res.cloudinary.com/duxrwlvtv/image/upload/v1755590827/e3184f9f-e4a4-48e2-aa99-bb5f77a7867f_jyk4s8.jpg" 
                            alt="logo" 
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover inline-block mr-2 align-middle" 
                        />
                        <span className="text-glow text-foreground"> Quiz App </span> 
                    </span>
                </a>
                {/* desktop navbar */}
                <div className="hidden md:flex space-x-8 justify-end items-center">
                    {navItem.map((item, key) => (
                        item.type === 'link' ? (
                            <Link key={key} to={item.to} className="text-foreground/80 hover:text-primary transition-color duration-300">
                                {item.name}
                            </Link>
                        ) : (
                            <a key={key} href={item.href} className="text-foreground/80 hover:text-primary transition-color duration-300">
                                {item.name}
                            </a>
                        )
                    ))}
                    <div className="ml-4">
                        <UserMenu
                            showUserMenu={showUserMenuDesktop}
                            setShowUserMenu={setShowUserMenuDesktop}
                            userMenuRef={userMenuRefDesktop}
                            isMobile={false}
                        />
                    </div>
                </div>
                {/* mobile navbar */}
                <button onClick={() => setIsMenuOpen(prev => !prev)}
                    className="md:hidden p-2 text-foreground z-50"
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <div className={cn("fixed inset-0 z-50 bg-background/90 backdrop-blur-md md:hidden flex flex-col items-center justify-center",
                    "transition-opacity duration-300",
                    isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}>
                    {/* Nút đóng menu */}
                    <button
                        className="absolute top-4 right-4 p-2 text-foreground"
                        aria-label="Đóng menu"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <X size={28} />
                    </button>
                    <div className="flex flex-col space-y-8 text-xl items-center w-4/5 max-w-xs mx-auto">
                        {/* UserMenu cho mobile: hiện tên và menu con đầu tiên */}
                        <div className="w-full mb-2">
                            <UserMenu
                                showUserMenu={showUserMenuMobile}
                                setShowUserMenu={setShowUserMenuMobile}
                                setIsMenuOpen={setIsMenuOpen}
                                userMenuRef={userMenuRefMobile}
                                isMobile={true}
                            />
                        </div>
                        {navItem.map((item, key) => (
                            item.type === 'link' ? (
                                <Link
                                    key={key}
                                    to={item.to}
                                    className="text-foreground/80 hover:text-primary transition-color duration-300 w-full text-center"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ) : (
                                <a
                                    key={key}
                                    href={item.href}
                                    className="text-foreground/80 hover:text-primary transition-color duration-300 w-full text-center"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </a>
                            )
                        ))}
                        {/* ThemeToggle chỉ hiện trong menu mobile */}
                        <div className="flex justify-center mt-8">
                            <ThemeToggle mobile className="absolute top-4 left-4" />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
