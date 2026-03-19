import prisma from '@/lib/prisma'
import Link from 'next/link'
import DeleteArticleButton from '@/components/admin/DeleteArticleButton'

export const dynamic = 'force-dynamic'

export default async function AdminArticlesList() {
    const articles = await prisma.article.findMany({
        orderBy: { publishedDate: 'desc' },
        include: { categories: true }
    })

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-[28px] font-bold tracking-tight text-[#1d1d1f]">
                    Manage Articles
                </h1>
                <Link href="/admin/artigos/novo" className="btn-apple-primary !px-4 !py-2 !text-[14px]">
                    + New Article
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="py-4 px-6 text-[13px] font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="py-4 px-6 text-[13px] font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="py-4 px-6 text-[13px] font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="py-4 px-6 text-[13px] font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map((article) => (
                            <tr key={article.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-6">
                                    <p className="font-semibold text-[#1d1d1f] text-[15px]">{article.title}</p>
                                    <p className="text-[13px] text-gray-500">{article.slug}</p>
                                </td>
                                <td className="py-4 px-6 text-[14px] text-gray-600">
                                    {(article as any).categories?.map((c: any) => c.name).join(', ') || 'N/A'}
                                </td>
                                <td className="py-4 px-6 text-[14px] text-gray-600">
                                    {new Date(article.publishedDate).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <div className="flex items-center justify-end space-x-3">
                                        <Link href={`/artigo/${article.slug}`} target="_blank" className="text-blue-600 hover:text-blue-800 text-[13px] font-medium">View</Link>
                                        <Link href={`/admin/artigos/${article.id}/editar`} className="text-gray-500 hover:text-gray-800 text-[13px] font-medium">Edit</Link>
                                        <DeleteArticleButton id={article.id} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {articles.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-8 text-center text-gray-500">
                                    No articles found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
