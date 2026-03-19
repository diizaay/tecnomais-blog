
import prisma from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArticleCard from '@/components/ArticleCard'
import AdPlaceholder from '@/components/AdPlaceholder'
import NewsHorizontalCard from '@/components/NewsHorizontalCard'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function Home() {
  try {
    // Fetch category IDs for filtering
    const categories = await prisma.category.findMany({
      where: { slug: { in: ['news', 'ai-tools', 'technology-trends'] } }
    }).catch((e: any) => {
      console.error('Error fetching categories:', e);
      return [];
    });
    
    const newsCatId = categories.find(c => c.slug === 'news')?.id
    const aiCatId = categories.find(c => c.slug === 'ai-tools')?.id
    const trendsCatId = categories.find(c => c.slug === 'technology-trends')?.id

    // 1. Fetch Featured Article (Hero) - Only show if in 'news' category
    const featured = await (prisma as any).article.findFirst({
      where: newsCatId ? {
        categoryIds: { has: newsCatId }
      } : {},
      orderBy: { publishedDate: 'desc' },
      include: { categories: true }
    }).catch((e: any) => {
        console.error('Error fetching featured article:', e);
        return null;
    });

    // 2. Fetch Latest News (Main Feed - 2/3 column)
    const whereNews: any = {};
    if (featured?.id) {
      whereNews.NOT = { id: featured.id };
    }
    if (newsCatId) {
      whereNews.categoryIds = { has: newsCatId };
    }
    const newsArticles = await (prisma as any).article.findMany({
      where: whereNews,
      take: 6,
      orderBy: { publishedDate: 'desc' },
      include: { categories: true }
    }).catch((e: any) => {
        console.error('Error fetching news articles:', e);
        return [];
    });

    // 3. Fetch Trending/Popular (Sidebar - 1/3 column)
    const trending = await (prisma as any).article.findMany({
      where: {
        NOT: { 
          id: { in: ([featured?.id, ...newsArticles.map((a: any) => a.id)].filter(Boolean) as string[]) }
        }
      },
      take: 5,
      orderBy: { publishedDate: 'desc' },
      include: { categories: true }
    }).catch((e: any) => {
        console.error('Error fetching trending articles:', e);
        return [];
    });

    // 4. Fetch AI Spotlight
    const whereAi: any = {
      NOT: { id: { in: ([featured?.id, ...newsArticles.map((a: any) => a.id), ...trending.map((a: any) => a.id)].filter(Boolean) as string[]) } }
    };
    if (aiCatId) {
      whereAi.categoryIds = { has: aiCatId };
    }
    const aiArticles = await (prisma as any).article.findMany({
      where: whereAi,
      take: 4,
      orderBy: { publishedDate: 'desc' },
      include: { categories: true }
    }).catch((e: any) => {
        console.error('Error fetching AI spotlight articles:', e);
        return [];
    });

    // 5. Fetch Technology Trends
    const whereTrends: any = {
      NOT: { id: { in: ([featured?.id, ...newsArticles.map((a: any) => a.id), ...trending.map((a: any) => a.id), ...aiArticles.map((a: any) => a.id)].filter(Boolean) as string[]) } }
    };
    if (trendsCatId) {
      whereTrends.categoryIds = { has: trendsCatId };
    }
    const trendArticles = await (prisma as any).article.findMany({
      where: whereTrends,
      take: 4,
      orderBy: { publishedDate: 'desc' },
      include: { categories: true }
    }).catch((e: any) => {
        console.error('Error fetching technology trends articles:', e);
        return [];
    });

    return (
      <>
        <Navbar />

        <main className="overflow-hidden min-h-screen bg-white">
          {/* --- HERO SECTION --- */}
          {featured ? (
            <section className="relative w-full lg:min-h-[85vh] flex flex-col lg:flex-row overflow-hidden border-b border-gray-100 pt-20 lg:pt-24">
              <div className="lg:w-1/2 min-h-[40vh] lg:min-h-full relative overflow-hidden order-2 lg:order-1">
                 <Image
                    src={featured.featuredImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200'}
                    alt={featured.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-[2000ms] ease-out"
                  />
              </div>

              <div className="lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 lg:py-16 bg-white order-1 lg:order-2">
                <div className="max-w-xl h-full flex flex-col justify-center">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#0066cc] text-[12px] font-bold uppercase tracking-wider border border-blue-100">
                      Featured Article
                    </span>
                    {(featured as any).categories?.map((cat: any) => (
                        <Link 
                            key={cat.id}
                            href={`/categoria/${cat.slug}`}
                            className="inline-block px-3 py-1 rounded-full bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-wider border border-gray-100 hover:bg-[#0066cc] hover:text-white transition-colors"
                        >
                            {cat.name}
                        </Link>
                    ))}
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center py-4">
                    <h1 className="text-[28px] md:text-[40px] lg:text-[44px] font-extrabold leading-[1.15] tracking-tight mb-6 hover:text-[#0066cc] transition-colors">
                      <Link href={`/artigo/${featured.slug}`}>
                        {featured.title}
                      </Link>
                    </h1>
                    <p className="text-[17px] md:text-[18px] text-[#424245] leading-[1.5] mb-8 font-medium">
                      {featured.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 pb-8">
                    <Link href={`/artigo/${featured.slug}`} className="btn-apple-primary shadow-lg shadow-blue-500/10 py-3.5 px-8 text-[16px] inline-block">
                      Read Full Story
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <div className="py-32 text-center container mx-auto px-6">
              <h1 className="h-section mb-4">Welcome to TecnoMais</h1>
              <p className="text-[21px] text-[#86868b]">Please check your database connection.</p>
            </div>
          )}

          <div className="container mx-auto px-6 max-w-7xl pt-12">
            <AdPlaceholder position="header" />
          </div>

          {/* --- MAIN CONTENT GRID (2/3 + 1/3) --- */}
          <div className="container mx-auto px-6 max-w-7xl py-20">
            <div className="flex flex-col lg:flex-row gap-16">
              
              {/* Main Feed: News (2/3) */}
              <div className="lg:w-2/3">
                <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-4">
                  <h2 className="text-[32px] font-bold tracking-tight text-[#1d1d1f]">Latest News</h2>
                  <Link href="/categoria/news" className="text-[#0066cc] font-semibold hover:underline text-[15px]">
                    More News &rarr;
                  </Link>
                </div>

                {newsArticles.length > 0 ? (
                  <div className="space-y-4">
                    {newsArticles.map((article: any) => (
                      <NewsHorizontalCard key={article.id} article={article} />
                    ))}
                  </div>
                ) : (
                  <div className="p-12 bg-gray-50 rounded-2xl text-center text-gray-500">
                    No news articles found.
                  </div>
                )}
              </div>

              {/* Sidebar: Trending (1/3) */}
              <aside className="lg:w-1/3">
                <div className="sticky top-32">
                  <h3 className="text-[14px] uppercase tracking-widest font-bold text-[#1d1d1f] mb-8 flex items-center">
                    <div className="w-1 h-4 bg-[#0066cc] mr-3"></div>
                    Trending
                  </h3>
                  <div className="space-y-10">
                    {trending.map((article: any, idx: number) => (
                      <div key={article.id} className="group block">
                        <div className="flex gap-6">
                          <span className="text-[32px] font-black text-gray-300 group-hover:text-[#0066cc]/30 transition-colors leading-none shrink-0">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <div>
                            <Link href={`/artigo/${article.slug}`}>
                                <h4 className="text-[18px] font-bold leading-[1.3] text-[#1d1d1f] group-hover:text-[#0066cc] transition-colors line-clamp-2">
                                {article.title}
                                </h4>
                            </Link>
                            <p className="mt-2 text-[13px] text-gray-400 font-medium uppercase tracking-wider">
                              By <Link href={`/autor/${encodeURIComponent(article.author)}`} className="text-[#1d1d1f] hover:text-[#0066cc] hover:underline transition-colors">{article.author}</Link>
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

          {/* --- AI SPOTLIGHT BAND --- */}
          {aiArticles.length > 0 && (
            <div className="bg-[#1d1d1f] py-24 text-white">
              <section className="container mx-auto px-6 max-w-7xl">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h2 className="text-[40px] font-bold tracking-tight">AI Spotlight</h2>
                    <p className="text-gray-400 text-[19px] mt-2 font-medium">The most important breakthroughs in AI</p>
                  </div>
                  <Link href="/categoria/ai-tools" className="text-white border border-white/20 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all font-semibold text-[15px]">
                    View AI Hub
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {aiArticles.map((article: any) => (
                    <div key={article.id} className="group block">
                      <Link href={`/artigo/${article.slug}`}>
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6">
                          <Image
                            src={article.featuredImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400'}
                            alt={article.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                      </Link>
                      <div className="flex flex-wrap gap-2 mb-3">
                          {article.categories?.map((cat: any) => (
                              <Link 
                                  key={cat.id}
                                  href={`/categoria/${cat.slug}`}
                                  className="text-[10px] font-bold uppercase tracking-widest text-[#0066cc] border border-white/20 px-2 py-0.5 rounded hover:bg-white hover:text-black transition-colors"
                              >
                                  {cat.name}
                              </Link>
                          ))}
                      </div>
                      <Link href={`/artigo/${article.slug}`}>
                        <h4 className="text-[19px] font-bold leading-tight group-hover:text-blue-400 transition-colors">
                          {article.title}
                        </h4>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* --- TECHNOLOGY TRENDS BAND --- */}
          {trendArticles.length > 0 && (
            <div className="bg-white py-24 border-t border-gray-100">
              <section className="container mx-auto px-6 max-w-7xl">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h2 className="text-[40px] font-bold tracking-tight text-[#1d1d1f]">Marketing & Trends</h2>
                    <p className="text-[#86868b] text-[19px] mt-2 font-medium">Analyzing the shifting currents of the tech world</p>
                  </div>
                  <Link href="/categoria/technology-trends" className="text-[#0066cc] font-semibold hover:underline text-[15px]">
                    View Trends Hub &rarr;
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {trendArticles.map((article: any) => (
                    <div key={article.id} className="group block">
                      <Link href={`/artigo/${article.slug}`}>
                        <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 bg-gray-50">
                          <Image
                            src={article.featuredImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400'}
                            alt={article.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                      </Link>
                      <div className="flex flex-wrap gap-2 mb-3">
                          {article.categories?.map((cat: any) => (
                              <Link 
                                  key={cat.id}
                                  href={`/categoria/${cat.slug}`}
                                  className="text-[10px] font-bold uppercase tracking-widest text-[#0066cc] bg-blue-50 px-2 py-0.5 rounded hover:bg-[#0066cc] hover:text-white transition-colors"
                              >
                                  {cat.name}
                              </Link>
                          ))}
                      </div>
                      <Link href={`/artigo/${article.slug}`}>
                        <h4 className="text-[19px] font-bold leading-tight text-[#1d1d1f] group-hover:text-[#0066cc] transition-colors">
                          {article.title}
                        </h4>
                      </Link>
                      <p className="mt-3 text-[14px] text-gray-500 line-clamp-2">
                          {article.excerpt}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* --- FOOTER CONTENT --- */}
          <div className="py-24 container mx-auto px-6 max-w-7xl">
              <AdPlaceholder position="footer" />
          </div>
        </main>

        <Footer />
      </>
    )
  } catch (error) {
    console.error('CRITICAL HOME ERROR:', error);
    return (
        <div className="p-20 text-center">
            <h1 className="text-4xl font-bold text-red-600">Site Error</h1>
            <p className="mt-4">Something went wrong while loading the page content. Please try again soon.</p>
        </div>
    )
  }
}
