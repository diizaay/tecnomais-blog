'use client'
import React, { useEffect, useRef } from 'react'

interface AdPlaceholderProps {
    position?: 'header' | 'in-content' | 'sidebar' | 'footer'
    format?: '300x250' | '160x300' | '320x50' | 'native'
}

export default function AdPlaceholder({ format = '300x250' }: AdPlaceholderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const scriptLoadedRef = useRef(false);

    const AD_ACTIVE = true

    useEffect(() => {
        if (!AD_ACTIVE || !containerRef.current || scriptLoadedRef.current) return;

        const container = containerRef.current;
        scriptLoadedRef.current = true;
        
        // Ensure the container is clean before appending
        const target = container.querySelector('._rn_target_') || container;
        target.innerHTML = '';

        // Setup unique ID for tracking
        const uniqueId = `slot-${format}-${Math.random().toString(36).substring(2, 9)}`;
        container.setAttribute('data-id', uniqueId);

        // Create the isolation iframe
        const frame = document.createElement('iframe');
        frame.style.width = '100%';
        frame.style.height = '100%';
        frame.style.border = 'none';
        frame.style.overflow = 'hidden';
        frame.setAttribute('scrolling', 'no');
        frame.setAttribute('frameborder', '0');
        
        target.appendChild(frame);

        const frameDoc = frame.contentDocument || frame.contentWindow?.document;
        if (!frameDoc) return;

        if (format === 'native') {
            frameDoc.open();
            frameDoc.write(`
                <html>
                    <body style="margin:0;padding:0;overflow:hidden;">
                        <div id="container-5b95a5dd0ddbde1c299fda173e0428f2"></div>
                        <script>
                            (function() {
                                var s = document.createElement('script');
                                s.src = '/media-stream/beta/5b95a5dd0ddbde1c299fda173e0428f2/invoke.js';
                                s.onerror = function() {
                                    var f = document.createElement('script');
                                    f.src = 'https://pl28985299.profitablecpmratenetwork.com/5b95a5dd0ddbde1c299fda173e0428f2/invoke.js';
                                    document.body.appendChild(f);
                                };
                                document.body.appendChild(s);
                            })();
                        </script>
                    </body>
                </html>
            `);
            frameDoc.close();
            return;
        }

        const config = {
            '300x250': { key: '5ac183ef3bfadd4ae406dc3be1bb6909', width: 300, height: 250 },
            '160x300': { key: '5ac183ef3bfadd4ae406dc3be1bb6909', width: 160, height: 300 },
            '320x50':  { key: '5ac183ef3bfadd4ae406dc3be1bb6909', width: 320, height: 50 },
        }[format];

        if (config) {
            frameDoc.write(`
                <html>
                    <body style="margin:0;padding:0;overflow:hidden;display:flex;justify-content:center;align-items:center;min-height:100vh;">
                        <div id="_rn_d2b">
                            <script type="text/javascript">
                                atOptions = {
                                    'key' : '${config.key}',
                                    'format' : 'iframe',
                                    'height' : ${config.height},
                                    'width' : ${config.width},
                                    'params' : {}
                                };
                                (function() {
                                    var s = document.createElement('script');
                                    s.src = '/media-stream/alpha/${config.key}/invoke.js';
                                    s.onerror = function() {
                                        var f = document.createElement('script');
                                        f.src = 'https://www.highperformanceformat.com/${config.key}/invoke.js';
                                        document.body.appendChild(f);
                                    };
                                    document.body.appendChild(s);
                                })();
                            </script>
                        </div>
                    </body>
                </html>
            `);
        }
        frameDoc.close();

    }, [format, AD_ACTIVE]);

    if (!AD_ACTIVE) return null

    // Helper to get exact CSS classes for size
    const getSlotSizeClass = () => {
        switch(format) {
            case '300x250': return 'w-[300px] h-[250px]';
            case '160x300': return 'w-[160px] h-[300px]';
            case '320x50':  return 'w-[320px] h-[50px]';
            default:        return 'w-full min-h-[100px]';
        }
    }

    return (
        <div className="w-full flex flex-col items-center my-8">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-medium">Sponsored</span>
            <div 
                ref={containerRef}
                className={`overflow-hidden flex items-center justify-center transition-all ${getSlotSizeClass()} _info_v2_`}
                style={{ 
                    maxWidth: format === '300x250' ? '300px' : format === '160x300' ? '160px' : '100%'
                }}
            >
                <div className="_rn_target_ w-full h-full flex items-center justify-center">
                    {/* The ad iframe will be injected here */}
                </div>
            </div>
        </div>
    )
}
