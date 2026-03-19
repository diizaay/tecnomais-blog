const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/premium-tech-blog';
const CLOUD_NAME = 'djap3064v'; // Seu Cloudinary cloud name

async function optimizeAllImages() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const db = client.db();
        const articlesCollection = db.collection('Article');

        // Get all articles
        const articles = await articlesCollection.find({}).toArray();
        console.log(`Found ${articles.length} articles to optimize`);

        let updated = 0;

        // Update each article with optimized Cloudinary URL
        for (const article of articles) {
            const currentImage = article.featuredImage;
            
            if (!currentImage) {
                console.log(`⚠️  "${article.title}" - sem imagem`);
                continue;
            }

            let publicId = '';
            
            // Extract public ID from different formats
            if (currentImage.includes('res.cloudinary.com')) {
                // URL completa: https://res.cloudinary.com/cloud/image/upload/v123/blog-uploads/abc123.jpg
                const parts = currentImage.split('/image/upload/');
                if (parts.length === 2) {
                    let path = parts[1];
                    // Remove version (v123/)
                    path = path.replace(/^v\d+\//, '');
                    // Remove extension
                    publicId = path.split('.')[0];
                }
            } else {
                // Filename ou public ID direto
                publicId = currentImage.replace(/\.[^.]+$/, '');
            }

            if (!publicId) {
                console.log(`⚠️  "${article.title}" - não conseguiu extrair public ID`);
                continue;
            }

            // Cria URL otimizada com transformações agressivas
            const optimizedUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/q_auto:best,q_auto:low:eco,f_auto,w_1200,h_800,c_fill,g_auto,o_auto,fl_progressive,fl_strip_profile/${publicId}.jpg`;

            const result = await articlesCollection.updateOne(
                { _id: article._id },
                { $set: { featuredImage: optimizedUrl } }
            );

            if (result.modifiedCount > 0) {
                console.log(`✅ "${article.title}" otimizada`);
                updated++;
            }
        }

        console.log(`\n✅ ${updated}/${articles.length} artigos otimizados com transformações Cloudinary`);
        console.log(`\nTransformações aplicadas:`);
        console.log(`  - q_auto:best: Qualidade inteligente máxima`);
        console.log(`  - q_auto:low:eco: Modo ecológico para banda`);
        console.log(`  - f_auto: Formato automático (WebP/JPEG)`);
        console.log(`  - w_1200,h_800: Dimensões otimizadas`);
        console.log(`  - c_fill,g_auto: Preenchimento com gravity`);
        console.log(`  - o_auto: Otimização automática`);
        console.log(`  - fl_progressive: JPEG progressivo`);
        console.log(`  - fl_strip_profile: Remove dados EXIF`);

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    } finally {
        await client.close();
    }
}

optimizeAllImages();
