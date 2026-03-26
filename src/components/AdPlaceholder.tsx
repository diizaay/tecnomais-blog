import React from 'react'

interface AdPlaceholderProps {
    position: 'header' | 'in-content' | 'sidebar' | 'footer'
}

export default function AdPlaceholder({ position }: AdPlaceholderProps) {
    // Configurable dimensions based on placement
    const dimensions = {
        'header': 'w-full h-[90px]',
        'in-content': 'w-full h-[250px]',
        'sidebar': 'w-[300px] h-[250px]',
        'footer': 'w-full h-[90px]'
    }

    // Always show these ads for now as requested
    const AD_ACTIVE = true

    if (!AD_ACTIVE) return null

    if (position === 'sidebar' || position === 'in-content') {
        return (
            <div className="w-full flex flex-col items-center my-8">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Advertisement</span>
                <div className={`ad-container ${dimensions[position]} overflow-hidden`}>
                    <div dangerouslySetInnerHTML={{
                        __html: `
                        <script type="text/javascript">
                            atOptions = {
                                'key' : '5d4ff7c9247862b7ba91f0094f598519',
                                'format' : 'iframe',
                                'height' : 250,
                                'width' : 300,
                                'params' : {}
                            };
                        </script>
                        <script type="text/javascript" src="https://www.highperformanceformat.com/5d4ff7c9247862b7ba91f0094f598519/invoke.js"></script>
                        `}} 
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="w-full flex justify-center my-8">
            <div id={`ad-slot-${position}`} className={`ad-container ${dimensions[position]} bg-gray-50/5 border border-gray-100/10 rounded-xl flex items-center justify-center`} />
        </div>
    )
}
