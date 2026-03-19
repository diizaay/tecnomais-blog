const { MongoClient } = require('mongodb');

async function checkLocalDb() {
    const URL = 'mongodb://localhost:27017/premium-tech-blog';
    const client = new MongoClient(URL);
    
    try {
        await client.connect();
        const db = client.db();
        
        console.log('📋 Verificando DB LOCAL:\n');
        
        const collections = await db.listCollections().toArray();
        for (const col of collections) {
            const count = await db.collection(col.name).countDocuments();
            console.log(`${col.name}: ${count} documentos`);
        }
        
        console.log('\n📄 Primeiros 3 artigos da DB LOCAL:');
        const articles = await db.collection('Article').find({}).limit(3).toArray();
        articles.forEach((art, i) => {
            console.log(`${i + 1}. ${art.title}`);
        });
        
    } catch (error) {
        console.error('❌ Erro na DB local:', error.message);
    } finally {
        await client.close();
    }
}

checkLocalDb();
