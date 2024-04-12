import {
    acceptTermsXpath, companyNameXpath,
    currentResultXpath, exploreXpath,
    flightDateXpath, fromXpath,
    offerBannerBtnCloseXpath, oneWaySelectorXpath, oneWayXpath,
    orderBySelectorXpath, orderByXpath, priceXpath, resultsXpath, selectFromXpath,
    selectToXpath, timeFromXpath, timeToXpath,
    toFieldXpath,
    viewFlightsBtn
} from './flights-xpaths';

const puppeteer = require('puppeteer');

// xparths
const initialNavigation = async (headless: boolean = true) =>  {

    console.log("Generating pupeeter session!")
    const browser = await puppeteer.launch({headless, timeout: 5000, args: ['--lang=en-US,en']});
    //note: with a window resize, flight details might fail, so keep current specs.
    const page = await browser.newPage();
    // resize to 1920 x 1080
    await page.setViewport({width: 1920, height: 1080})

    console.log("Initial navigation. Going directly to \"explore\" instead of \"travels\" so we reduce 1 step per each scraping.");
    await page.goto('https://www.google.com/travel/flights');
    return {browser,page};
}
const acceptTerms = async (page: any) =>  {
    console.log("Click \"accept terms\"");
    await page.waitForSelector(acceptTermsXpath);
    await page.click(acceptTermsXpath);
}
const explore = async (page: any) =>  {
    console.log("Click \"explore\"");
    await page.waitForSelector(exploreXpath);
    await page.click(exploreXpath);
    console.log('Wait page to load results');
    await page.waitForSelector(resultsXpath);
}
const selectOneWay = async (page: any) =>  {
    console.log("Select solo ida / one-way")
    await page.waitForSelector(oneWaySelectorXpath);
    await page.click(oneWaySelectorXpath);

    await page.waitForSelector(oneWayXpath);
    await page.click(oneWayXpath);
}


const pickFrom = async (page: any, from: string) =>  {
    console.log("Fill 'from' field");
    await page.waitForSelector(fromXpath);
    await (await page.$(fromXpath)).evaluate((input: any) => input.value = '');
    await page.type(fromXpath, from, {delay: 20});

    await page.waitForSelector(selectFromXpath);
    await page.click(selectFromXpath);

    console.log('Wait page to load results after picking from...');
    await page.waitForSelector(resultsXpath);

}

const pickTo = async (page: any, to: string) =>  {
    console.log('Enter "to" field')
    await page.waitForSelector(toFieldXpath);
    await (await page.$(toFieldXpath)).evaluate((input: any) => input.value = '');
    await page.type(toFieldXpath, to, {delay: 20});

    await page.waitForSelector(selectToXpath);
    await page.click(selectToXpath);
}

const redirectAfterSelection = async (page: any) =>  {
    console.log('check it was a valid trip and from / to are valid fields:');
    console.log('extract "view flights" url and redirect current page')
    try {
        // await page.waitForSelector(viewFlightsBtn, {timeout: 3000});
    } catch (e) {
        console.error(e)
        throw new Error('Field "from" or "to" is invalid.');
    }
    const finalFlightsUri = await page.$eval(viewFlightsBtn, (element: any) => element.getAttribute("href"));
    await page.goto(`https://www.google.com${finalFlightsUri}`);
}

const getFlightDate = async (page: any) =>  {
    console.log('Get flight date');
    await page.waitForSelector(flightDateXpath);
    return (await (await (await page.$(flightDateXpath)).getProperty('textContent')).jsonValue());
}

const standarizeAndFilter = async (page: any) =>  {
    console.log('Standarize output results by selecting "all results - price" in the dropdown instead "best results"');
    await page.waitForSelector(orderBySelectorXpath);
    console.log('remove offer if exists');
    try {
        await page.click(offerBannerBtnCloseXpath);
    } catch (e) {

    }
    console.log('select filters')
    await page.click(orderBySelectorXpath);
    await page.waitForSelector(orderByXpath);
    await page.click(orderByXpath);

    console.log('wait for results to be ordered... (by above spinner). ist must appear and then dissapear')
    await page.waitForSelector('.Jwkq3b.IrPQJb');
    await page.waitForSelector('.Jwkq3b.IrPQJb', {hidden: true});
}

const analyzeFlight = async (page: any, flightDate: any, i: number) =>  {
    const companyInfoDto = {company: '', price: '', beginFlight: '', endFlight: ''};
    //todo this should iterate results

    await page.waitForSelector(currentResultXpath.replace("$I_COUNTER", i.toString()));

    console.log("Company name")
    await page.waitForSelector(companyNameXpath.replace("$I_COUNTER", i.toString()));

    console.log("Price")
    await page.waitForSelector(priceXpath.replace("$I_COUNTER", i.toString()));

    console.log("times")
    await page.waitForSelector(timeFromXpath.replace("$I_COUNTER", i.toString()));

    await page.waitForSelector(timeToXpath.replace("$I_COUNTER", i.toString()));

    companyInfoDto.company = await (await (await page.$(companyNameXpath.replace("$I_COUNTER", i.toString()))).getProperty('textContent')).jsonValue()
    companyInfoDto.price = await (await (await page.$(priceXpath.replace("$I_COUNTER", i.toString()))).getProperty('textContent')).jsonValue()
    companyInfoDto.beginFlight = `${flightDate} - ${await (await (await page.$(timeFromXpath.replace("$I_COUNTER", i.toString()))).getProperty('textContent')).jsonValue()}`;
    companyInfoDto.endFlight = `${flightDate} - ${await (await (await page.$(timeToXpath.replace("$I_COUNTER", i.toString()))).getProperty('textContent')).jsonValue()}`;

    console.log(`Flights information:`, companyInfoDto);
}

const getFlightsFromTo = async (from: string, to: string, headless: boolean = true, limit: number = 5) => {
    const results = [];

    const {browser,page} = await initialNavigation();
    await acceptTerms(page);
    await explore(page);
    await selectOneWay(page);
    await pickFrom(page, from);
    await pickTo(page, from);
    await redirectAfterSelection(page);
    const flightDate = await getFlightDate(page);
    await standarizeAndFilter(page);

    for (let i = 1; i <= limit; i++) {
        try {
            const companyInfoDto = await analyzeFlight(page, flightDate, i);
            results.push(companyInfoDto);
        } catch (e) {
            console.log("Flight not available.", e);
        }
    }

    await browser.close();
    return results;
}
export default getFlightsFromTo;
