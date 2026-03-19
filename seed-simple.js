const { MongoClient, ObjectId } = require('mongodb');

async function main() {
    const URL = 'mongodb://localhost:27017/premium-tech-blog';
    
    console.log('🔗 Conectando ao MongoDB local...');
    const client = new MongoClient(URL);
    
    try {
        await client.connect();
        const db = client.db();
        
        console.log('✅ Conectado!\n');
        
        // Clear existing
        console.log('🗑️  Limpando coleções...');
        await db.collection('Article').deleteMany({});
        await db.collection('Category').deleteMany({});
        
        // Insert categories
        const categories = [
            { name: 'News', slug: 'news' },
            { name: 'AI Tools', slug: 'ai-tools' },
            { name: 'Software Comparisons', slug: 'software-comparisons' },
            { name: 'Productivity Tools', slug: 'productivity-tools' },
            { name: 'Programming Resources', slug: 'programming-resources' },
            { name: 'Technology Trends', slug: 'technology-trends' },
        ];
        
        console.log('📂 Inserindo categorias...');
        const catResult = await db.collection('Category').insertMany(categories);
        console.log(`✅ ${Object.keys(catResult.insertedIds).length} categorias inseridas\n`);
        
        // Get category IDs
        const savedCats = await db.collection('Category').find({}).toArray();
        console.log('📋 Categorias no banco:');
        savedCats.forEach(cat => console.log(`   - ${cat.name} (${cat._id})`));
        
        // Insert articles
        const articles = [];
        for (let i = 0; i < 30; i++) {
            const cat = savedCats[i % savedCats.length];
            articles.push({
                title: `Article ${i + 1}`,
                slug: `article-${i + 1}`,
                excerpt: `This is article ${i + 1}`,
                content: `Content for article ${i + 1}`,
                author: 'Admin',
                categoryIds: [cat._id],
                tagIds: [],
                publishedDate: new Date(),
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        
        console.log(`\n📄 Inserindo ${articles.length} artigos...`);
        const artResult = await db.collection('Article').insertMany(articles);
        console.log(`✅ ${Object.keys(artResult.insertedIds).length} artigos inseridos\n`);
        
        // Verify
        const count = await db.collection('Article').countDocuments();
        console.log(`📊 Total de artigos: ${count}`);
        
    } catch (error) {
        console.error('❌ Erro:', error.message);
    } finally {
        await client.close();
    }
}

main();
