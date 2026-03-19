
const { MongoClient } = require('mongodb');

async function main() {
    const client = new MongoClient('mongodb://localhost:27017/premium-tech-blog');
    try {
        await client.connect();
        const db = client.db('premium-tech-blog');
        const articles = await db.collection('Article').find({}).toArray();
        
        console.log('--- Articles with Multi-Categories ---');
        articles.forEach(article => {
            if (article.categoryIds && article.categoryIds.length > 1) {
                console.log(`- Title: ${article.title}`);
                console.log(`  Categories: ${article.categoryIds.length}`);
                console.log(`  Category IDs: ${article.categoryIds.join(', ')}`);
            }
        });

        // Also list all categories for reference
        const categories = await db.collection('Category').find({}).toArray();
        console.log('\n--- Category List ---');
        categories.forEach(cat => {
            console.log(`- ${cat.name} (${cat.id || cat._id})`);
        });

    } finally {
        await client.close();
    }
}

main().catch(console.error);
