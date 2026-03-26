import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function syncCategories() {
  try {
    console.log('🔄 Sincronizando categorias para localização...')
    
    const categoriesToEnsure = [
      { name: 'Notícias', slug: 'noticias', language: 'pt' },
      { name: 'Ferramentas IA', slug: 'ferramentas-de-ia', language: 'pt' },
      { name: 'Tendências', slug: 'tendencias-tecnologicas', language: 'pt' },
      { name: 'News', slug: 'news', language: 'en' },
      { name: 'AI Tools', slug: 'ai-tools', language: 'en' },
      { name: 'Technology Trends', slug: 'technology-trends', language: 'en' }
    ]

    for (const cat of categoriesToEnsure) {
      await prisma.category.upsert({
        where: { slug_language: { slug: cat.slug, language: cat.language } },
        update: { name: cat.name },
        create: cat
      })
      console.log(`   - Categoria pronta: ${cat.slug} (${cat.language})`)
    }

    // Also update existing articles to be "pt" if they have no language or were set to "en" implicitly
    // This is a quick fix to show content on the PT site
    const updatedCount = await prisma.article.updateMany({
        where: { language: 'en' },
        data: { language: 'pt' }
    })
    console.log(`✅ ${updatedCount.count} artigos atualizados para "pt" para exibição imediata.`)

    console.log('🎉 Sincronização concluída!')

  } catch (error) {
    console.error('❌ ERRO NA SINCRONIZAÇÃO:')
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

syncCategories()
