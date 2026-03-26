import { getDictionary, Locale } from '@/lib/get-dictionary'
import NewsletterClient from '@/components/NewsletterClient'

export default async function NewsletterPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dict = await getDictionary(lang)
    
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <main className="flex-grow pt-32 pb-20">
                <NewsletterClient lang={lang} dict={dict.newsletter_page} />
            </main>
        </div>
    )
}

