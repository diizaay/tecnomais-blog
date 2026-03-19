import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { siteConfig } from "@/lib/siteConfig"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession()

    // Protect all /admin routes
    if (!session) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-[#f5f5f7] flex">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100 uppercase tracking-wider font-semibold">
                    <Link href="/" className="font-bold text-[20px] tracking-tight flex items-center">
                        {siteConfig.logo.url ? (
                            <Image
                                src={siteConfig.logo.url}
                                alt={siteConfig.logo.alt}
                                width={siteConfig.logo.width}
                                height={siteConfig.logo.height}
                                className="object-contain"
                            />
                        ) : (
                            <>
                                Tecno<span className="text-[#0066cc]">Mais</span>
                            </>
                        )}
                    </Link>
                    <p className="text-[12px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">Dashboard</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin" className="block px-4 py-3 text-[15px] font-medium text-[#1d1d1f] bg-gray-50 rounded-lg">
                        Overview
                    </Link>
                    <Link href="/admin/artigos" className="block px-4 py-3 text-[15px] font-medium text-gray-600 hover:text-[#1d1d1f] hover:bg-gray-50 rounded-lg transition-colors">
                        Articles
                    </Link>
                    <Link href="/admin/categorias" className="block px-4 py-3 text-[15px] font-medium text-gray-600 hover:text-[#1d1d1f] hover:bg-gray-50 rounded-lg transition-colors">
                        Categories
                    </Link>
                    <Link href="/admin/subscribers" className="block px-4 py-3 text-[15px] font-medium text-gray-600 hover:text-[#1d1d1f] hover:bg-gray-50 rounded-lg transition-colors">
                        Subscribers
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#0066cc] text-white flex items-center justify-center font-bold">
                            A
                        </div>
                        <div>
                            <p className="text-[14px] font-medium text-[#1d1d1f]">Admin User</p>
                            <p className="text-[12px] text-gray-500">{session.user?.email}</p>
                        </div>
                    </div>
                    {/* SignOut must be a client component, simplifying here by linking API */}
                    <Link href="/api/auth/signout" className="block text-center text-[13px] font-medium text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors">
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Admin Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between md:hidden">
                    <span className="font-bold">TecnoMais Admin</span>
                    <Link href="/api/auth/signout" className="text-red-600 text-[14px] font-medium">Logout</Link>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
