const fs = require('fs');

const scraperObject = {
  async scraper(browser) {
    // scrape up some magic cards
    let url =
      'https://www.trollandtoad.com/magic-the-gathering/all-singles/7085';
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    await page.goto(url);
    // Wait for the required DOM to be rendered
    await page.waitForSelector('.result-container');
    // Get the link to all the required books

    let magicCards = await page.evaluate(() => {
      // images are inside an <a> with class prod-img-container
      // info is in a <div> with class product-info
      //    name is inner text of an <a> with class card-text
      //    description is inner text of an <a> child of <u> child of <div> with class prod-cat
      //    price is inner text of a <div> with classes "col-2 text-center p-1" child of <div> with classes "row position-relative align-center py-2 m-auto"
      let imgContainer = document.querySelectorAll(
        '.prod-img-container > a > img'
      );
      let names = document.querySelectorAll('.card-text');
      let descriptions = document.querySelectorAll('.prod-cat > u > a');
      // let prices = document.querySelectorAll('.col-2.text-center.p-1');

      let results = [];
      for (let i = 0; i < imgContainer.length; i++) {
        results[i] = {
          imageUrl: imgContainer[i].getAttribute('src'),
          name: names[i].innerText,
          description: descriptions[i].innerText,
          category: 'Magic: The Gathering',
          price: parseInt(Math.random() * 100000),
          quantity: parseInt(Math.random() * 100),
        };
      }
      return results;
    });

    // scrape up some yugiohs
    url = 'https://www.trollandtoad.com/yugioh/all-singles/7087';
    await page.goto(url);
    // Wait for the required DOM to be rendered
    await page.waitForSelector('.result-container');
    // Get the link to all the required books

    let yugiohCards = await page.evaluate(() => {
      // images are inside an <a> with class prod-img-container
      // info is in a <div> with class product-info
      //    name is inner text of an <a> with class card-text
      //    description is inner text of an <a> child of <u> child of <div> with class prod-cat
      //    price is inner text of a <div> with classes "col-2 text-center p-1" child of <div> with classes "row position-relative align-center py-2 m-auto"
      let imgContainer = document.querySelectorAll(
        '.prod-img-container > a > img'
      );
      let names = document.querySelectorAll('.card-text');
      let descriptions = document.querySelectorAll('.prod-cat > u > a');
      // let prices = document.querySelectorAll('.col-2.text-center.p-1');

      let results = [];
      for (let i = 0; i < imgContainer.length; i++) {
        results[i] = {
          imageUrl: imgContainer[i].getAttribute('src'),
          name: names[i].innerText,
          description: descriptions[i].innerText,
          category: 'Yu-Gi-Oh!',
          price: parseInt(Math.random() * 100000),
          quantity: parseInt(Math.random() * 100),
        };
      }
      return results;
    });

    // scrape up some pokemons
    url = 'https://www.trollandtoad.com/pokemon/all-singles/7088';
    await page.goto(url);
    // Wait for the required DOM to be rendered
    await page.waitForSelector('.result-container');
    // Get the link to all the required books

    let pokemonCards = await page.evaluate(() => {
      // images are inside an <a> with class prod-img-container
      // info is in a <div> with class product-info
      //    name is inner text of an <a> with class card-text
      //    description is inner text of an <a> child of <u> child of <div> with class prod-cat
      //    price is inner text of a <div> with classes "col-2 text-center p-1" child of <div> with classes "row position-relative align-center py-2 m-auto"
      let imgContainer = document.querySelectorAll(
        '.prod-img-container > a > img'
      );
      let names = document.querySelectorAll('.card-text');
      let descriptions = document.querySelectorAll('.prod-cat > u > a');
      // let prices = document.querySelectorAll('.col-2.text-center.p-1');

      let results = [];
      for (let i = 0; i < imgContainer.length; i++) {
        results[i] = {
          imageUrl: imgContainer[i].getAttribute('src'),
          name: names[i].innerText,
          description: descriptions[i].innerText,
          category: 'Pokemon',
          price: parseInt(Math.random() * 100000),
          quantity: parseInt(Math.random() * 100),
        };
      }
      return results;
    });

    cards = [...magicCards, ...yugiohCards, ...pokemonCards];
    fs.writeFile('cards.json', JSON.stringify(cards), (err) => {
      if (err) throw err;
      console.log('saved');
    });
  },
};

module.exports = scraperObject;
