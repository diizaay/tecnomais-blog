import CategoryForm from '@/components/admin/CategoryForm'

export const dynamic = 'force-dynamic'

export default function NewCategoryPage() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-[28px] font-bold tracking-tight text-[#1d1d1f]">
                    Create New Category
                </h1>
            </div>
            <CategoryForm />
        </div>
    )
}
