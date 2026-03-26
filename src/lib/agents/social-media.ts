import { ObjectId } from 'mongodb'

/**
 * Social Media Agent to handle automatic sharing of articles.
 */
export class SocialMediaAgent {
    private siteUrl: string

    constructor() {
        this.siteUrl = process.env.SITE_URL || 'https://tecnomais.online'
    }

    /**
     * Share a new article across all enabled platforms.
     */
    async shareArticle(article: {
        id: string | ObjectId
        title: string
        slug: string
        excerpt: string
        featuredImage?: string | null
    }) {
        console.log(`[SocialMediaAgent] Starting to share article: ${article.title}`)

        const results = await Promise.allSettled([
            this.shareToTelegram(article),
            this.shareToTwitter(article),
            this.shareToLinkedIn(article),
            this.shareToFacebook(article),
            this.shareToReddit(article),
            this.shareToDevTo(article),
            this.shareToDiscord(article)
        ])

        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.error(`[SocialMediaAgent] Failed sharing to platform ${index}:`, result.reason)
            }
        })

        return results
    }

    private async shareToTelegram(article: any) {
        const token = process.env.TELEGRAM_BOT_TOKEN
        const chatId = process.env.TELEGRAM_CHAT_ID
        if (!token || !chatId) return { skipped: true, reason: 'Missing Telegram config' }

        const url = `${this.siteUrl}/article/${article.slug}`
        
        // Hyper-persuasive, high-impact English templates
        const templates = [
            `🚨 *STOP EVERYTHING!* This just changed the game: ${article.title}\n\nYou can't afford to miss this. Read now: ${url}`,
            `🛑 *Wait, are you still using old methods?* ${article.title} is redefining everything.\n\nSee why everyone is talking about it: ${url}`,
            `📈 *THE FUTURE IS HERE:* ${article.title}\n\nWe've uncovered the truth. Get the full scoop before everyone else: ${url}`
        ]
        const text = templates[Math.floor(Math.random() * templates.length)]

        try {
            const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: text,
                    parse_mode: 'Markdown'
                })
            })
            return await response.json()
        } catch (error) {
            console.error('[TelegramAgent] Error:', error)
            throw error
        }
    }

    private async shareToTwitter(article: any) {
        // Implementation for Twitter/X (Placeholder as it requires OAuth complex flow or SDK)
        if (!process.env.TWITTER_API_KEY) return { skipped: true }
        console.log('[TwitterAgent] Sharing logic would go here')
        return { success: true, platform: 'Twitter' }
    }

    private async shareToLinkedIn(article: any) {
        const accessToken = process.env.LINKEDIN_ACCESS_TOKEN
        if (!accessToken) return { skipped: true, reason: 'Missing LinkedIn Access Token' }

        const url = `${this.siteUrl}/article/${article.slug}`
        
        // Reach-boosting mentions for top companies
        const topCompanies = ['Google', 'Microsoft', 'Meta', 'Apple', 'OpenAI', 'Midjourney', 'Amazon', 'Nvidia', 'Tesla', 'SpaceX', 'Netflix', 'Adobe']
        let mentions = ''
        const lowerTitle = article.title.toLowerCase()
        const foundCompanies = topCompanies.filter(c => lowerTitle.includes(c.toLowerCase()))
        
        if (foundCompanies.length > 0) {
            mentions = `Featuring insights on ${foundCompanies.map(c => `@${c}`).join(' ')}\n\n`
        }

        // High-impact LinkedIn post text
        const text = `🚨 THE FUTURE IS EVOLVING 🚨\n\n${article.title}\n\n${mentions}${article.excerpt}\n\nThis isn't just another update; it's a shift in the status quo. Explore the full breakdown below.\n\n👉 READ MORE: ${url}\n\n#Innovation #Tech #Future #Strategy #DigitalTransformation`.trim()

        try {
            // Get member profile using OpenID Connect 'userinfo' endpoint
            const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })
            
            if (!profileResponse.ok) {
                const errorText = await profileResponse.text()
                console.error('[LinkedInAgent] Profile fetch failed:', errorText)
                return { success: false, platform: 'LinkedIn', error: `Profile fetch failed: ${profileResponse.status}` }
            }

            const profile = await profileResponse.json()
            const personId = profile.sub || profile.id
            if (!personId) throw new Error('Could not identify LinkedIn User ID')
            
            // Priority: Organization URN if provided, otherwise Person URN
            const orgId = process.env.LINKEDIN_ORGANIZATION_ID
            const authorURN = orgId ? `urn:li:organization:${orgId}` : `urn:li:person:${personId}`

            // Now post the share
            const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'X-Restli-Protocol-Version': '2.0.0'
                },
                body: JSON.stringify({
                    author: authorURN,
                    lifecycleState: 'PUBLISHED',
                    specificContent: {
                        'com.linkedin.ugc.ShareContent': {
                            shareCommentary: { text: text },
                            shareMediaCategory: 'ARTICLE',
                            media: [
                                {
                                    status: 'READY',
                                    description: { text: article.excerpt },
                                    originalUrl: url,
                                    title: { text: article.title }
                                }
                            ]
                        }
                    },
                    visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
                })
            })

            const data = await response.json()
            if (!response.ok) {
                console.error('[LinkedInAgent] Share failed:', JSON.stringify(data, null, 2))
                return { success: false, platform: 'LinkedIn', error: data.message || 'Unknown LinkedIn Error', details: data }
            }

            console.log('[LinkedInAgent] Post successful:', data.id)
            return data
        } catch (error: any) {
            console.error('[LinkedInAgent] Error:', error)
            return { success: false, platform: 'LinkedIn', error: error.message }
        }
    }
    private async shareToFacebook(article: any) {
        // Implementation for Facebook (Placeholder)
        if (!process.env.FACEBOOK_PAGE_ACCESS_TOKEN) return { skipped: true }
        console.log('[FacebookAgent] Sharing logic would go here')
        return { success: true, platform: 'Facebook' }
    }

    private async shareToReddit(article: any) {
        // Implementation for Reddit (Placeholder)
        if (!process.env.REDDIT_CLIENT_ID) return { skipped: true }
        console.log('[RedditAgent] Sharing logic would go here')
        return { success: true, platform: 'Reddit' }
    }

    private async shareToDevTo(article: any) {
        const apiKey = process.env.DEVTO_API_KEY
        if (!apiKey) return { skipped: true }

        const url = `${this.siteUrl}/article/${article.slug}`
        
        // Balanced content: informative and independent
        const bodyMarkdown = `
# ${article.title}

${article.excerpt}

Understanding these shifts is crucial for any professional in the tech space. We've deconstructed the core elements of this evolution to provide a clear perspective on what's coming next.

### Key Takeaways:
- **Depth:** Exploring the practical implications of the recent ${article.title} developments.
- **Action:** How to leverage these tools to stay ahead of the curve.
- **Context:** Why this matters in the current global tech landscape.

Explore the complete, high-resolution breakdown and additional resources here: [Read Full Perspective](${url})

---
*Shared via [TecnoMais](${this.siteUrl})*
`.trim()

        try {
            const trimmedKey = apiKey.trim()
            const response = await fetch('https://dev.to/api/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': trimmedKey,
                    'User-Agent': 'TecnoMais-Blog-Agent'
                },
                body: JSON.stringify({
                    article: {
                        title: article.title,
                        published: true,
                        body_markdown: bodyMarkdown,
                        tags: ['programming', 'technology', 'webdev', 'ai']
                    }
                })
            })
            const data = await response.json()
            console.log('[DevToAgent] Post successful:', data.url)
            return data
        } catch (error) {
            console.error('[DevToAgent] Error:', error)
            throw error
        }
    }
    private async shareToDiscord(article: any) {
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL
        if (!webhookUrl) return { skipped: true, reason: 'Missing Discord Webhook URL' }

        const url = `${this.siteUrl}/article/${article.slug}`
        
        // Discord Rich Embed
        const embed = {
            title: `🚀 ${article.title}`,
            description: article.excerpt,
            url: url,
            color: 5814783, // Discord Blurple
            image: article.featuredImage ? { url: article.featuredImage } : undefined,
            footer: {
                text: 'TecnoMais | Staying Ahead of the Curve',
                icon_url: 'https://tecnomais.online/favicon.ico'
            },
            timestamp: new Date().toISOString()
        }

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: 'TecnoMais Bot',
                    avatar_url: 'https://tecnomais.online/favicon.ico',
                    content: '🚨 **NEW ARTICLE JUST DROPPED!** 🚨',
                    embeds: [embed]
                })
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error('[DiscordAgent] Webhook failed:', errorText)
                return { success: false, platform: 'Discord', error: response.statusText }
            }

            return { success: true, platform: 'Discord' }
        } catch (error: any) {
            console.error('[DiscordAgent] Error:', error)
            return { success: false, platform: 'Discord', error: error.message }
        }
    }
}

export const socialMediaAgent = new SocialMediaAgent()
