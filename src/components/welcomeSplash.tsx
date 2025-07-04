'use client';

import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Image from 'next/image';

export default function WelcomeSplash(){
    const router = useRouter();
    
    const [fadeOut, setfadeOut] = useState(false);
    const [animationFinished, setanimationFinished] = useState(false);
    const [showText, setshowText] = useState(false);
    useEffect(()=>{
        const logoanimationTimer = setTimeout(()=>{
            setanimationFinished(true);
        }, 1500);

        const textshowTimer = setTimeout(()=>{
            setshowText(true);
        }, 1800);

        const redirectionTimer = setTimeout(()=>{
            setfadeOut(true);
            setTimeout(()=>{
                router.push('/login');
            }, 500);
        }, 3000);
        
        return(()=>{
            clearTimeout(logoanimationTimer);
            clearTimeout(textshowTimer);
            clearTimeout(redirectionTimer);
        })
    }, [router]);

    return (
            <div
            className={`relative flex flex-col items-center justify-center min-h-screen
                        gradient-custom-bg-multi text-white
                        ${fadeOut ? 'animate-fadeOut' : ''}`} // Apply fadeOut animation class
            style={{ animationFillMode: 'forwards' }} // Keep the last frame of fadeOut animation
            >
                {/* Logo Container */}
                <div
                    className={`relative transition-transform duration-700 ease-out`}
                    style={{
                    animation: animationFinished ? 'none' : 'swirlIn 1.5s ease-out forwards',
                    }}
                >
                {/* Placeholder for your "B" logo from the image */}
                {/* You'd use next/image here if you have an actual logo image file */}
                {/* For now, a stylized text "B" */}
                <Image
                    src="/images/Logo_enter.png"
                    alt="Blogsy_logo"
                    height={500}
                    width={500}
                    className='relative z-10'
                />
            </div>

            {/* "Welcome to Blogsy" Text */}
            <div
                className={`text-4xl font-bold transition-opacity duration-500 ease-in-out
                            ${showText ? 'opacity-100 animate-slideInUp' : 'opacity-0'}`}
                style={{ animationDelay: '0.2s' }} // Slight delay for text slide-in
            >
                Welcome to Blogsy
            </div>

            {/* Optional: Loading spinner/indicator */}
            {!fadeOut && (
                <div className="mt-8 text-lg animate-pulse">
                Loading...
                </div>
            )}
            </div>
    );
}