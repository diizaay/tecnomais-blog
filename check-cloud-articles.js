const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCloudDb() {
  try {
    console.log('📄 Artigos no MongoDB Atlas:\n');
    
    const articles = await prisma.article.findMany({
      take: 35,
      orderBy: { publishedDate: 'desc' }
    });

    articles.forEach((art, idx) => {
      console.log(`${idx + 1}. ${art.title}`);
    });
    
    console.log(`\n📊 Total: ${articles.length} artigos`);

  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkCloudDb();
