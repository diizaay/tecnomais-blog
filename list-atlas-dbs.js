const { MongoClient } = require('mongodb');

async function listAtlasDbs() {
    const URL = 'mongodb+srv://pontocriativo:k5hrAgQV3Xtgdcer@cluster0.xe6vg0v.mongodb.net/?appName=Cluster0';
    const client = new MongoClient(URL);
    
    try {
        await client.connect();
        const admin = client.db('admin');
        const result = await admin.admin().listDatabases();
        
        console.log('📚 Databases no MongoDB Atlas:\n');
        for (const dbInfo of result.databases) {
            console.log(`- ${dbInfo.name} (${dbInfo.sizeOnDisk} bytes)`);
            const db = client.db(dbInfo.name);
            const collections = await db.listCollections().toArray();
            console.log(`  Collections: ${collections.map(c => c.name).join(', ')}`);
        }
    } catch (error) {
        console.error('❌ Erro:', error.message);
    } finally {
        await client.close();
    }
}

listAtlasDbs();
