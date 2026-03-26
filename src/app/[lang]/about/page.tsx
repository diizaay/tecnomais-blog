import Image from 'next/image'
import { getDictionary, Locale } from '@/lib/get-dictionary'

export default async function AboutPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dict = await getDictionary(lang)
    const a = dict.about
    
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <main className="flex-grow pt-32 pb-20">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="max-w-4xl mx-auto text-center mb-20">
                        <span className="text-[#0066cc] font-bold uppercase tracking-[0.2em] text-[13px]">
                            {a.mission}
                        </span>
                        <h1 className="text-[48px] md:text-[72px] font-extrabold tracking-tight text-[#1d1d1f] leading-[1.1] mt-6 mb-10">
                            {a.futureTitle}
                        </h1>
                        <p className="text-[22px] md:text-[28px] text-[#86868b] leading-relaxed font-medium">
                            {a.description}
                        </p>
                    </div>


                    <div className="grid lg:grid-cols-2 gap-20 max-w-6xl mx-auto items-start">
                        <div className="space-y-8">
                            <h3 className="text-[32px] font-bold text-[#1d1d1f]">
                                {a.meetExperts}
                            </h3>
                            <p className="text-[18px] text-[#424245] leading-relaxed">
                                {a.expertsDescription}
                            </p>
                            
                            <div className="space-y-12 pt-4">
                                {[
                                    { 
                                        name: 'Ana Silva', 
                                        role: lang === 'pt' ? 'Estrategista de Conteúdo' : 'Content Strategist', 
                                        bio: lang === 'pt' 
                                            ? 'Ana é uma entusiasta de tecnologia sempre em busca da próxima grande inovação que irá remodelar as nossas vidas diárias.' 
                                            : 'Ana is a tech enthusiast always searching for the next big innovation that will reshape our daily lives.' 
                                    },
                                    { 
                                        name: 'Marco André', 
                                        role: lang === 'pt' ? 'Desenvolvedor Full-stack' : 'Full-stack Developer', 
                                        bio: lang === 'pt'
                                            ? 'Marco é um analista de gadgets apaixonado por simplificar tecnologia complexa para um público geral.'
                                            : 'Marco is a gadget analyst passionate about simplifying complex technology for a mainstream audience.'
                                    },
                                    { 
                                        name: 'Elena Santos', 
                                        role: lang === 'pt' ? 'Especialista em Tendências Digitais' : 'Digital Trends Specialist', 
                                        bio: lang === 'pt'
                                            ? 'Elena é especialista em tendências digitais e comportamento do consumidor na era da conectividade total.'
                                            : 'Elena specializes in digital trends and consumer behavior in the era of total connectivity.'
                                    }
                                ].map((author, i) => (
                                    <div key={i} className="group border-l-4 border-gray-100 pl-6 hover:border-[#0066cc] transition-colors">
                                        <h4 className="text-[20px] font-bold text-[#1d1d1f] group-hover:text-[#0066cc] transition-colors">{author.name}</h4>
                                        <p className="text-[14px] text-[#0066cc] font-semibold uppercase tracking-widest mt-1">{author.role}</p>
                                        <p className="text-[16px] text-[#86868b] mt-3 leading-relaxed">{author.bio}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-10 bg-[#f5f5f7] p-10 md:p-12 rounded-[3rem] sticky top-32 border border-gray-100/50">
                            <h3 className="text-[32px] font-bold text-[#1d1d1f]">
                                {a.whyWeLead}
                            </h3>
                            <ul className="space-y-8">
                                {[
                                    { 
                                        title: a.curationTitle, 
                                        desc: a.curationDesc 
                                    },
                                    { 
                                        title: a.analysisTitle, 
                                        desc: a.analysisDesc
                                    },
                                    { 
                                        title: a.inclusionTitle, 
                                        desc: a.inclusionDesc
                                    }
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-5">
                                        <div className="w-1.5 h-1.5 bg-[#0066cc] rounded-full mt-2.5 shrink-0 shadow-[0_0_10px_rgba(0,102,204,0.5)]"></div>
                                        <div>
                                            <h4 className="font-bold text-[19px] text-[#1d1d1f]">{item.title}</h4>
                                            <p className="text-[#86868b] mt-2 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

