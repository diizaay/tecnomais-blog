const { MongoClient, ObjectId } = require('mongodb');

const URL = 'mongodb://localhost:27017/premium-tech-blog';

const CATEGORIES = [
    { _id: new ObjectId(), name: 'News', slug: 'news' },
    { _id: new ObjectId(), name: 'AI Tools', slug: 'ai-tools' },
    { _id: new ObjectId(), name: 'Software Comparisons', slug: 'software-comparisons' },
    { _id: new ObjectId(), name: 'Productivity Tools', slug: 'productivity-tools' },
    { _id: new ObjectId(), name: 'Programming Resources', slug: 'programming-resources' },
    { _id: new ObjectId(), name: 'Technology Trends', slug: 'technology-trends' },
];

const TAGS = [
    { _id: new ObjectId(), name: 'ChatGPT', slug: 'chatgpt' },
    { _id: new ObjectId(), name: 'Web Dev', slug: 'web-dev' },
    { _id: new ObjectId(), name: 'Remote Work', slug: 'remote-work' },
    { _id: new ObjectId(), name: 'SaaS', slug: 'saas' },
];

const ARTICLES_SEED = [
    {
        title: 'Best AI Tools in 2026',
        slug: 'best-ai-tools-2026',
        categorySlug: 'ai-tools',
        excerpt: 'A comprehensive guide to the top artificial intelligence tools transforming workflows this year.',
        content: `## The AI Revolution of 2026\n\nArtificial Intelligence has moved beyond experimental chat interfaces into fully integrated workflow systems.`,
    },
    {
        title: 'Best Free AI Tools for Students',
        slug: 'best-free-ai-tools-students',
        categorySlug: 'ai-tools',
        excerpt: 'How students can leverage free artificial intelligence to accelerate learning and research.',
        content: `## Smarter Studying\n\nStudents no longer need to rely solely on expensive tutors.`,
    },
    {
        title: 'Top Productivity Apps for Remote Work',
        slug: 'top-productivity-apps-remote-work',
        categorySlug: 'productivity-tools',
        excerpt: 'Boost your home office efficiency with these tested and proven remote work applications.',
        content: `## The Remote Work Challenge\n\nStaying productive at home requires discipline and the right software.`,
    },
    {
        title: 'Best Coding Platforms for Beginners',
        slug: 'best-coding-platforms-beginners',
        categorySlug: 'programming-resources',
        excerpt: 'Start your software engineering journey with these beginner-friendly coding platforms.',
        content: `## Where to start?\n\nLearning to code can be daunting.`,
    },
    {
        title: 'ChatGPT vs Gemini vs Claude',
        slug: 'chatgpt-vs-gemini-vs-claude',
        categorySlug: 'ai-tools',
        excerpt: 'A detailed comparison of the top three large language models on the market today.',
        content: `## The Battle of the LLMs\n\nWhich AI assistant should you pay for?`,
    },
    ...Array.from({ length: 25 }).map((_, i) => ({
        title: `Technology Trend Report: Insight ${i + 6}`,
        slug: `technology-trend-report-insight-${i + 6}`,
        categorySlug: ['news', 'ai-tools', 'software-comparisons', 'productivity-tools', 'programming-resources', 'technology-trends'][i % 6],
        excerpt: `Deep dive into the emerging trends shaping the software and startup ecosystem. Report #${i + 6}.`,
        content: `## Executive Summary\n\nAs we analyze the market data for Q${(i % 4) + 1}, several key trends emerge in the software space.`,
    }))
];

async function main() {
    console.log('🔗 Conectando ao MongoDB...');
    const client = new MongoClient(URL);
    await client.connect();
    const db = client.db();

    console.log('📂 Criando categorias e tags...');
    
    // Clear existing data
    await db.collection('Category').deleteMany({});
    await db.collection('Tag').deleteMany({});
    await db.collection('Article').deleteMany({});
    
    await db.collection('Category').insertMany(CATEGORIES);
    await db.collection('Tag').insertMany(TAGS);

    console.log('📄 Preparando 30 artigos...');
    const articlesToInsert = ARTICLES_SEED.map(info => {
        const category = CATEGORIES.find(c => c.slug === info.categorySlug);
        const randomTag = TAGS[Math.floor(Math.random() * TAGS.length)];

        return {
            _id: new ObjectId(),
            title: info.title,
            slug: info.slug,
            excerpt: info.excerpt,
            content: info.content,
            author: 'Redação TechBlog',
            featuredImage: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 99999999)}?auto=format&fit=crop&w=1200&q=80`,
            categoryIds: category ? [category._id] : [],
            tagIds: [randomTag._id],
            publishedDate: new Date(Date.now() - Math.random() * 10000000000),
            createdAt: new Date(),
            updatedAt: new Date()
        };
    });

    console.log('📥 Inserindo 30 artigos...');
    const result = await db.collection('Article').insertMany(articlesToInsert);
    
    console.log(`\n✅ Banco de dados populado com sucesso!`);
    console.log(`   - Categorias: 6`);
    console.log(`   - Tags: 4`);
    console.log(`   - Artigos: ${result.insertedIds.length}`);
    
    await client.close();
}

main().catch(error => {
    console.error('❌ Erro:', error.message);
    process.exit(1);
});
