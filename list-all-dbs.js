const { MongoClient } = require('mongodb');

async function listAllDatabases() {
    const URL = 'mongodb://localhost:27017';
    const client = new MongoClient(URL);
    
    try {
        await client.connect();
        const admin = client.db('admin');
        
        const result = await admin.admin().listDatabases();
        
        console.log('📚 Todas as databases no MongoDB local:\n');
        
        result.databases.forEach(db => {
            console.log(`- ${db.name} (${db.sizeOnDisk} bytes)`);
        });
        
        // Agora verificar coleções em cada database
        for (const dbInfo of result.databases) {
            if (dbInfo.name !== 'admin' && dbInfo.name !== 'config' && dbInfo.name !== 'local') {
                console.log(`\n📋 Coleções em "${dbInfo.name}":`);
                const db = client.db(dbInfo.name);
                const collections = await db.listCollections().toArray();
                collections.forEach(col => {
                    console.log(`   - ${col.name}`);
                });
            }
        }
        
    } catch (error) {
        console.error('❌ Erro:', error.message);
    } finally {
        await client.close();
    }
}

listAllDatabases();
