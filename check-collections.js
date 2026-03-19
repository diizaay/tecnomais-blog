const { MongoClient } = require('mongodb');

async function main() {
    const URL = 'mongodb://localhost:27017/premium-tech-blog';
    const client = new MongoClient(URL);
    
    try {
        await client.connect();
        const db = client.db();
        
        const collections = await db.listCollections().toArray();
        console.log('📋 Coleções na DB local:\n');
        
        for (const col of collections) {
            const count = await db.collection(col.name).countDocuments();
            console.log(`${col.name}: ${count} documentos`);
        }
        
    } catch (error) {
        console.error('Erro:', error.message);
    } finally {
        await client.close();
    }
}

main();
