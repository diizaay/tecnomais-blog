import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function TermsPage() {
    const lastUpdated = "March 12, 2026"

    const sections = [
        {
            title: "1. Acceptance of Terms",
            content: "By accessing or using TecnoMais, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site."
        },
        {
            title: "2. License and Use",
            content: "Permission is granted to temporarily download one copy of the materials on TecnoMais for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license, you may not modify the materials or use them for any commercial purpose."
        },
        {
            title: "3. Disclaimer of Warranties",
            content: "The materials on TecnoMais are provided on an 'as is' basis. TecnoMais makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement of intellectual property."
        },
        {
            title: "4. Limitations of Liability",
            content: "In no event shall TecnoMais or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on TecnoMais, even if TecnoMais has been notified of the possibility of such damage."
        },
        {
            title: "5. Content Accuracy",
            content: "The materials appearing on TecnoMais could include technical, typographical, or photographic errors. TecnoMais does not warrant that any of the materials on its website are accurate, complete, or current. TecnoMais may make changes to the materials contained on its website at any time without notice."
        },
        {
            title: "6. External Links",
            content: "TecnoMais has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by TecnoMais of the site. Use of any such linked website is at the user's own risk."
        },
        {
            title: "7. Governing Law",
            content: "These terms and conditions are governed by and construed in accordance with the laws of Angola and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location."
        }
    ]

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Navbar theme="light" />
            
            <main className="flex-grow pt-32 pb-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    <header className="mb-16 border-b border-gray-100 pb-12 text-center md:text-left">
                        <span className="text-[#0066cc] font-bold uppercase tracking-[0.2em] text-[13px] mb-4 block">Legal Repository</span>
                        <h1 className="text-[48px] md:text-[64px] font-extrabold tracking-tight text-[#1d1d1f] leading-tight mb-6">
                            Terms of Service.
                        </h1>
                        <p className="text-[17px] text-gray-500">
                            Updates effective {lastUpdated}. Please read these terms carefully.
                        </p>
                    </header>

                    <div className="grid md:grid-cols-4 gap-12">
                        {/* Summary Sidebar (TechCrunch style) */}
                        <aside className="md:col-span-1 hidden md:block">
                            <div className="sticky top-32 space-y-6">
                                <h4 className="text-[12px] font-black uppercase tracking-widest text-[#1d1d1f]">In this document</h4>
                                <nav className="space-y-4">
                                    {sections.map((section, i) => (
                                        <Link 
                                            key={i} 
                                            href={`#section-${i}`}
                                            className="block text-[14px] text-gray-400 font-medium hover:text-[#0066cc] transition-colors leading-tight"
                                        >
                                            {section.title.split('. ')[1]}
                                        </Link>
                                    ))}
                                </nav>
                                <div className="pt-8 border-t border-gray-100 mt-8">
                                    <p className="text-[12px] text-gray-400 leading-relaxed italic">
                                        Note: This summary is provided for convenience and is not legally binding.
                                    </p>
                                </div>
                            </div>
                        </aside>

                        {/* Main Terms Content */}
                        <div className="md:col-span-3 space-y-20">
                            {sections.map((section, index) => (
                                <section key={index} id={`section-${index}`} className="scroll-mt-32">
                                    <h2 className="text-[24px] md:text-[32px] font-bold text-[#1d1d1f] mb-8 flex items-baseline gap-4">
                                        <span className="text-[#0066cc] text-[18px] opacity-30">{index + 1}</span>
                                        {section.title.split('. ')[1]}
                                    </h2>
                                    <div className="prose prose-lg max-w-none text-[#424245] leading-relaxed">
                                        <p>{section.content}</p>
                                    </div>
                                </section>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
