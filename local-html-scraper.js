#!/usr/bin/env node

/**
 * Local HTML Scraper Demo
 * Demonstrates web scraping capabilities by parsing HTML content
 */

const cheerio = require('cheerio');
const fs = require('fs');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
};

// Demo HTML content (simulating a scraped webpage)
const demoHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Tech News Demo Site</title>
</head>
<body>
    <h1>Latest Tech News</h1>

    <div class="article" data-id="1">
        <h2 class="title">AI Breaks New Ground in Code Generation</h2>
        <p class="author">By Sarah Johnson</p>
        <span class="date">2025-11-07</span>
        <div class="content">
            <p>Artificial intelligence models have reached unprecedented levels of accuracy...</p>
        </div>
        <div class="stats">
            <span class="views">15.2K views</span>
            <span class="likes">892 likes</span>
            <span class="comments">124 comments</span>
        </div>
    </div>

    <div class="article" data-id="2">
        <h2 class="title">Quantum Computing Reaches Commercial Viability</h2>
        <p class="author">By Dr. Michael Chen</p>
        <span class="date">2025-11-06</span>
        <div class="content">
            <p>Major tech companies announce breakthrough in quantum error correction...</p>
        </div>
        <div class="stats">
            <span class="views">28.7K views</span>
            <span class="likes">1.5K likes</span>
            <span class="comments">203 comments</span>
        </div>
    </div>

    <div class="article" data-id="3">
        <h2 class="title">New Programming Language Gains Momentum</h2>
        <p class="author">By Emily Rodriguez</p>
        <span class="date">2025-11-05</span>
        <div class="content">
            <p>Developers flock to a new systems programming language promising safety and speed...</p>
        </div>
        <div class="stats">
            <span class="views">12.1K views</span>
            <span class="likes">654 likes</span>
            <span class="comments">89 comments</span>
        </div>
    </div>

    <div class="article" data-id="4">
        <h2 class="title">Open Source Project Revolutionizes Data Processing</h2>
        <p class="author">By Alex Kim</p>
        <span class="date">2025-11-04</span>
        <div class="content">
            <p>A new open-source framework processes big data 10x faster than alternatives...</p>
        </div>
        <div class="stats">
            <span class="views">9.8K views</span>
            <span class="likes">445 likes</span>
            <span class="comments">67 comments</span>
        </div>
    </div>

    <div class="article" data-id="5">
        <h2 class="title">Blockchain Technology Finds New Applications in Healthcare</h2>
        <p class="author">By Dr. Lisa Thompson</p>
        <span class="date">2025-11-03</span>
        <div class="content">
            <p>Medical institutions adopt blockchain for secure patient data management...</p>
        </div>
        <div class="stats">
            <span class="views">18.3K views</span>
            <span class="likes">721 likes</span>
            <span class="comments">156 comments</span>
        </div>
    </div>

    <aside class="sidebar">
        <h3>Trending Topics</h3>
        <ul class="topics">
            <li data-trend="95">Artificial Intelligence</li>
            <li data-trend="87">Quantum Computing</li>
            <li data-trend="76">Blockchain</li>
            <li data-trend="68">Cybersecurity</li>
            <li data-trend="54">Cloud Computing</li>
        </ul>
    </aside>
</body>
</html>
`;

function scrapeHTML(html) {
  console.log(`${colors.bright}${colors.cyan}
╔════════════════════════════════════════════════╗
║        📰 WEB SCRAPER DEMO 📰                 ║
╚════════════════════════════════════════════════╝${colors.reset}\n`);

  // Load HTML with cheerio
  const $ = cheerio.load(html);

  // Extract page title
  const pageTitle = $('h1').first().text();
  console.log(`${colors.bright}${colors.yellow}Page Title: ${pageTitle}${colors.reset}\n`);

  // Scrape articles
  const articles = [];
  $('.article').each((index, element) => {
    const $article = $(element);

    const article = {
      id: $article.attr('data-id'),
      title: $article.find('.title').text(),
      author: $article.find('.author').text().replace('By ', ''),
      date: $article.find('.date').text(),
      excerpt: $article.find('.content p').text().substring(0, 80) + '...',
      views: $article.find('.views').text(),
      likes: $article.find('.likes').text(),
      comments: $article.find('.comments').text(),
    };

    articles.push(article);
  });

  // Display articles
  console.log(`${colors.green}📄 Found ${articles.length} articles:${colors.reset}\n`);

  articles.forEach((article, index) => {
    console.log(`${colors.bright}${colors.magenta}Article #${article.id}: ${colors.cyan}${article.title}${colors.reset}`);
    console.log(`   👤 ${article.author} | 📅 ${article.date}`);
    console.log(`   ${colors.yellow}${article.excerpt}${colors.reset}`);
    console.log(`   📊 ${article.views} | 👍 ${article.likes} | 💬 ${article.comments}`);
    console.log('');
  });

  // Scrape trending topics
  const topics = [];
  $('.topics li').each((index, element) => {
    const $topic = $(element);
    topics.push({
      name: $topic.text(),
      trend: $topic.attr('data-trend')
    });
  });

  console.log(`${colors.green}🔥 Trending Topics:${colors.reset}\n`);
  topics.forEach(topic => {
    const barLength = Math.floor(topic.trend / 5);
    const bar = '█'.repeat(barLength);
    console.log(`   ${colors.cyan}${topic.name.padEnd(25)}${colors.yellow}${bar}${colors.reset} ${topic.trend}%`);
  });

  console.log(`\n${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  return { articles, topics };
}

// Demonstrate different scraping techniques
function demonstrateTechniques(html) {
  const $ = cheerio.load(html);

  console.log(`${colors.bright}${colors.cyan}🔧 Scraping Techniques Demo:${colors.reset}\n`);

  // 1. CSS Selectors
  console.log(`${colors.yellow}1. CSS Selectors:${colors.reset}`);
  console.log(`   Articles: $(".article").length = ${$('.article').length}`);
  console.log(`   First title: $(".title").first().text() = "${$('.title').first().text()}"`);

  // 2. Attribute selectors
  console.log(`\n${colors.yellow}2. Attribute Selectors:${colors.reset}`);
  console.log(`   Article with id=3: $('[data-id="3"] .title').text() = "${$('[data-id="3"] .title').text()}"`);

  // 3. Traversing
  console.log(`\n${colors.yellow}3. DOM Traversal:${colors.reset}`);
  const firstArticle = $('.article').first();
  console.log(`   Next sibling: $('.article').first().next('.article').find('.title').text() = "${firstArticle.next('.article').find('.title').text()}"`);

  // 4. Data extraction
  console.log(`\n${colors.yellow}4. Data Extraction:${colors.reset}`);
  const viewCounts = [];
  $('.views').each((i, el) => {
    viewCounts.push($(el).text());
  });
  console.log(`   All view counts: [${viewCounts.join(', ')}]`);

  // 5. Text manipulation
  console.log(`\n${colors.yellow}5. Text Manipulation:${colors.reset}`);
  const excerpt = $('.content p').first().text().substring(0, 50);
  console.log(`   First 50 chars: "${excerpt}..."`);

  console.log(`\n${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
}

// Main execution
if (require.main === module) {
  console.log(`${colors.bright}${colors.green}✨ Starting Web Scraper Demo...${colors.reset}\n`);

  // Scrape the demo HTML
  const data = scrapeHTML(demoHTML);

  // Demonstrate techniques
  demonstrateTechniques(demoHTML);

  console.log(`${colors.bright}${colors.green}✅ Demo complete!${colors.reset}`);
  console.log(`${colors.cyan}💡 This scraper can parse any HTML - from files, URLs, or strings!${colors.reset}\n`);
}

module.exports = { scrapeHTML, demonstrateTechniques };
