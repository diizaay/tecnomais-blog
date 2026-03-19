import prisma from '@/lib/prisma'
import ArticleForm from '@/components/admin/ArticleForm'

export const dynamic = 'force-dynamic'

export default async function NewArticlePage() {
    const categories = await prisma.category.findMany()

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-[28px] font-bold tracking-tight text-[#1d1d1f]">
                    Create New Article
                </h1>
            </div>
            <ArticleForm categories={categories} />
        </div>
    )
}
