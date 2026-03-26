import prisma from '@/lib/prisma'
import ArticleCard from '@/components/ArticleCard'
import AdPlaceholder from '@/components/AdPlaceholder'
import NewsHorizontalCard from '@/components/NewsHorizontalCard'
import Link from 'next/link'
import OptimizedCloudinaryImage from '@/components/OptimizedCloudinaryImage'
import { getDictionary, Locale } from '@/lib/get-dictionary'

export const dynamic = 'force-dynamic'

export default async function Home({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang)
  
  try {
    // Fetch category IDs for filtering
    const targetSlugs = lang === 'pt' 
      ? ['noticias', 'ferramentas-de-ia', 'tendencias-tecnologicas']
      : ['news', 'ai-tools', 'technology-trends'];

    const categories = await prisma.category.findMany({
      where: { slug: { in: targetSlugs }, language: lang }
    }).catch((e: any) => {
      console.error('Error fetching categories:', e);
      return [];
    });
    
    const newsCatId = categories.find(c => c.slug === (lang === 'pt' ? 'noticias' : 'news'))?.id
    const aiCatId = categories.find(c => c.slug === (lang === 'pt' ? 'ferramentas-de-ia' : 'ai-tools'))?.id
    const trendsCatId = categories.find(c => c.slug === (lang === 'pt' ? 'tendencias-tecnologicas' : 'technology-trends'))?.id

    // Map slugs to display names for fallback using dictionary patterns if needed
    const categoryNames: Record<string, string> = {
        'news': 'News',
        'noticias': 'Notícias',
        'ai-tools': 'AI Tools',
        'ferramentas-de-ia': 'Ferramentas IA',
        'technology-trends': 'Technology Trends',
        'tendencias-tecnologicas': 'Tendências'
    }

    // 1. Fetch Featured Article (Hero) - Only show if in 'news' category
    let featured = await (prisma as any).article.findFirst({
      where: newsCatId ? {
        categoryIds: { has: newsCatId },
        language: lang
      } : { language: lang },
      orderBy: { publishedDate: 'desc' },
      include: { categories: true, author: true }
    }).catch((e: any) => {
        console.error('Error fetching featured article:', e);
        return null;
    });

    // Fallback logic if needed (e.g. content still being translated)
    if (!featured && lang === 'en') {
        featured = await (prisma as any).article.findFirst({
            where: { language: 'pt' },
            orderBy: { publishedDate: 'desc' },
            include: { categories: true, author: true }
        });
    }

    // 2. Fetch Latest News
    const whereNews: any = { language: lang };
    if (featured?.id) {
      whereNews.NOT = { id: featured.id };
    }
    if (newsCatId) {
      whereNews.categoryIds = { has: newsCatId };
    }
    let newsArticles = await (prisma as any).article.findMany({
      where: whereNews,
      take: 6,
      orderBy: { publishedDate: 'desc' },
      include: { categories: true, author: true }
    }).catch((e: any) => {
        console.error('Error fetching news articles:', e);
        return [];
    });

    // 3. Fetch Trending/Popular
    const whereTrending: any = {
        language: lang,
        NOT: { 
          id: { in: ([featured?.id, ...newsArticles.map((a: any) => a.id)].filter(Boolean) as string[]) }
        }
    }
    let trending = await (prisma as any).article.findMany({
      where: whereTrending,
      take: 5,
      orderBy: { publishedDate: 'desc' },
      include: { categories: true, author: true }
    }).catch((e: any) => {
        console.error('Error fetching trending articles:', e);
        return [];
    });

    return (
      <main className="overflow-hidden min-h-screen bg-white">
        {/* --- HERO SECTION --- */}
        {featured ? (
          <section className="relative w-full lg:min-h-[85vh] flex flex-col lg:flex-row overflow-hidden border-b border-gray-100">
            <div className="lg:w-1/2 min-h-[40vh] lg:min-h-full relative overflow-hidden order-2 lg:order-1">
                <OptimizedCloudinaryImage
                  src={featured.featuredImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200'}
                  alt={featured.title}
                  type="hero"
                  priority={true}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-[2000ms] ease-out"
                />
            </div>

            <div className="lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 lg:py-16 bg-white order-1 lg:order-2">
              <div className="max-w-xl h-full flex flex-col justify-center">
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#0066cc] text-[12px] font-bold uppercase tracking-wider border border-blue-100">
                    {dict.homepage.featured}
                  </span>
                  {(featured as any).categories?.map((cat: any) => (
                      <Link 
                          key={cat.id}
                          href={`/${lang}/category/${cat.slug}`}
                          className="inline-block px-3 py-1 rounded-full bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-wider border border-gray-100 hover:bg-[#0066cc] hover:text-white transition-colors"
                      >
                          {cat.name}
                      </Link>
                  ))}
                </div>
                
                <div className="flex-1 flex flex-col justify-center py-4">
                  <h1 className="text-[28px] md:text-[40px] lg:text-[44px] font-extrabold leading-[1.15] tracking-tight mb-6 hover:text-[#0066cc] transition-colors">
                    <Link href={`/${lang}/article/${featured.slug}`}>
                      {featured.title}
                    </Link>
                  </h1>
                  <p className="text-[17px] md:text-[18px] text-[#424245] leading-[1.5] mb-8 font-medium">
                    {featured.excerpt}
                  </p>
                </div>

                <div className="pt-4 pb-8">
                  <Link href={`/${lang}/article/${featured.slug}`} className="btn-apple-primary shadow-lg shadow-blue-500/10 py-3.5 px-8 text-[16px] inline-block">
                    {dict.buttons.readMore}
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <div className="py-32 text-center container mx-auto px-6">
            <h1 className="h-section mb-4">{lang === 'pt' ? 'Bem-vindo ao TecnoMais' : 'Welcome to TecnoMais'}</h1>
            <p className="text-[21px] text-[#86868b]">{lang === 'pt' ? 'Por favor, verifique a sua ligação à base de dados.' : 'Please check your database connection.'}</p>
          </div>
        )}

        <div className="container mx-auto px-6 max-w-7xl pt-12">
          <AdPlaceholder position="header" />
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="container mx-auto px-6 max-w-7xl py-20">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Main Feed: News */}
            <div className="lg:w-2/3">
              <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-4">
                <h2 className="text-[32px] font-bold tracking-tight text-[#1d1d1f]">{dict.homepage.latest}</h2>
                <Link href={`/${lang}/category/${lang === 'pt' ? 'noticias' : 'news'}`} className="text-[#0066cc] font-semibold hover:underline text-[15px]">
                  {lang === 'pt' ? 'Ver Tudo' : 'View All'} &rarr;
                </Link>
              </div>

              {newsArticles.length > 0 ? (
                <div className="space-y-4">
                  {newsArticles.map((article: any) => (
                    <NewsHorizontalCard key={article.id} article={article} lang={lang} />
                  ))}
                </div>
              ) : (
                <div className="p-12 bg-gray-50 rounded-2xl text-center text-gray-500">
                  {lang === 'pt' ? 'Nenhum artigo encontrado.' : 'No articles found.'}
                </div>
              )}
            </div>

            {/* Sidebar: Trending */}
            <aside className="lg:w-1/3">
              <div className="sticky top-32">
                <h3 className="text-[14px] uppercase tracking-widest font-bold text-[#1d1d1f] mb-8 flex items-center">
                  <div className="w-1 h-4 bg-[#0066cc] mr-3"></div>
                  {dict.homepage.trending}
                </h3>
                <div className="space-y-10">
                  {trending.map((article: any, idx: number) => (
                    <div key={article.id} className="group block">
                      <div className="flex gap-6">
                        <span className="text-[32px] font-black text-gray-300 group-hover:text-[#0066cc]/30 transition-colors leading-none shrink-0">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <Link href={`/${lang}/article/${article.slug}`}>
                              <h4 className="text-[18px] font-bold leading-[1.3] text-[#1d1d1f] group-hover:text-[#0066cc] transition-colors line-clamp-2">
                              {article.title}
                              </h4>
                          </Link>
                          <p className="mt-2 text-[13px] text-gray-400 font-medium uppercase tracking-wider">
                            {dict.homepage.by} <Link href={`/${lang}/author/${(article as any).author?.slug || 'admin'}`} className="text-[#1d1d1f] hover:text-[#0066cc] hover:underline transition-colors">{article.author?.name || 'Staff'}</Link>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-16">
                    <AdPlaceholder position="sidebar" />
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="py-24 container mx-auto px-6 max-w-7xl">
            <AdPlaceholder position="footer" />
        </div>
      </main>
    )
  } catch (error) {
    console.error('CRITICAL HOME ERROR:', error);
    return (
        <div className="p-20 text-center">
            <h1 className="text-4xl font-bold text-red-600">Error</h1>
            <p className="mt-4">Something went wrong.</p>
        </div>
    )
  }
}

