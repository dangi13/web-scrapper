class Crawler {

//TODO cleaning and optimizing the code (right now its not fully organized as it should be)

    constructor(page) {
        this.page = page
    }

    /**
     *
     *  Getting search results from https://www.senheng.com
     * @param {*} keywordToSearch for e.g 'microwave'
     */
    async getSenhengResults(keywordToSearch) {
        console.log('Getting results for :', keywordToSearch)
        let senhengData = []
        let page = this.page
        console.log(`Navigating to https://www.senheng.com.my/search/?q=${keywordToSearch}`)
        await page.goto(`https://www.senheng.com.my/search/?q=${keywordToSearch}`, { timeout: 220000, waitUntil: 'load' })
        //navigating to application

        let noResultsNotice
        try {
            noResultsNotice = await page.waitForSelector('.kuNoResults-lp-message', { timeout: 1000 });
        } catch (e) {
            console.log('Data is present and scrapping them now..')
        }
        if (noResultsNotice === undefined) {
        await page.waitForSelector("#kuResultsView ul li div.kuName");
        const names = await page.evaluate(() => Array.from(document.querySelectorAll('#kuResultsView ul li div.kuName'), element => element.innerText));
        const images = await page.evaluate(() => Array.from(document.querySelectorAll('#kuLandingProductsListUl a img'), element => element.src));
        const price = await page.evaluate(() => Array.from(document.querySelectorAll('#kuResultsView ul li div.kuSalePrice'), element => element.innerText));

        for (let index = 0; index < names.length; index++) {
            let item = {}
            item.name = names[index]
            item.image = images[index]
            item.price = price[index].replace(/[^\d.-]/g, '');
            senhengData.push(item)
        }
    }

        return senhengData
    }

    /**
     * 
     *  Getting search results from https://shopee.com.my
     * @param {*} keywordToSearch for e.g 'microwave'
     */
    async getShoppeResults(keywordToSearch) {
        console.log('Getting Shoppe results for : ', keywordToSearch)

        let shoppeData = []
        let page = this.page
        console.log(`Navigating to https://shopee.com.my/search?keyword=${keywordToSearch}`)
        await page.goto(`https://shopee.com.my/search?keyword=${keywordToSearch}`, { timeout: 220000, waitUntil: 'load' })
        //navigating to application

        let noResultsNotice
        try {
            noResultsNotice = await page.waitForSelector('div.shopee-search-result-header__corrected', { timeout: 3000 });
        } catch (e) {   console.log('Data is present and scrapping them now..') }

        if (noResultsNotice === undefined) {
            try {
                const englishLangButton = await page.waitForSelector('button.shopee-button-outline.shopee-button-outline--primary-reverse', { timeout: 1000 })
                await englishLangButton.click()
            } catch (e) {}

        await page.waitForSelector(`footer[role='contentinfo']`);
        await scrollToEnd(page)
        await page.waitFor(3000)
        await page.waitForSelector("div[data-sqe='name'] div");
        const names = await page.evaluate(() => Array.from(document.querySelectorAll(`div[data-sqe='name']>div[class^='_1No']`), element => element.innerText.trim()));
        const images = await page.evaluate(() => Array.from(document.querySelectorAll(`div.row.shopee-search-item-result__items div[data-sqe='item'] img[style='object-fit: contain']`), element => element.src.trim()));
        const price = await page.evaluate(() => Array.from(document.querySelectorAll(`div[data-sqe='name'] + div`), element => element.innerText.trim()));

        for (let index = 0; index < names.length; index++) {
            let item = {}
            item.name = names[index]
            item.image = images[index]
            item.price = price[index].split('RM').pop().trim()
            shoppeData.push(item)
        }
    }

        return shoppeData
    }

    /**
     *  Getting search results from https://www.lazada.com.my
     * @param {*} keywordToSearch for e.g 'microwave'
     */
    async getLazdaResults(keywordToSearch) {
        console.log('Getting lazda results for : ', keywordToSearch)
        let lazdaData = []
        let page = this.page
        console.log(`Navigating to https://www.lazada.com.my/catalog/?q=${keywordToSearch}`)
        await page.goto(`https://www.lazada.com.my/catalog/?q=${keywordToSearch}`, { timeout: 220000, waitUntil: 'load' })

        await page.waitForSelector("div[data-tracking='product-card'] a[title]");
        const names = await page.evaluate(() => Array.from(document.querySelectorAll(`div[data-tracking='product-card'] a[title]`), element => element.innerText.trim()));
        //  const images = await page.evaluate(() => Array.from(document.querySelectorAll(`img[type='product']`), element => element.src.trim()));
        let priceElements = await page.$x("//div[@data-tracking='product-card']//a[@title]/parent::div//following-sibling::div[1]");
        let allPrices = [];
        await Promise.all(priceElements.map(async (price, index) => {
            const priceValue = await (await price.getProperty('innerText')).jsonValue();
            allPrices.push[priceValue]
        }));

        for (let index = 0; index < names.length; index++) {
            let item = {}
            item.name = names[index]
            // item.image = images[index]
            item.price = allPrices[index].split('RM').pop().trim();
            lazdaData.push(item)
        }

        return lazdaData
    }

    /**
   *  Getting search results from https://store.tbm.com.my
   * @param {*} keywordToSearch for e.g 'microwave'
   */
    async getStoreResults(keywordToSearch) {
        console.log('Getting Store results for : ', keywordToSearch)

        let storeData = []
        let page = this.page
        //  console.log('Navigating to application https://store.tbm.com.my')
        await page.goto(`https://store.tbm.com.my`, { timeout: 220000, waitUntil: 'load' })
        //navigating to application

        const searchButton = await page.waitForSelector('#search')
        await searchButton.type(keywordToSearch)
        await page.keyboard.press('Enter')
        let noResultsNotice
        try {
            noResultsNotice = await page.waitForSelector('div.message.notice', { timeout: 3000 });
        } catch (e) { console.log('Data is present and scrapping them now..') }

        if (noResultsNotice === undefined) {
            await page.waitForSelector('div.product.photo.product-item-photo img.product-image-photo.default_image')
            const names = await page.evaluate(() => Array.from(document.querySelectorAll(`ol.products.list.items.product-items  a[class='product-item-link']`), element => element.innerText.trim()));
            const images = await page.evaluate(() => Array.from(document.querySelectorAll(`div.product.photo.product-item-photo img.product-image-photo.default_image`), element => element.src.trim()));
            const price = await page.evaluate(() => Array.from(document.querySelectorAll(`ol.products.list.items.product-items  span[data-price-type='finalPrice']`), element => element.innerText.trim()));

            for (let index = 0; index < names.length; index++) {
                let item = {}
                item.name = names[index]
                item.image = images[index]
                item.price = price[index].split('RM').pop().trim();
                storeData.push(item)
            }
        }

        return storeData
    }


}

async function scrollToEnd(page) {
    await page.evaluate(() => new Promise((resolve) => {
        var scrollTop = -1;
        const interval = setInterval(() => {
            window.scrollBy(0, 100);
            if (document.documentElement.scrollTop !== scrollTop) {
                scrollTop = document.documentElement.scrollTop;
                return;
            }
            clearInterval(interval);
            resolve();
        }, 5);
    }));
}
export default Crawler
// module.exports= Crawler