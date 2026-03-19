import { MongoClient, ObjectId } from 'mongodb'

const URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/premium-tech-blog'

const CATEGORIES = [
    { _id: new ObjectId(), name: 'News', slug: 'news' },
    { _id: new ObjectId(), name: 'AI Tools', slug: 'ai-tools' },
    { _id: new ObjectId(), name: 'Software Comparisons', slug: 'software-comparisons' },
    { _id: new ObjectId(), name: 'Productivity Tools', slug: 'productivity-tools' },
    { _id: new ObjectId(), name: 'Programming Resources', slug: 'programming-resources' },
    { _id: new ObjectId(), name: 'Technology Trends', slug: 'technology-trends' },
]

const TAGS = [
    { _id: new ObjectId(), name: 'ChatGPT', slug: 'chatgpt' },
    { _id: new ObjectId(), name: 'Web Dev', slug: 'web-dev' },
    { _id: new ObjectId(), name: 'Remote Work', slug: 'remote-work' },
    { _id: new ObjectId(), name: 'SaaS', slug: 'saas' },
]

const ARTICLES_SEED = [
    {
        title: 'Best AI Tools in 2026',
        slug: 'best-ai-tools-2026',
        categorySlug: 'ai-tools',
        excerpt: 'A comprehensive guide to the top artificial intelligence tools transforming workflows this year.',
        content: `## The AI Revolution of 2026\n\nArtificial Intelligence has moved beyond experimental chat interfaces into fully integrated workflow systems. In 2026, the landscape of AI tools is dominated by multimodal assistants that can write code, generate videos, and analyze complex datasets simultaneously.\n\n### 1. Advanced Coding Assistants\nTools like GitHub Copilot and new autonomous engineering agents have drastically reduced the time required to scaffold applications. They now understand entire codebases and can refactor legacy systems with 99% accuracy.\n\n### 2. Video Generation Models\nText-to-video has reached photorealism. Platforms allow creators to generate B-roll, marketing assets, and even short films with simple text prompts.\n\n### Summary\nThe best tools are those that integrate seamlessly into your existing stack, rather than replacing it entirely.`,
    },
    {
        title: 'Best Free AI Tools for Students',
        slug: 'best-free-ai-tools-students',
        categorySlug: 'ai-tools',
        excerpt: 'How students can leverage free artificial intelligence to accelerate learning and research.',
        content: `## Smarter Studying\n\nStudents no longer need to rely solely on expensive tutors or massive library sessions. Free AI tools can summarize papers, generate practice quizzes, and explain complex concepts step-by-step.\n\n### Top Free Tools\n- **Notion AI**: For organizing notes and summarizing lectures.\n- **Perplexity**: A free research engine that cites sources instantly.\n- **Claude**: Excellent for natural, nuanced explanations of difficult material.`,
    },
    {
        title: 'Top Productivity Apps for Remote Work',
        slug: 'top-productivity-apps-remote-work',
        categorySlug: 'productivity-tools',
        excerpt: 'Boost your home office efficiency with these tested and proven remote work applications.',
        content: `## The Remote Work Challenge\n\nStaying productive at home requires discipline and the right software. The modern remote worker needs async communication tools, time trackers, and focus enhancers.\n\n### Must-Have Apps\n1. **Linear**: For tracking engineering and design tasks without the clutter of Jira.\n2. **Loom**: Asynchronous video messages that replace unnecessary meetings.\n3. **Cron / Notion Calendar**: For seamless time-zone management.`,
    },
    {
        title: 'Best Coding Platforms for Beginners',
        slug: 'best-coding-platforms-beginners',
        categorySlug: 'programming-resources',
        excerpt: 'Start your software engineering journey with these beginner-friendly coding platforms.',
        content: `## Where to start?\n\nLearning to code can be daunting. The best platforms provide interactive environments where you write code in the browser and get instant feedback.\n\n### Top Platforms\n- **FreeCodeCamp**: Totally free, massive community, and structured curriculums.\n- **Codecademy**: Great interactive UI for the absolute basics.\n- **Frontend Mentor**: For those who want to practice building real-world designs.`,
    },
    {
        title: 'ChatGPT vs Gemini vs Claude',
        slug: 'chatgpt-vs-gemini-vs-claude',
        categorySlug: 'ai-tools',
        excerpt: 'A detailed comparison of the top three large language models on the market today.',
        content: `## The Battle of the LLMs\n\nWhich AI assistant should you pay for? \n\n### ChatGPT (OpenAI)\nStill the king of reasoning and voice mode. Best for general purpose tasks and coding.\n\n### Gemini (Google)\nDeeply integrated into the Google ecosystem. Incredible context window for uploading massive documents or codebases.\n\n### Claude (Anthropic)\nThe writer's choice. Claude produces the most natural-sounding text and handles nuanced instructions better than its rivals.`,
    },
    // Map 25 more articles to hit 30
    ...Array.from({ length: 25 }).map((_, i) => ({
        title: `Technology Trend Report: Insight ${i + 6}`,
        slug: `technology-trend-report-insight-${i + 6}`,
        categorySlug: ['news', 'ai-tools', 'software-comparisons', 'productivity-tools', 'programming-resources', 'technology-trends'][i % 6],
        excerpt: `Deep dive into the emerging trends shaping the software and startup ecosystem. Report #${i + 6}.`,
        content: `## Executive Summary\n\nAs we analyze the market data for Q${(i % 4) + 1}, several key trends emerge in the software space.\n\n### Key Finding 1\nEnterprise adoption of new frameworks is accelerating at an unprecedented rate.\n\n### Key Finding 2\nStartups are leaning heavily into lean, serverless architectures to minimize DevOps overhead.\n\nThis insight is part of our ongoing commitment to bringing you the best tech news.`,
    }))
]

async function main() {
    console.log('Connecting native mongodb driver...')
    const client = new MongoClient(URL)
    await client.connect()
    const db = client.db()

    console.log('Using existing data if present (destructive drop disabled)...')
    // const collections = await db.listCollections().toArray()
    // for (const c of collections) {
    //     await db.collection(c.name).drop()
    // }

    console.log('Creating Admin User...')
    await db.collection('User').insertOne({
        _id: new ObjectId(),
        email: 'admin@techblog.com',
        passwordHash: 'admin123',
        name: 'Admin User',
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
    })

    console.log('Inserting Categories and Tags...')
    await db.collection('Category').insertMany(CATEGORIES)
    await db.collection('Tag').insertMany(TAGS)

    console.log('Preparing Articles...')
    const articlesToInsert = ARTICLES_SEED.map(info => {
        const category = CATEGORIES.find(c => c.slug === info.categorySlug)
        const randomTag = TAGS[Math.floor(Math.random() * TAGS.length)]

        return {
            _id: new ObjectId(),
            title: info.title,
            slug: info.slug,
            excerpt: info.excerpt,
            content: info.content,
            author: 'Redação TechBlog',
            featuredImage: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 99999999)}?auto=format&fit=crop&w=1200&q=80`,
            categoryId: category?._id,
            tagIds: [randomTag._id],
            publishedDate: new Date(Date.now() - Math.random() * 10000000000),
            createdAt: new Date(),
            updatedAt: new Date()
        }
    })

    console.log('Inserting 30 Articles...')
    await db.collection('Article').insertMany(articlesToInsert)

    console.log('Database seeded successfully via Native Driver!')
    await client.close()
}

main().catch(console.error)
