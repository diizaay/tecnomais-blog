import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
    const lastUpdated = "March 12, 2026"

    const sections = [
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
            <Navbar theme="light" />
            
            <main className="flex-grow pt-32 pb-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    <header className="mb-16 border-b border-gray-100 pb-12">
                        <span className="text-[#0066cc] font-bold uppercase tracking-[0.2em] text-[13px] mb-4 block">Legal Center</span>
                        <h1 className="text-[48px] md:text-[64px] font-extrabold tracking-tight text-[#1d1d1f] leading-tight mb-6">
                            Privacy Policy.
                        </h1>
                        <p className="text-[17px] text-gray-500">
                            Effective as of {lastUpdated}. Your privacy is critical to us at TecnoMais.
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
                        <h3 className="text-[20px] font-bold text-[#1d1d1f] mb-4 text-center md:text-left">Need more clarification?</h3>
                        <p className="text-[16px] text-[#86868b] leading-relaxed mb-8 text-center md:text-left">
                            If you have any questions about our Privacy Policy, please contact our legal team at <span className="text-[#0066cc] font-medium">privacy@tecnomais.online</span>.
                        </p>
                        <div className="flex justify-center md:justify-start">
                            <button className="btn-apple-primary !px-8">Contact Legal</button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
