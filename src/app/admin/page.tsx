import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardOverview() {
    const articleCount = await prisma.article.count()
    const categoryCount = await prisma.category.count()
    const tagCount = await prisma.tag.count()

    return (
        <div>
            <h1 className="text-[28px] font-bold tracking-tight text-[#1d1d1f] mb-8">
                Overview
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                    <span className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Articles</span>
                    <span className="text-[36px] font-bold text-[#1d1d1f]">{articleCount}</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                    <span className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Active Categories</span>
                    <span className="text-[36px] font-bold text-[#1d1d1f]">{categoryCount}</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                    <span className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Existing Tags</span>
                    <span className="text-[36px] font-bold text-[#1d1d1f]">{tagCount}</span>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center max-w-2xl mx-auto mt-12">
                <h3 className="text-[21px] font-bold text-[#1d1d1f] mb-4">Welcome to the Dashboard</h3>
                <p className="text-[#86868b] text-[15px] leading-relaxed">
                    From this panel you can create and edit SEO-optimized articles, manage content tags, and analyze the amount of published articles. The entire design was built to be fast and fluid.
                </p>
            </div>
        </div>
    )
}
