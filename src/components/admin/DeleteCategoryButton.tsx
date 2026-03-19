'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteCategoryButton({ id }: { id: string }) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this category? All associated articles might be affected.')) return
        setIsDeleting(true)
        const res = await fetch(`/api/admin/categorias/${id}`, { method: 'DELETE' })
        if (res.ok) {
            router.refresh()
        } else {
            alert('Failed to delete the category.')
            setIsDeleting(false)
        }
    }

    return (
        <button onClick={handleDelete} disabled={isDeleting} className="text-red-500 hover:text-red-700 font-medium text-[14px] disabled:opacity-50">
            {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
    )
}
