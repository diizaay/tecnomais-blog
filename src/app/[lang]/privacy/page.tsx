import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getDictionary, Locale } from '@/lib/get-dictionary'

export default async function PrivacyPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dict = await getDictionary(lang)
    const l = dict.legal
    const lastUpdated = lang === 'pt' ? "12 de Março, 2026" : "March 12, 2026"

    const sections = lang === 'pt' ? [
        {
            title: "1. Informações que Recolhemos",
            content: "Recolhemos informações para fornecer melhores serviços a todos os nossos utilizadores. Isso inclui informações que nos fornece (como o seu endereço de email para subscrições de newsletter) e informações que obtemos do seu uso dos nossos serviços (como informações do dispositivo e informações de registo)."
        },
        {
            title: "2. Como Usamos as Informações",
            content: "Usamos as informações que recolhemos para fornecer, manter, proteger e melhorar os nossos serviços, para desenvolver novos e para proteger o TecnoMais e os nossos utilizadores. Também usamos estas informações para lhe oferecer conteúdo personalizado – como resultados de pesquisa mais relevantes."
        },
        {
            title: "3. Informações que Partilhamos",
            content: "Não partilhamos informações pessoais com empresas, organizações e indivíduos fora do TecnoMais, a menos que se aplique uma das seguintes circunstâncias: com o seu consentimento, para processamento externo ou por razões legais."
        },
        {
            title: "4. Segurança da Informação",
            content: "Trabalhamos arduamente para proteger o TecnoMais e os nossos utilizadores contra o acesso não autorizado ou alteração, divulgação ou destruição não autorizada de informações que detemos. Restringimos o acesso a informações pessoais a funcionários e contratados que precisam de conhecer essas informações."
        },
        {
            title: "5. Os Seus Direitos de Privacidade",
            content: "Dependendo de onde vive, pode ter certos direitos em relação às suas informações pessoais, incluindo o direito de aceder, corrigir ou eliminar as informações pessoais que detemos sobre si. Também pode opor-se a determinado processamento dos seus dados."
        },
        {
            title: "6. Alterações a esta Política",
            content: "A nossa Política de Privacidade pode mudar de tempos a tempos. Não reduziremos os seus direitos sob esta Política de Privacidade sem o seu consentimento explícito. Publicaremos quaisquer alterações à política de privacidade nesta página e, se as alterações forem significativas, forneceremos um aviso mais proeminente."
        }
    ] : [
        {
            title: "1. Information We Collect",
            content: "We collect information to provide better services to all our users. This includes information you provide to us (like your email address for newsletter subscriptions) and information we get from your use of our services (like device information and log information)."
        },
        {
            title: "2. How We Use Information",
            content: "We use the information we collect to provide, maintain, protect, and improve our services, to develop new ones, and to protect TecnoMais and our users. We also use this information to offer you tailored content – like giving you more relevant search results."
        },
        {
            title: "3. Information We Share",
            content: "We do not share personal information with companies, organizations, and individuals outside of TecnoMais unless one of the following circumstances applies: with your consent, for external processing, or for legal reasons."
        },
        {
            title: "4. Information Security",
            content: "We work hard to protect TecnoMais and our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold. We restrict access to personal information to employees and contractors who need to know that information."
        },
        {
            title: "5. Your Privacy Rights",
            content: "Depending on where you live, you may have certain rights regarding your personal information, including the right to access, correct, or delete the personal information we hold about you. You can also object to certain processing of your data."
        },
        {
            title: "6. Changes to this Policy",
            content: "Our Privacy Policy may change from time to time. We will not reduce your rights under this Privacy Policy without your explicit consent. We will post any privacy policy changes on this page and, if the changes are significant, we will provide a more prominent notice."
        }
    ]

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <main className="flex-grow pt-32 pb-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    <header className="mb-16 border-b border-gray-100 pb-12">
                        <span className="text-[#0066cc] font-bold uppercase tracking-[0.2em] text-[13px] mb-4 block">{l.legalCenter}</span>
                        <h1 className="text-[48px] md:text-[64px] font-extrabold tracking-tight text-[#1d1d1f] leading-tight mb-6">
                            {l.privacyTitle}.
                        </h1>
                        <p className="text-[17px] text-gray-500">
                            {l.lastUpdated} {lastUpdated}. {l.privacyCritical}
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
                        <h3 className="text-[20px] font-bold text-[#1d1d1f] mb-4 text-center md:text-left">{l.questionsPrivacy}</h3>
                        <p className="text-[16px] text-[#86868b] leading-relaxed mb-8 text-center md:text-left">
                            {l.privacyOfficer} <span className="text-[#0066cc] font-medium">privacy@tecnomais.online</span>.
                        </p>
                        <div className="flex justify-center md:justify-start">
                            <button className="btn-apple-primary !px-8">{l.contactLegal}</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

