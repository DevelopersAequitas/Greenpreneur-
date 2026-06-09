import axios from 'axios';
import * as cheerio from 'cheerio';

const urls = [
  'https://greenpreneur.in/coffee-table-book-inquiries/',
  'https://greenpreneur.in/apply-as-sponsor/',
  'https://greenpreneur.in/apply-as-partner/',
  'https://greenpreneur.in/advertis-with-us/',
  'https://greenpreneur.in/collaboration-partnershipjoin-vyapaarjagat-partner-program/',
  'https://greenpreneur.in/join-to-fund-rais/',
  'https://greenpreneur.in/join-to-invest/',
  'https://greenpreneur.in/membership-inquiry/',
  'https://greenpreneur.in/publish-my-story/',
  'https://greenpreneur.in/speaker-applications/',
  'https://greenpreneur.in/start-a-chapter/',
  'https://greenpreneur.in/talk-show-speakers/'
];

async function scrapeForms() {
  const results = {};
  for (const url of urls) {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const fields = [];
      
      $('form input, form select, form textarea').each((i, el) => {
        const type = $(el).attr('type') || el.tagName.toLowerCase();
        if (type === 'hidden' || type === 'submit' || type === 'button') return;
        
        const name = $(el).attr('name') || '';
        const placeholder = $(el).attr('placeholder') || '';
        
        let label = '';
        const id = $(el).attr('id');
        if (id) {
            label = $(`label[for="${id}"]`).text().trim();
        }
        if (!label) {
            label = $(el).closest('label').text().trim();
        }
        if (!label) {
            label = $(el).parent().text().trim();
        }
        if (!label && placeholder) {
            label = placeholder;
        }

        fields.push({
            name,
            type,
            label: label.replace(/\s+/g, ' ').trim()
        });
      });
      
      results[url] = fields;
    } catch (e) {
      console.error(`Error fetching ${url}: ${e.message}`);
    }
  }
  console.log(JSON.stringify(results, null, 2));
}

scrapeForms();
