'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import liff from '@line/liff';

interface LiffContextValue {
    liff: typeof liff | null;
    isLoggedIn: boolean;
    error: string | null;
}

const LiffContext = createContext<LiffContextValue>({
    liff: null,
    isLoggedIn: false,
    error: null,
});

export const useLiff = () => useContext(LiffContext);

export const LiffProvider = ({ children }: { children: React.ReactNode }) => {
    const [liffObject, setLiffObject] = useState<typeof liff | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Only import liff on client side
        import('@line/liff').then((liffModule) => {
            const liff = liffModule.default;
            console.log('LIFF init...');
            liff
                .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
                .then(() => {
                    console.log('LIFF init success');
                    setLiffObject(liff);
                    if (liff.isLoggedIn()) {
                        setIsLoggedIn(true);
                    }
                })
                .catch((e: Error) => {
                    console.error('LIFF init failed', e);
                    setError(e.toString());
                });
        });
    }, []);

    return (
        <LiffContext.Provider value={{ liff: liffObject, isLoggedIn, error }}>
            {children}
        </LiffContext.Provider>
    );
};
