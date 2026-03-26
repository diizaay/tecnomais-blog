import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getDictionary, Locale } from '@/lib/get-dictionary'

export default async function TermsPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dict = await getDictionary(lang)
    const l = dict.legal
    const lastUpdated = lang === 'pt' ? "12 de Março, 2026" : "March 12, 2026"

    const sections = lang === 'pt' ? [
        {
            title: "1. Aceitação dos Termos",
            content: "Ao aceder ou utilizar o TecnoMais, concorda em ficar vinculado a estes Termos de Serviço e a todas as leis e regulamentos aplicáveis. Se não concordar com qualquer um destes termos, está proibido de utilizar ou aceder a este site."
        },
        {
            title: "2. Licença e Uso",
            content: "É concedida permissão para descarregar temporariamente uma cópia dos materiais no TecnoMais apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título, e sob esta licença, não pode modificar os materiais ou usá-los para qualquer fim comercial."
        },
        {
            title: "3. Isenção de Garantias",
            content: "Os materiais no TecnoMais são fornecidos 'como estão'. O TecnoMais não oferece garantias, expressas ou implícitas, e por este meio isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas de comercialização, adequação a um fim específico ou não violação de propriedade intelectual."
        },
        {
            title: "4. Limitações de Responsabilidade",
            content: "Em caso algum o TecnoMais ou os seus fornecedores serão responsáveis por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro, ou devido a interrupção de negócios) decorrentes do uso ou incapacidade de usar os materiais no TecnoMais, mesmo que o TecnoMais tenha sido notificado da possibilidade de tais danos."
        },
        {
            title: "5. Precisão do Conteúdo",
            content: "Os materiais que aparecem no TecnoMais podem incluir erros técnicos, tipográficos ou fotográficos. O TecnoMais não garante que qualquer um dos materiais no seu website seja preciso, completo ou atual. O TecnoMais pode fazer alterações aos materiais contidos no seu website a qualquer momento sem aviso prévio."
        },
        {
            title: "6. Links Externos",
            content: "O TecnoMais não analisou todos os sites ligados ao seu website e não é responsável pelo conteúdo de qualquer site ligado. A inclusão de qualquer link não implica o endosso do TecnoMais ao site. O uso de qualquer website ligado é por conta e risco do utilizador."
        },
        {
            title: "7. Lei Aplicável",
            content: "Estes termos e condições são regidos e interpretados de acordo com as leis de Angola e o utilizador submete-se irrevogavelmente à jurisdição exclusiva dos tribunais nesse Estado ou localidade."
        }
    ] : [
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
            <main className="flex-grow pt-32 pb-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    <header className="mb-16 border-b border-gray-100 pb-12 text-center md:text-left">
                        <span className="text-[#0066cc] font-bold uppercase tracking-[0.2em] text-[13px] mb-4 block">{l.legalRepo}</span>
                        <h1 className="text-[48px] md:text-[64px] font-extrabold tracking-tight text-[#1d1d1f] leading-tight mb-6">
                            {l.termsTitle}.
                        </h1>
                        <p className="text-[17px] text-gray-500">
                            {l.lastUpdated} {lastUpdated}. {l.readCarefully}
                        </p>
                    </header>

                    <div className="grid md:grid-cols-4 gap-12">
                        {/* Summary Sidebar (TechCrunch style) */}
                        <aside className="md:col-span-1 hidden md:block">
                            <div className="sticky top-32 space-y-6">
                                <h4 className="text-[12px] font-black uppercase tracking-widest text-[#1d1d1f]">{l.inThisDocument}</h4>
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
                                        {l.notBinding}
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
        </div>
    )
}

