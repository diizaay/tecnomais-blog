import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getDictionary, Locale } from '@/lib/get-dictionary'

export default async function CookiePolicyPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dict = await getDictionary(lang)
    const l = dict.legal
    const lastUpdated = lang === 'pt' ? "20 de Março, 2026" : "March 20, 2026"

    const sections = lang === 'pt' ? [
        {
            title: "1. O Que São Cookies",
            content: "Cookies são pequenos ficheiros de texto que são colocados no seu computador ou dispositivo móvel pelos websites que visita. São amplamente utilizados para fazer os websites funcionarem, ou funcionarem de forma mais eficiente, bem como para fornecer informações aos proprietários do site."
        },
        {
            title: "2. Como Usamos Cookies",
            content: "O TecnoMais utiliza cookies para compreender como interage com o nosso website, para lembrar as suas preferências e para lhe proporcionar uma experiência mais personalizada. Utilizamos tanto cookies de sessão (que expiram assim que fecha o seu navegador) como cookies persistentes (que permanecem no seu dispositivo até que os elimine)."
        },
        {
            title: "3. Tipos de Cookies que Usamos",
            content: "Utilizamos cookies essenciais para o funcionamento do nosso site, cookies de desempenho para analisar como o nosso site é utilizado e cookies de funcionalidade para lembrar as suas configurações. Também podemos utilizar cookies de terceiros para fins publicitários ou analíticos."
        },
        {
            title: "4. As Suas Escolhas",
            content: "A maioria dos navegadores permite algum controlo da maioria dos cookies através das definições do navegador. Para saber mais sobre cookies, incluindo como ver que cookies foram definidos e como geri-los e eliminá-los, visite www.aboutcookies.org ou www.allaboutcookies.org."
        },
        {
            title: "5. Alterações a Esta Política",
            content: "Podemos atualizar a nossa Política de Cookies periodicamente. Notificá-lo-emos de quaisquer alterações publicando a nova Política de Cookies nesta página. É aconselhável rever esta Política de Cookies periodicamente para quaisquer alterações."
        }
    ] : [
        {
            title: "1. What Are Cookies",
            content: "Cookies are small text files that are placed on your computer or mobile device by websites that you visit. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site."
        },
        {
            title: "2. How We Use Cookies",
            content: "TecnoMais uses cookies to understand how you interact with our website, to remember your preferences, and to provide you with a more personalized experience. We use both session cookies (which expire once you close your web browser) and persistent cookies (which stay on your device until you delete them)."
        },
        {
            title: "3. Types of Cookies We Use",
            content: "We use essential cookies for the operation of our site, performance cookies to analyze how our site is used, and functionality cookies to remember your settings. We may also use third-party cookies for advertising or analytics purposes."
        },
        {
            title: "4. Your Choices",
            content: "Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit www.aboutcookies.org or www.allaboutcookies.org."
        },
        {
            title: "5. Changes to This Policy",
            content: "We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page. You are advised to review this Cookie Policy periodically for any changes."
        }
    ]

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <main className="flex-grow pt-32 pb-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    <header className="mb-16 border-b border-gray-100 pb-12 text-center md:text-left">
                        <span className="text-[#0066cc] font-bold uppercase tracking-[0.2em] text-[13px] mb-4 block">{l.compliance}</span>
                        <h1 className="text-[48px] md:text-[64px] font-extrabold tracking-tight text-[#1d1d1f] leading-tight mb-6">
                            {l.cookieTitle}.
                        </h1>
                        <p className="text-[17px] text-gray-500">
                            {l.lastUpdated} {lastUpdated}. {l.transparency}
                        </p>
                    </header>

                    <div className="space-y-16">
                        {sections.map((section, index) => (
                            <section key={index}>
                                <h2 className="text-[24px] md:text-[28px] font-bold text-[#1d1d1f] mb-6">
                                    {section.title}
                                </h2>
                                <div className="prose prose-lg max-w-none text-[#424245] leading-relaxed">
                                    <p>{section.content}</p>
                                </div>
                            </section>
                        ))}
                    </div>

                    <div className="mt-20 p-10 bg-[#f5f5f7] rounded-[2.5rem] border border-gray-100">
                        <h3 className="text-[20px] font-bold text-[#1d1d1f] mb-4 text-center md:text-left">{l.questionsCookies}</h3>
                        <p className="text-[16px] text-[#86868b] leading-relaxed mb-8 text-center md:text-left">
                            {l.cookieOfficer} <span className="text-[#0066cc] font-medium">privacy@tecnomais.online</span>.
                        </p>
                        <div className="flex justify-center md:justify-start">
                            <button className="btn-apple-primary !px-8">{l.privacyCenter}</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

