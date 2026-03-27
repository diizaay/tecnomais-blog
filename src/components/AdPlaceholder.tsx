'use client'
import React, { useEffect, useRef } from 'react'

interface AdPlaceholderProps {
    position?: 'header' | 'in-content' | 'sidebar' | 'footer'
    format?: '300x250' | '160x300' | '320x50' | 'native'
}

export default function AdPlaceholder({ format = '300x250' }: AdPlaceholderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const scriptLoadedRef = useRef(false);

    // Configurable dimensions based on format
    const dimensions = {
        '300x250': 'w-[300px] h-[250px]',
        '160x300': 'w-[160px] h-[300px]',
        '320x50': 'w-[320px] h-[50px]',
        'native': 'w-full min-h-[100px]'
    }

    const AD_ACTIVE = true

    useEffect(() => {
        if (!AD_ACTIVE || !containerRef.current || scriptLoadedRef.current) return;

        const container = containerRef.current;
        scriptLoadedRef.current = true;

        if (format === 'native') {
            const script = document.createElement('script');
            script.async = true;
            script.dataset.cfasync = 'false';
            script.src = 'https://pl28985299.profitablecpmratenetwork.com/5b95a5dd0ddbde1c299fda173e0428f2/invoke.js';
            container.appendChild(script);

            const div = document.createElement('div');
            div.id = 'container-5b95a5dd0ddbde1c299fda173e0428f2';
            container.appendChild(div);
            return;
        }

        // Standard Banner formats
        const configMap = {
            '160x300': { key: '5ac183ef3bfadd4ae406dc3be1bb6909', width: 160, height: 300 },
            '320x50': { key: '15c1ab0412e2ef634b63d8cc4697344e', width: 320, height: 50 },
            '300x250': { key: '5d4ff7c9247862b7ba91f0094f598519', width: 300, height: 250 }
        };

        const config = configMap[format as keyof typeof configMap] || configMap['300x250'];

        // We use a small timeout to ensure atOptions is seen by the script
        // and avoid race conditions with multiple ads on the same page
        const optionsScript = document.createElement('script');
        optionsScript.type = 'text/javascript';
        optionsScript.innerHTML = `
            atOptions = {
                'key' : '${config.key}',
                'format' : 'iframe',
                'height' : ${config.height},
                'width' : ${config.width},
                'params' : {}
            };
        `;
        container.appendChild(optionsScript);

        const invokeScript = document.createElement('script');
        invokeScript.type = 'text/javascript';
        invokeScript.src = `https://www.highperformanceformat.com/${config.key}/invoke.js`;
        container.appendChild(invokeScript);

    }, [format, AD_ACTIVE]);

    if (!AD_ACTIVE) return null

    return (
        <div className="w-full flex flex-col items-center my-8">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-medium">Advertisement</span>
            <div 
                ref={containerRef}
                className={`ad-container ${dimensions[format]} overflow-hidden flex items-center justify-center bg-gray-50/50 rounded-lg`}
            />
        </div>
    )
}
