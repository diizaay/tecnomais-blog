import React from 'react'

interface AdPlaceholderProps {
    position?: 'header' | 'in-content' | 'sidebar' | 'footer'
    format?: '300x250' | '160x300' | '320x50' | 'native'
}

export default function AdPlaceholder({ position, format = '300x250' }: AdPlaceholderProps) {
    // Configurable dimensions based on format
    const dimensions = {
        '300x250': 'w-[300px] h-[250px]',
        '160x300': 'w-[160px] h-[300px]',
        '320x50': 'w-[320px] h-[50px]',
        'native': 'w-full min-h-[100px]'
    }

    const AD_ACTIVE = true

    if (!AD_ACTIVE) return null

    const renderAd = () => {
        switch (format) {
            case 'native':
                return (
                    <>
                        <script async={true} data-cfasync="false" src="https://pl28985299.profitablecpmratenetwork.com/5b95a5dd0ddbde1c299fda173e0428f2/invoke.js"></script>
                        <div id="container-5b95a5dd0ddbde1c299fda173e0428f2"></div>
                    </>
                )
            case '160x300':
                return (
                    <div dangerouslySetInnerHTML={{
                        __html: `
                        <script type="text/javascript">
                            atOptions = {
                                'key' : '5ac183ef3bfadd4ae406dc3be1bb6909',
                                'format' : 'iframe',
                                'height' : 300,
                                'width' : 160,
                                'params' : {}
                            };
                        </script>
                        <script type="text/javascript" src="https://www.highperformanceformat.com/5ac183ef3bfadd4ae406dc3be1bb6909/invoke.js"></script>
                        `}} 
                    />
                )
            case '320x50':
                return (
                    <div dangerouslySetInnerHTML={{
                        __html: `
                        <script type="text/javascript">
                            atOptions = {
                                'key' : '15c1ab0412e2ef634b63d8cc4697344e',
                                'format' : 'iframe',
                                'height' : 50,
                                'width' : 320,
                                'params' : {}
                            };
                        </script>
                        <script type="text/javascript" src="https://www.highperformanceformat.com/15c1ab0412e2ef634b63d8cc4697344e/invoke.js"></script>
                        `}} 
                    />
                )
            case '300x250':
            default:
                return (
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
                )
        }
    }

    return (
        <div className="w-full flex flex-col items-center my-8">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Advertisement</span>
            <div className={`ad-container ${dimensions[format]} overflow-hidden`}>
                {renderAd()}
            </div>
        </div>
    )
}
