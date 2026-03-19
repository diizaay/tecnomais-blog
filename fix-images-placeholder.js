const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/premium-tech-blog';

async function fixArticleImagesWithPlaceholders() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const db = client.db();
        const articlesCollection = db.collection('Article');

        // Get all articles
        const articles = await articlesCollection.find({}).toArray();
        console.log(`Found ${articles.length} articles to fix\n`);

        let updated = 0;

        // Update each article with a valid placeholder image from Cloudinary
        for (let i = 0; i < articles.length; i++) {
            const article = articles[i];
            
            // Use a simple placeholder that works with any Cloudinary account
            // This is a standard test image
            const placeholderUrl = `https://res.cloudinary.com/demo/image/upload/w_1200,h_800,c_fill/${i + 1}`;
            
            const result = await articlesCollection.updateOne(
                { _id: article._id },
                { $set: { featuredImage: placeholderUrl } }
            );

            if (result.modifiedCount > 0) {
                console.log(`✅ "${article.title}" - placeholder atribuído`);
                updated++;
            }
        }

        console.log(`\n✅ ${updated}/${articles.length} artigos atualizados com placeholder válido`);

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    } finally {
        await client.close();
    }
}

fixArticleImagesWithPlaceholders();
