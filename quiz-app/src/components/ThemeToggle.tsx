import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react'; 
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  mobile?: boolean;
  className?: string;
}

export function ThemeToggle({ mobile, className }: ThemeToggleProps) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
            document.documentElement.classList.add('dark');
            setIsDarkMode(true);
        } else {
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        }
    }, []);

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDarkMode(true);
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                "p-2 rounded-full transition-colors duration-300 focus:outline-hidden",
                mobile ? (className || "") : "hidden md:block",
                className
            )}
        >
            {isDarkMode ? (
                <Sun className='h-6 w-6 text-yellow-300' />
            ) : (
                <Moon className='h-6 w-6 text-blue-300' />
            )}
        </button>
    );
};
