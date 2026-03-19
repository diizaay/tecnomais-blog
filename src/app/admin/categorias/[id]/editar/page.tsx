import prisma from '@/lib/prisma'
import CategoryForm from '@/components/admin/CategoryForm'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
    const category = await prisma.category.findUnique({ where: { id: params.id } })
    if (!category) notFound()

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-[28px] font-bold tracking-tight text-[#1d1d1f]">
                    Edit Category
                </h1>
            </div>
            <CategoryForm initialData={category} />
        </div>
    )
}
