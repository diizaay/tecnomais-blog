import prisma from '@/lib/prisma'
import Link from 'next/link'
import DeleteCategoryButton from '@/components/admin/DeleteCategoryButton'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesList() {
    const categories = await prisma.category.findMany()

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-[28px] font-bold tracking-tight text-[#1d1d1f]">
                    Manage Categories
                </h1>
                <Link href="/admin/categorias/novo" className="btn-apple-primary !px-4 !py-2 !text-[14px]">
                    + New Category
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="py-4 px-6 text-[13px] font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="py-4 px-6 text-[13px] font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                            <th className="py-4 px-6 text-[13px] font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-6">
                                    <p className="font-semibold text-[#1d1d1f] text-[15px]">{category.name}</p>
                                </td>
                                <td className="py-4 px-6 text-[14px] text-gray-600">
                                    {category.slug}
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <div className="flex items-center justify-end space-x-3">
                                        <Link href={`/category/${category.slug}`} target="_blank" className="text-blue-600 hover:text-blue-800 text-[13px] font-medium">View</Link>
                                        <Link href={`/admin/categorias/${category.id}/editar`} className="text-gray-500 hover:text-gray-800 text-[13px] font-medium">Edit</Link>
                                        <DeleteCategoryButton id={category.id} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={3} className="py-8 text-center text-gray-500">
                                    No categories found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
