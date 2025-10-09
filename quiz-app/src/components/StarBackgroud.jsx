import { use, useState, useEffect } from 'react';

//id, size, z, y, opacity, animationDuration


export const StarBackground = () => {
    const [stars, setStars] = useState([]);
    const [meteors, setMeteors] = useState([]);
    const [theme, setTheme] = useState(() => document.documentElement.classList.contains('dark') ? 'dark' : 'light');

    useEffect(() => {
        generateStars();
        generateMeteors();

        const handleResize = () => {
            generateStars();
        }

        const handleThemeChange = () => {
            setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('storage', handleThemeChange);
        const observer = new MutationObserver(handleThemeChange);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('storage', handleThemeChange);
            observer.disconnect();
        }
    }, []);

    const generateStars = () => {
        const numberOfStar = Math.floor(window.innerWidth * window.innerHeight / 10000);

        const newStar = []

         for (let i = 0; i < numberOfStar; i++) {
            newStar.push({
                id: i,
                size: Math.random() * 3 + 1,
                x: Math.random() * 100,
                y: Math.random() * 100,
                opacity: Math.random() * 0.5 + 0.5,
                animationDuration: Math.random() * 4 + 2,
            });
        }

        setStars(newStar);
    };

    const generateMeteors = () => {
        const numberOfMeteors = 4

        const newMeteors = []

        for (let i = 0; i < numberOfMeteors; i++) {
            newMeteors.push({
                id: i,
                size: Math.random() * 2 + 1,
                x: Math.random() * 100,
                y: Math.random() * 100,
                delay: Math.random() * 0,
                animationDuration: Math.random() * 3 + 3,
            });
        }

        setMeteors(newMeteors);
    };

    const isDark = theme === 'dark';

    return <div className='fixed inset-0 overflow-hidden pointer-events-none z-0'>
        {stars.map(star => (
            <div
                key={star.id}
                className='star animate-pulse-subtle'
                style={{
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    opacity: star.opacity,
                    animationDuration: `${star.animationDuration}s`,
                    background: isDark
                        ? '#fff'
                        : 'linear-gradient(180deg, #b3e0ff 0%, #e0f7fa 100%)',
                    boxShadow: isDark
                        ? '0 0 10px 2px #fff, 0 0 20px 4px #fff'
                        : '0 0 8px 2px #b3e0ff, 0 0 16px 4px #e0f7fa',
                }}
            />
        ))}

        {meteors.map(meteor => (
            <div
                key={meteor.id}
                className='meteor animate-meteor'
                style={{
                    width: `${meteor.size * 50}px`,
                    height: `${meteor.size * 2}px`,
                    left: `${meteor.x}%`,
                    top: `${meteor.y}%`,
                    animationDelay: `${meteor.delay}s`,
                    animationDuration: `${meteor.animationDuration}s`,
                    background: isDark
                        ? 'linear-gradient(90deg, #fff 0%, #fff 80%, transparent 100%)'
                        : 'linear-gradient(90deg, #b3e0ff 0%, #e0f7fa 80%, transparent 100%)',
                    boxShadow: isDark
                        ? '0 0 12px 4px #fff'
                        : '0 0 12px 4px #b3e0ff',
                }}
            />
        ))}
    </div>
}