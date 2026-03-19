const { MongoClient } = require('mongodb');
const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/premium-tech-blog';
async function checkArticleImages() {
    const client = new MongoClient(MONGODB_URI);
    try {
        await client.connect();
        const db = client.db();
        const articlesCollection = db.collection('Article');
        // Get first 5 articles
        const articles = await articlesCollection.find({}).limit(5).toArray();
        console.log('Sample articles with their featured images:\n');
        articles.forEach((article, index) => {
            console.log(`${index + 1}. ${article.title}`);
            console.log(`   URL: ${article.featuredImage}`);
            console.log('');
        });
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    } finally {
        await client.close();
    }
}
checkArticleImages();
