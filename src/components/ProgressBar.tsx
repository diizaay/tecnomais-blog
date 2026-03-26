'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// Configure NProgress
NProgress.configure({ 
    showSpinner: false, 
    easing: 'ease', 
    speed: 500,
    minimum: 0.3
})

export default function ProgressBar() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        // This runs whenever pathname or searchParams changes
        NProgress.done()
        
        // We use a small timeout to make sure we don't start the progress bar
        // for instant client-side transitions, but show it for longer fetches
        return () => {
            NProgress.start()
        }
    }, [pathname, searchParams])

    return (
        <style jsx global>{`
            #nprogress .bar {
                background: #0066cc !important;
                height: 3px !important;
                z-index: 10000 !important;
            }
            #nprogress .peg {
                box-shadow: 0 0 10px #0066cc, 0 0 5px #0066cc !important;
            }
        `}</style>
    )
}
