const { MongoClient } = require('mongodb');

async function migrateData() {
  const localUri = 'mongodb://localhost:27017/premium-tech-blog';
  const cloudUri = 'mongodb+srv://pontocriativo:k5hrAgQV3Xtgdcer@cluster0.xe6vg0v.mongodb.net/premium-tech-blog?appName=Cluster0';

  const localClient = new MongoClient(localUri);
  const cloudClient = new MongoClient(cloudUri);

  try {
    console.log('🔗 Conectando à DB local...');
    await localClient.connect();
    const localDb = localClient.db('premium-tech-blog');

    console.log('🌐 Conectando à DB na nuvem...');
    await cloudClient.connect();
    const cloudDb = cloudClient.db('premium-tech-blog');

    // Collections to migrate
    const collections = ['User', 'Category', 'Article', 'Tag', 'Comment'];

    for (const collName of collections) {
      try {
        const localCollection = localDb.collection(collName);
        const cloudCollection = cloudDb.collection(collName);

        // Get count from local
        const count = await localCollection.countDocuments();
        
        if (count === 0) {
          console.log(`⏭️  ${collName}: 0 documentos (pulando)`);
          continue;
        }

        console.log(`📦 Migrando ${collName}...`);
        
        // Get all documents from local
        const documents = await localCollection.find({}).toArray();
        
        // Clear cloud collection
        await cloudCollection.deleteMany({});
        
        // Insert into cloud
        const result = await cloudCollection.insertMany(documents);
        console.log(`✅ ${collName}: ${result.insertedCount} documentos migrados`);

      } catch (error) {
        if (error.message.includes('ns does not exist')) {
          console.log(`⏭️  ${collName}: não existe na DB local`);
        } else {
          console.error(`❌ Erro ao migrar ${collName}:`, error.message);
        }
      }
    }

    console.log('\n✨ Migração concluída!');

  } catch (error) {
    console.error('❌ Erro de conexão:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 MongoDB local não está rodando!');
      console.error('   Inicie o MongoDB local: mongod');
    }
  } finally {
    await localClient.close();
    await cloudClient.close();
  }
}

migrateData();
