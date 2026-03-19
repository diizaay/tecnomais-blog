const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...\n');

    // Create categories
    console.log('📂 Criando categorias...');
    let categoryCount = 0;
    
    const categoriesData = [
      { name: 'News', slug: 'news', description: 'Últimas notícias de tecnologia' },
      { name: 'AI Tools', slug: 'ai-tools', description: 'Ferramentas de Inteligência Artificial' },
      { name: 'Technology Trends', slug: 'technology-trends', description: 'Tendências em tecnologia' },
      { name: 'Software Comparisons', slug: 'software-comparisons', description: 'Comparações de software' },
      { name: 'Productivity Tools', slug: 'productivity-tools', description: 'Ferramentas de produtividade' }
    ];

    for (const cat of categoriesData) {
      try {
        await prisma.category.create({ data: cat });
        categoryCount++;
      } catch (e) {
        if (!e.message.includes('Unique constraint failed')) {
          throw e;
        }
      }
    }
    console.log(`✅ ${categoryCount} categorias criadas\n`);

    // Get category IDs
    const allCategories = await prisma.category.findMany();
    const newsCat = allCategories.find(c => c.slug === 'news');
    const aiCat = allCategories.find(c => c.slug === 'ai-tools');
    const trendsCat = allCategories.find(c => c.slug === 'technology-trends');

    // Create articles
    console.log('📄 Criando artigos...');
    let articleCount = 0;

    const articlesData = [
      {
        title: 'The Future of AI in 2024',
        slug: 'future-of-ai-2024',
        excerpt: 'Explore the latest advancements in artificial intelligence and what the future holds.',
        content: '<p>Artificial Intelligence continues to evolve at a rapid pace...</p>',
        author: 'John Doe',
        publishedDate: new Date('2024-03-10'),
        featuredImage: 'https://images.unsplash.com/photo-1677442d019cecf8cfd563e57d30d4f00d5c5a70?auto=format&fit=crop&w=1200',
        categoryIds: [newsCat?.id, aiCat?.id].filter(Boolean),
        tagIds: [],
        seoTitle: 'The Future of AI in 2024',
        seoDesc: 'Discover the latest AI advancements and trends for 2024'
      },
      {
        title: 'ChatGPT vs Google Bard: Comparison',
        slug: 'chatgpt-vs-google-bard',
        excerpt: 'A comprehensive comparison between two leading AI chatbots.',
        content: '<p>ChatGPT and Google Bard are two of the most popular AI chatbots...</p>',
        author: 'Jane Smith',
        publishedDate: new Date('2024-03-09'),
        featuredImage: 'https://images.unsplash.com/photo-1677555643500-dba8bc36779d?auto=format&fit=crop&w=1200',
        categoryIds: [aiCat?.id].filter(Boolean),
        tagIds: [],
        seoTitle: 'ChatGPT vs Google Bard',
        seoDesc: 'Compare ChatGPT and Google Bard features and capabilities'
      },
      {
        title: 'Top Technology Trends in 2024',
        slug: 'top-tech-trends-2024',
        excerpt: 'The most important technology trends that will shape 2024.',
        content: '<p>2024 is shaping up to be an exciting year for technology...</p>',
        author: 'Tech Analyst',
        publishedDate: new Date('2024-03-08'),
        featuredImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200',
        categoryIds: [trendsCat?.id].filter(Boolean),
        tagIds: [],
        seoTitle: 'Top Technology Trends 2024',
        seoDesc: 'Discover the top technology trends that will define 2024'
      },
      {
        title: 'Productivity Tools Every Developer Should Know',
        slug: 'productivity-tools-developers',
        excerpt: 'Essential tools to boost your development productivity.',
        content: '<p>Developers are always looking for ways to be more productive...</p>',
        author: 'Dev Expert',
        publishedDate: new Date('2024-03-07'),
        featuredImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200',
        categoryIds: [],
        tagIds: [],
        seoTitle: 'Productivity Tools for Developers',
        seoDesc: 'Top productivity tools every developer should use'
      },
      {
        title: 'Web Development Trends 2024',
        slug: 'web-dev-trends-2024',
        excerpt: 'Latest trends and best practices in web development.',
        content: '<p>Web development is constantly evolving...</p>',
        author: 'Web Dev Pro',
        publishedDate: new Date('2024-03-06'),
        featuredImage: 'https://images.unsplash.com/photo-1633356713697-d6d150a248fe?auto=format&fit=crop&w=1200',
        categoryIds: [trendsCat?.id].filter(Boolean),
        tagIds: [],
        seoTitle: 'Web Development Trends 2024',
        seoDesc: 'Explore the latest web development trends and practices'
      }
    ];

    for (const art of articlesData) {
      try {
        await prisma.article.create({ data: art });
        articleCount++;
      } catch (e) {
        if (!e.message.includes('Unique constraint failed')) {
          throw e;
        }
      }
    }
    console.log(`✅ ${articleCount} artigos criados\n`);

    // Create a user
    console.log('👤 Criando usuário admin...');
    const user = await prisma.user.create({
      data: {
        email: 'admin@techblog.com',
        passwordHash: '$2b$10$abcdefghijklmnopqrstuvwxyz', // Dummy hash
        name: 'Admin User',
        role: 'ADMIN'
      }
    }).catch(e => {
      if (e.code === 'P2002') {
        console.log('⏭️  Usuário admin já existe');
        return null;
      }
      throw e;
    });
    
    if (user) {
      console.log('✅ Usuário admin criado\n');
    }

    console.log('✨ Seed concluído com sucesso!');
    console.log('\n📊 Estatísticas finais:');
    const finalStats = await Promise.all([
      prisma.category.count(),
      prisma.article.count(),
      prisma.user.count()
    ]);
    console.log(`   - Categorias: ${finalStats[0]}`);
    console.log(`   - Artigos: ${finalStats[1]}`);
    console.log(`   - Usuários: ${finalStats[2]}`);

  } catch (error) {
    console.error('❌ Erro no seed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
