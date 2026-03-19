const { MongoClient } = require('mongodb');

async function findAllArticles() {
    const URL = 'mongodb://localhost:27017/premium-tech-blog';
    const client = new MongoClient(URL);
    
    try {
        await client.connect();
        const db = client.db();
        
        console.log('🔍 Buscando TODOS os artigos na DB LOCAL:\n');
        
        const articles = await db.collection('Article').find({}).toArray();
        
        console.log(`Total de artigos encontrados: ${articles.length}\n`);
        
        articles.forEach((art, i) => {
            console.log(`${i + 1}. ${art.title}`);
            console.log(`   Slug: ${art.slug}`);
            console.log(`   Data: ${art.publishedDate}`);
            console.log('');
        });
        
    } catch (error) {
        console.error('❌ Erro:', error.message);
    } finally {
        await client.close();
    }
}

findAllArticles();
