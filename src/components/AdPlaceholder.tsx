import React from 'react'

interface AdPlaceholderProps {
    position: 'header' | 'in-content' | 'sidebar' | 'footer'
}

export default function AdPlaceholder({ position }: AdPlaceholderProps) {
    // Configurable dimensions based on placement
    const dimensions = {
        'header': 'w-full h-[90px]',
        'in-content': 'w-full h-[250px]',
        'sidebar': 'w-[300px] h-[600px]',
        'footer': 'w-full h-[90px]'
    }

    // Se não houver AD a ser exibido, não retornar nada para evitar espaços em branco gigantes
    const AD_ACTIVE = process.env.NEXT_PUBLIC_ADSENSE_ACTIVE === 'true'

    if (!AD_ACTIVE) return null

    return (
        <div className="w-full flex justify-center my-8">
            <div id={`ad-slot-${position}`} className={`ad-container ${dimensions[position]} bg-transparent`} />
        </div>
    )
}
