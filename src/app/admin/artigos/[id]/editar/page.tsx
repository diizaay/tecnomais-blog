import prisma from '@/lib/prisma'
import ArticleForm from '@/components/admin/ArticleForm'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditArticlePage({ params }: { params: { id: string } }) {
    const article = await prisma.article.findUnique({ 
        where: { id: params.id },
        include: { tags: true } 
    })
    if (!article) notFound()

    const categories = await prisma.category.findMany()

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-[28px] font-bold tracking-tight text-[#1d1d1f]">
                    Edit Article
                </h1>
            </div>
            <ArticleForm initialData={article} categories={categories} />
        </div>
    )
}
