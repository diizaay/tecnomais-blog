const { MongoClient } = require('mongodb');

async function checkTechAngolaDb() {
    const URL = 'mongodb://localhost:27017';
    const client = new MongoClient(URL);
    
    try {
        await client.connect();
        const db = client.db('tech-angola');
        
        console.log('📄 Artigos em tech-angola:\n');
        
        const articles = await db.collection('Article').find({}).limit(20).toArray();
        
        console.log(`Total encontrado: ${articles.length}\n`);
        
        articles.forEach((art, i) => {
            console.log(`${i + 1}. ${art.title}`);
            console.log(`   Slug: ${art.slug}`);
            console.log('');
        });
        
    } catch (error) {
        console.error('❌ Erro:', error.message);
    } finally {
        await client.close();
    }
}

checkTechAngolaDb();
