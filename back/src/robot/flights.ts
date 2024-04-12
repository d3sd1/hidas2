const puppeteer = require('puppeteer');


const getFlightsFromTo = async (from: string, to: string, headless: boolean = true, limit: number = 5) => {
    const results = [];
    console.log("Generating pupeeter session!")
    const browser = await puppeteer.launch({headless, timeout: 5000, args: ['--lang=en-US,en']});


    //note: with a window resize, flight details might fail, so keep current specs.
    const page = await browser.newPage();
    // resize to 1920 x 1080
    await page.setViewport({width: 1920, height: 1080})

    console.log("Initial navigation. Going directly to \"explore\" instead of \"travels\" so we reduce 1 step per each scraping.");
    await page.goto('https://www.google.com/travel/flights');

    console.log("Click \"accept terms\"");
    const acceptTermsXpath = 'xpath/html/body/c-wiz/div/div/div/div[2]/div[1]/div[3]/div[1]/div[1]/form[2]/div/div/button';
    await page.waitForSelector(acceptTermsXpath);
    await page.click(acceptTermsXpath);

    console.log("Click \"explore\"");
    const exploreXpath = 'xpath/html/body/c-wiz[2]/div/div[2]/c-wiz/div[1]/c-wiz/div[2]/div[1]/div[1]/div[2]/div/button';
    await page.waitForSelector(exploreXpath);
    await page.click(exploreXpath);

    console.log('Wait page to load results');
    const resultsXpath = 'xpath/html/body/c-wiz[3]/div/div[2]/div/c-wiz/div[2]/div/div/div[1]/main/div/div[2]/div/ol/li[1]';
    await page.waitForSelector(resultsXpath);

    console.log("Select solo ida / one-way")
    const oneWaySelectorXpath = 'xpath/html/body/c-wiz[3]/div/div[2]/div/c-wiz/div[2]/div/div/div[1]/div[1]/section/div/div[1]/div[1]/div[1]/div[1]/div[1]/div/div/div/div[1]/div';
    await page.waitForSelector(oneWaySelectorXpath);
    await page.click(oneWaySelectorXpath);

    const oneWayXpath = 'xpath/html/body/c-wiz[3]/div/div[2]/div/c-wiz/div[2]/div/div/div[1]/div[1]/section/div/div[1]/div[1]/div[1]/div[1]/div[1]/div/div/div/div[2]/ul/li[2]';
    await page.waitForSelector(oneWayXpath);
    await page.click(oneWayXpath);


    console.log("Fill 'from' field");
    const fromXpath = 'xpath/html/body/c-wiz[3]/div/div[2]/div/c-wiz/div[2]/div/div/div[1]/div[1]/section/div/div[1]/div[1]/div[1]/div[2]/div[1]/div/div[1]/div/div[1]/div/div/input';
    await page.waitForSelector(fromXpath);
    await (await page.$(fromXpath)).evaluate((input: any) => input.value = '');
    await page.type(fromXpath, from, {delay: 20});

    const selectFromXpath = 'xpath/html/body/c-wiz[3]/div/div[2]/div/c-wiz/div[2]/div/div/div[1]/div[1]/section/div/div[1]/div[1]/div[1]/div[2]/div[1]/div/div[1]/div/div[2]/div[3]/ul/li[1]';
    await page.waitForSelector(selectFromXpath);
    await page.click(selectFromXpath);

    console.log('Wait page to load results after picking from...');
    await page.waitForSelector(resultsXpath);

    console.log('Enter "to" field')
    const toFieldXpath = 'xpath/html/body/c-wiz[3]/div/div[2]/div/c-wiz/div[2]/div/div/div[1]/div[1]/section/div/div[1]/div[1]/div[1]/div[2]/div[1]/div/div[2]/div/div[1]/div/div/input';
    await page.waitForSelector(toFieldXpath);
    await (await page.$(toFieldXpath)).evaluate((input: any) => input.value = '');
    await page.type(toFieldXpath, to, {delay: 20});

    const selectToXpath = 'xpath/html/body/c-wiz[3]/div/div[2]/div/c-wiz/div[2]/div/div/div[1]/div[1]/section/div/div[1]/div[1]/div[1]/div[2]/div[1]/div/div[2]/div/div[2]/div[3]/ul/li[1]';
    await page.waitForSelector(selectToXpath);
    await page.click(selectToXpath);

    console.log('check it was a valid trip and from / to are valid fields:');
    console.log('extract "view flights" url and redirect current page')
    const viewFlightsBtn = 'xpath/html/body/c-wiz[3]/div/div[2]/div/c-wiz/div[2]/div/div/div[2]/div/div[4]/div[1]/div/div[2]/div[4]/div/div/div/a';
    try {
        await page.waitForSelector(viewFlightsBtn, {timeout: 3000});
    } catch (e) {
        throw new Error('Field "from" or "to" is invalid.');
    }
    const finalFlightsUri = await page.$eval(viewFlightsBtn, (element: any) => element.getAttribute("href"));

    await page.goto(`https://www.google.com${finalFlightsUri}`);


    console.log('Get flight date');
    const flightDateXpath = 'xpath/html/body/c-wiz[2]/div/div[2]/c-wiz/div[1]/c-wiz/div[2]/div[2]/div[2]/div[1]/div/div[1]/label[1]/span[1]/div';
    await page.waitForSelector(flightDateXpath);
    const flightDate = (await (await (await page.$(flightDateXpath)).getProperty('textContent')).jsonValue());

    console.log('Standarize output results by selecting "all results - price" in the dropdown instead "best results"');
    const orderBySelectorXpath = 'xpath/html/body/c-wiz[2]/div/div[2]/c-wiz/div[1]/c-wiz/div[2]/div[2]/div[3]/div/div/div/div[1]/div/button';
    await page.waitForSelector(orderBySelectorXpath);

    console.log('remove offer if exists');
    try {
        const offerBannerBtnCloseXpath = 'xpath/html/body/c-wiz[2]/div/div[2]/c-wiz/div[1]/c-wiz/div[2]/div[2]/div[2]/div[2]/div/div/div[1]/span/span/span[2]/div/div/div/div[3]';
        await page.click(offerBannerBtnCloseXpath);
    } catch (e) {

    }

    console.log('select filters')
    await page.click(orderBySelectorXpath);

    const orderByXpath = 'xpath/html/body/c-wiz[2]/div/div[2]/c-wiz/div[1]/c-wiz/div[2]/div[2]/div[3]/div/div/div/div[2]/div/ul/li[2]';
    await page.waitForSelector(orderByXpath);
    await page.click(orderByXpath);


    console.log('wait for results to be ordered... (by above spinner). ist must appear and then dissapear')
    await page.waitForSelector('.Jwkq3b.IrPQJb');
    await page.waitForSelector('.Jwkq3b.IrPQJb', {hidden: true});


//
    // First results: Most suitable 3
    for (let i = 1; i <= limit; i++) {
        try {
            const companyInfoDto = {company: '', price: '', beginFlight: '', endFlight: ''};
            //todo this should iterate results
            const currentResultXpath = `xpath/html/body/c-wiz[2]/div/div[2]/c-wiz/div[1]/c-wiz/div[2]/div[2]/div[4]/ul/li[${i}]`;

            await page.waitForSelector(currentResultXpath);

            console.log("Company name")
            const companyNameXpath = `${currentResultXpath}/div/div[2]/div/div[2]/div/div[2]/div[2]`;
            await page.waitForSelector(companyNameXpath);

            console.log("Price")
            const priceXpath = `${currentResultXpath}/div/div[2]/div/div[2]/div/div[6]/div[1]/div[2]/span`;
            await page.waitForSelector(priceXpath);

            console.log("times")
            const timeFromXpath = `${currentResultXpath}/div/div[2]/div/div[2]/div/div[2]/div[1]/span/span[1]/span/span/span`;
            await page.waitForSelector(timeFromXpath);

            const timeToXpath = `${currentResultXpath}/div/div[2]/div/div[2]/div/div[2]/div[1]/span/span[2]/span/span/span`;
            await page.waitForSelector(timeToXpath);

            companyInfoDto.company = await (await (await page.$(companyNameXpath)).getProperty('textContent')).jsonValue()
            companyInfoDto.price = await (await (await page.$(priceXpath)).getProperty('textContent')).jsonValue()
            companyInfoDto.beginFlight = `${flightDate} - ${await (await (await page.$(timeFromXpath)).getProperty('textContent')).jsonValue()}`;
            companyInfoDto.endFlight = `${flightDate} - ${await (await (await page.$(timeToXpath)).getProperty('textContent')).jsonValue()}`;

            console.log(`Flights information:`, companyInfoDto);
            results.push(companyInfoDto);
        } catch (e) {
            console.log("Flight not available.", e);
        }
    }

    await browser.close();

    return results;
}
export default getFlightsFromTo;
