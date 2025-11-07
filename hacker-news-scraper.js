#!/usr/bin/env node

/**
 * Hacker News Scraper
 * Scrapes top stories from Hacker News (news.ycombinator.com)
 */

const axios = require('axios');
const cheerio = require('cheerio');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
};

async function scrapeHackerNews(limit = 10) {
  console.log(`${colors.bright}${colors.cyan}
╔════════════════════════════════════════════════╗
║      🚀 HACKER NEWS TOP STORIES 🚀           ║
╚════════════════════════════════════════════════╝${colors.reset}\n`);

  try {
    console.log(`${colors.yellow}📡 Fetching stories from news.ycombinator.com...${colors.reset}\n`);

    // Fetch the page
    const response = await axios.get('https://news.ycombinator.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // Load HTML into cheerio
    const $ = cheerio.load(response.data);

    const stories = [];

    // Scrape story data
    $('.athing').each((index, element) => {
      if (index >= limit) return;

      const $story = $(element);
      const $subtext = $story.next('.subtext');

      const rank = $story.find('.rank').text();
      const title = $story.find('.titleline > a').first().text();
      const url = $story.find('.titleline > a').first().attr('href');
      const points = $subtext.find('.score').text();
      const author = $subtext.find('.hnuser').text();
      const commentsText = $subtext.find('a').last().text();
      const age = $subtext.find('.age').attr('title') || $subtext.find('.age').text();

      // Extract site domain if available
      const siteSpan = $story.find('.sitestr').text();

      stories.push({
        rank: rank.replace('.', ''),
        title,
        url: url?.startsWith('http') ? url : `https://news.ycombinator.com/${url}`,
        site: siteSpan || 'news.ycombinator.com',
        points: points || 'N/A',
        author: author || 'N/A',
        comments: commentsText,
        age: age || 'N/A'
      });
    });

    // Display results
    console.log(`${colors.green}✅ Successfully scraped ${stories.length} stories!${colors.reset}\n`);

    stories.forEach((story, index) => {
      console.log(`${colors.bright}${colors.magenta}#${story.rank} ${colors.cyan}${story.title}${colors.reset}`);
      console.log(`${colors.yellow}   🔗 ${story.site}${colors.reset}`);
      console.log(`   📊 ${story.points} | 👤 ${story.author} | ⏰ ${story.age}`);
      console.log(`   💬 ${story.comments}`);
      console.log(`   ${colors.cyan}${story.url}${colors.reset}`);
      console.log('');
    });

    console.log(`${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

    // Return data for programmatic use
    return stories;

  } catch (error) {
    console.error(`${colors.red}❌ Error scraping Hacker News:${colors.reset}`, error.message);

    if (error.response) {
      console.error(`${colors.red}Status: ${error.response.status}${colors.reset}`);
    } else if (error.request) {
      console.error(`${colors.red}No response received. Check your internet connection.${colors.reset}`);
    }

    return [];
  }
}

// Export for use as module
module.exports = { scrapeHackerNews };

// Run if executed directly
if (require.main === module) {
  const limit = process.argv[2] ? parseInt(process.argv[2]) : 10;

  scrapeHackerNews(limit)
    .then(stories => {
      console.log(`${colors.bright}${colors.green}✨ Scraping complete! Got ${stories.length} stories.${colors.reset}\n`);
    })
    .catch(err => {
      console.error(`${colors.red}Fatal error:${colors.reset}`, err);
      process.exit(1);
    });
}
