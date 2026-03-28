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
        
        // Setup unique ID
        const uniqueId = `ad-slot-${format}-${Math.random().toString(36).substring(2, 9)}`;
        container.id = uniqueId;

        // Create the isolation iframe
        const frame = document.createElement('iframe');
        frame.style.width = '100%';
        frame.style.height = '100%';
        frame.style.border = 'none';
        frame.style.overflow = 'hidden';
        frame.setAttribute('scrolling', 'no');
        frame.setAttribute('frameborder', '0');
        
        container.appendChild(frame);

        const frameDoc = frame.contentDocument || frame.contentWindow?.document;
        if (!frameDoc) return;

        if (format === 'native') {
            frameDoc.open();
            frameDoc.write(`
                <html>
                    <body style="margin:0;padding:0;overflow:hidden;">
                        <script async data-cfasync="false" src="/ads-proxy/monetag/5b95a5dd0ddbde1c299fda173e0428f2/invoke.js"></script>
                        <div id="container-5b95a5dd0ddbde1c299fda173e0428f2"></div>
                    </body>
                </html>
            `);
            frameDoc.close();
            return;
        }

        // Standard Banners
        const configMap = {
            '160x300': { key: '5ac183ef3bfadd4ae406dc3be1bb6909', width: 160, height: 300 },
            '320x50': { key: '15c1ab0412e2ef634b63d8cc4697344e', width: 320, height: 50 },
            '300x250': { key: '5d4ff7c9247862b7ba91f0094f598519', width: 300, height: 250 }
        };

        const config = configMap[format as keyof typeof configMap] || configMap['300x250'];

        frameDoc.open();
        frameDoc.write(`
            <html>
                <body style="margin:0;padding:0;overflow:hidden;display:flex;justify-content:center;align-items:center;min-height:100vh;">
                    <div id="content-target">
                        <script type="text/javascript">
                            atOptions = {
                                'key' : '${config.key}',
                                'format' : 'iframe',
                                'height' : ${config.height},
                                'width' : ${config.width},
                                'params' : {}
                            };
                            document.write('<scr' + 'ipt type="text/javascript" src="/ads-proxy/adsterra/${config.key}/invoke.js"></scr' + 'ipt>');
                        </script>
                    </div>
                </body>
            </html>
        `);
        frameDoc.close();

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
