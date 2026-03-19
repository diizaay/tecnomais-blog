const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkArticles() {
  try {
    console.log('📄 Artigos com imagens:\n');
    
    const articles = await prisma.article.findMany({
      select: {
        title: true,
        featuredImage: true,
      },
      take: 5,
    });

    articles.forEach((art, idx) => {
      console.log(`${idx + 1}. ${art.title}`);
      console.log(`   Image: ${art.featuredImage}\n`);
    });

  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkArticles();
