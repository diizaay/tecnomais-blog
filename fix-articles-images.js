const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/premium-tech-blog';

async function fixArticleImages() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const db = client.db();
        const articlesCollection = db.collection('Article');

        // Get all articles
        const articles = await articlesCollection.find({}).toArray();
        console.log(`Found ${articles.length} articles`);

        // Update each article with a valid placeholder image URL
        for (let i = 0; i < articles.length; i++) {
            const article = articles[i];
            
            // Use a simple Cloudinary placeholder or a properly formatted URL
            const newImageUrl = `https://res.cloudinary.com/pontocriativo/image/upload/q_auto,f_auto,w_1200,h_800,c_fill,g_auto/v1/blog-uploads/placeholder-${i + 1}`;
            
            const result = await articlesCollection.updateOne(
                { _id: article._id },
                { $set: { featuredImage: newImageUrl } }
            );

            console.log(`✅ Updated "${article.title}" with image URL`);
        }

        console.log(`\n✅ All ${articles.length} articles updated with proper image URLs`);

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    } finally {
        await client.close();
    }
}

fixArticleImages();
