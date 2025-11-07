#!/usr/bin/env node

/**
 * JSON API Scraper
 * Demonstrates scraping data from JSON APIs
 * Works with public APIs that don't require authentication
 */

const axios = require('axios');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
};

class JSONScraper {
  constructor() {
    this.apis = {
      github: 'https://api.github.com/repos/microsoft/vscode',
      crypto: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd',
      jokes: 'https://official-joke-api.appspot.com/random_joke',
      weather: 'https://wttr.in/London?format=j1',
      quotes: 'https://api.quotable.io/random',
    };
  }

  async scrapeGitHub(repo = 'microsoft/vscode') {
    console.log(`${colors.bright}${colors.cyan}📦 GitHub Repository Data${colors.reset}\n`);

    try {
      const response = await axios.get(`https://api.github.com/repos/${repo}`);
      const data = response.data;

      console.log(`${colors.bright}${colors.yellow}Repository: ${data.full_name}${colors.reset}`);
      console.log(`📝 Description: ${data.description}`);
      console.log(`⭐ Stars: ${data.stargazers_count.toLocaleString()}`);
      console.log(`🍴 Forks: ${data.forks_count.toLocaleString()}`);
      console.log(`👀 Watchers: ${data.watchers_count.toLocaleString()}`);
      console.log(`🐛 Open Issues: ${data.open_issues_count.toLocaleString()}`);
      console.log(`📅 Created: ${new Date(data.created_at).toLocaleDateString()}`);
      console.log(`🔄 Last Updated: ${new Date(data.updated_at).toLocaleDateString()}`);
      console.log(`🔗 URL: ${colors.cyan}${data.html_url}${colors.reset}`);

      return data;
    } catch (error) {
      console.error(`${colors.red}❌ Error: ${error.message}${colors.reset}`);
      return null;
    }
  }

  async scrapeCrypto() {
    console.log(`\n${colors.bright}${colors.cyan}💰 Cryptocurrency Prices${colors.reset}\n`);

    try {
      const response = await axios.get(this.apis.crypto);
      const data = response.data;

      Object.entries(data).forEach(([coin, prices]) => {
        console.log(`${colors.yellow}${coin.toUpperCase()}:${colors.reset} $${prices.usd.toLocaleString()}`);
      });

      return data;
    } catch (error) {
      console.error(`${colors.red}❌ Error: ${error.message}${colors.reset}`);
      return null;
    }
  }

  async scrapeJoke() {
    console.log(`\n${colors.bright}${colors.cyan}😄 Random Joke${colors.reset}\n`);

    try {
      const response = await axios.get(this.apis.jokes);
      const data = response.data;

      console.log(`${colors.yellow}${data.setup}${colors.reset}`);
      console.log(`${colors.green}${data.punchline}${colors.reset}`);

      return data;
    } catch (error) {
      console.error(`${colors.red}❌ Error: ${error.message}${colors.reset}`);
      return null;
    }
  }

  async scrapeQuote() {
    console.log(`\n${colors.bright}${colors.cyan}💭 Random Quote${colors.reset}\n`);

    try {
      const response = await axios.get(this.apis.quotes);
      const data = response.data;

      console.log(`${colors.yellow}"${data.content}"${colors.reset}`);
      console.log(`${colors.magenta}— ${data.author}${colors.reset}`);

      return data;
    } catch (error) {
      console.error(`${colors.red}❌ Error: ${error.message}${colors.reset}`);
      return null;
    }
  }

  async scrapeMultiple() {
    console.log(`${colors.bright}${colors.green}
╔═══════════════════════════════════════════════════╗
║       🌐 JSON API SCRAPER DEMO 🌐               ║
╚═══════════════════════════════════════════════════╝${colors.reset}\n`);

    const results = {};

    // Scrape GitHub data
    results.github = await this.scrapeGitHub('nodejs/node');

    // Scrape crypto prices
    results.crypto = await this.scrapeCrypto();

    // Scrape a joke
    results.joke = await this.scrapeJoke();

    // Scrape a quote
    results.quote = await this.scrapeQuote();

    console.log(`\n${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
    console.log(`${colors.bright}${colors.green}✅ API scraping complete!${colors.reset}\n`);

    return results;
  }

  // Example: Scraping paginated API
  async scrapePaginated(baseUrl, maxPages = 3) {
    console.log(`${colors.bright}${colors.cyan}📄 Paginated API Scraping Example${colors.reset}\n`);

    const allData = [];

    for (let page = 1; page <= maxPages; page++) {
      try {
        console.log(`${colors.yellow}Fetching page ${page}...${colors.reset}`);
        const response = await axios.get(`${baseUrl}?page=${page}`);
        allData.push(...response.data);
      } catch (error) {
        console.error(`${colors.red}Error on page ${page}: ${error.message}${colors.reset}`);
        break;
      }
    }

    console.log(`${colors.green}✅ Scraped ${allData.length} items from ${maxPages} pages${colors.reset}\n`);
    return allData;
  }
}

// Export for use as module
module.exports = JSONScraper;

// Run if executed directly
if (require.main === module) {
  const scraper = new JSONScraper();

  scraper.scrapeMultiple()
    .then(results => {
      console.log(`${colors.bright}${colors.magenta}💡 Tip: You can scrape any JSON API!${colors.reset}`);
      console.log(`${colors.cyan}   Just use axios.get(url) and process the response.data${colors.reset}\n`);
    })
    .catch(err => {
      console.error(`${colors.red}Fatal error:${colors.reset}`, err);
      process.exit(1);
    });
}
