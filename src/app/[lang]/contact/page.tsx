import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { getDictionary, Locale } from '@/lib/get-dictionary'

export default async function ContactPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dict = await getDictionary(lang)
    const c = dict.contact

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <main className="flex-grow pt-32 pb-20">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="max-w-2xl mb-16">
                        <h1 className="text-[48px] md:text-[64px] font-extrabold tracking-tight text-[#1d1d1f] leading-none mb-6">
                            {c.title}.
                        </h1>
                        <p className="text-[20px] md:text-[24px] text-[#86868b] leading-relaxed">
                            {c.subtitle}
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-20">
                        {/* Contact Form */}
                        <div className="bg-[#f5f5f7] rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm">
                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[14px] font-bold text-[#1d1d1f] ml-1">{c.name}</label>
                                        <input 
                                            type="text" 
                                            placeholder={c.name}
                                            className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-[17px] focus:outline-none focus:border-[#0066cc] transition-colors"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[14px] font-bold text-[#1d1d1f] ml-1">{c.email}</label>
                                        <input 
                                            type="email" 
                                            placeholder="name@email.com"
                                            className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-[17px] focus:outline-none focus:border-[#0066cc] transition-colors"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#1d1d1f] ml-1">{c.subject}</label>
                                    <input 
                                        type="text" 
                                        placeholder={c.subject}
                                        className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-[17px] focus:outline-none focus:border-[#0066cc] transition-colors"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#1d1d1f] ml-1">{c.message}</label>
                                    <textarea 
                                        rows={6}
                                        placeholder={c.message}
                                        className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-[17px] focus:outline-none focus:border-[#0066cc] transition-colors resize-none"
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn-apple-primary !w-full !py-4 !text-[17px] !rounded-2xl">
                                    {c.send}
                                </button>
                            </form>
                        </div>

                        {/* Info & Reach */}
                        <div className="flex flex-col justify-center">
                            <div className="space-y-12">
                                <div>
                                    <h3 className="text-[24px] font-bold text-[#1d1d1f] mb-6">
                                        {lang === 'pt' ? 'Conecte-se em todo o mundo.' : 'Connect across the globe.'}
                                    </h3>
                                    <div className="space-y-8">
                                        <div className="flex items-start space-x-6">
                                            <div className="w-12 h-12 bg-blue-50 text-[#0066cc] rounded-2xl flex items-center justify-center shrink-0">
                                                <Mail size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#1d1d1f]">
                                                    {lang === 'pt' ? 'Perguntas Gerais' : 'General Inquiries'}
                                                </h4>
                                                <p className="text-[#86868b]">oi@tecnomais.online</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-6">
                                            <div className="w-12 h-12 bg-blue-50 text-[#0066cc] rounded-2xl flex items-center justify-center shrink-0">
                                                <Phone size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#1d1d1f]">
                                                    {lang === 'pt' ? 'Suporte Telefónico' : 'Phone Support'}
                                                </h4>
                                                <p className="text-[#86868b]">+244 949 407 724</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-6">
                                            <div className="w-12 h-12 bg-blue-50 text-[#0066cc] rounded-2xl flex items-center justify-center shrink-0">
                                                <MapPin size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#1d1d1f]">
                                                    {lang === 'pt' ? 'Escritório' : 'Office'}
                                                </h4>
                                                <p className="text-[#86868b]">Luanda, Angola</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-200">
                                    <h4 className="font-bold text-[#1d1d1f] mb-2">
                                        {lang === 'pt' ? 'Dicas Editoriais' : 'Editorial Tips'}
                                    </h4>
                                    <p className="text-[15px] text-[#86868b] leading-relaxed">
                                        {lang === 'pt' 
                                            ? 'Tem uma história de última hora ou uma dica confidencial? A nossa equipa editorial está sempre à procura da próxima grande história em tecnologia. Envie um email para '
                                            : 'Have a breaking story or a confidential tip? Our editorial team is always looking for the next big story in tech. Email us at '}
                                        <span className="text-[#0066cc] font-medium">tips@tecnomais.online</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

