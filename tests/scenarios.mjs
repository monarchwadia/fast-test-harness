// @ts-check
import { thirdPartyABTester, ensureFastIsFinishedOnPage, getFastStateFromPage } from "./utils.mjs";

/**
 * @typedef TravelOptions
 * @property {boolean} waitForFastToFinish
 */

/**
 * Applies defaults to the options
 * @param {Partial<TravelOptions>} [opts]
 * @returns {TravelOptions}
 */
const applyDefaultOpts = (opts = {}) => {
    const defaultOptions = {
        waitForFastToFinish: true
    }

    return { ...defaultOptions, ...opts };
}

/**
 * 
 * @param {import("@playwright/test").Page} page
    * @returns {Promise<{ fast: any }>}
 */
const waitAndGetFastMetric = async (page) => {
    console.log("Waiting for FAST [STARTED]");
    await ensureFastIsFinishedOnPage(page);
    // get the FAST state
    const fast = await getFastStateFromPage(page);
    console.log("Waiting for FAST [FINISHED]");
    return { fast };
}

export class ScenarioModel {
    constructor({ page }) {
        /**
         * @type {import("@playwright/test").Page}
         */
        this.page = page;
    }

    /**
     * This scenario will localize, and then navigate to the storefront
     * @param {Partial<TravelOptions>} [opts]
     * @returns { Promise<{ fast: any }> } - The FAST state from the page
     */
    async travelToStorefront(opts) {
        opts = applyDefaultOpts(opts);
        const { page } = this;

        // Localize on spectrum.com
        await page.goto("https://spectrum.com");
        await page.fill('.sp-localization-bar  [placeholder="Street Address"]', "6 Fiedler Cir");
        await page.fill('.sp-localization-bar  [placeholder="Apt/Unit"]', "Apt 100");
        await page.fill('.sp-localization-bar  [placeholder="Zip Code"]', "63026");
        await page.click('.sp-localization-bar button');

        // wait for localization to complete and FAST to be finished
        await page.waitForURL(/https\:\/\/www.spectrum.com\/buy\/(featured|internet).*/);

        if (opts.waitForFastToFinish) {
            const result = await waitAndGetFastMetric(page);
            return result;
        } else {
            return { fast: null }
        }
    }

    /**
     * This scenario will localize, select the first feature offer, then stop on Customize.
     * @param {Partial<TravelOptions>} [opts]
     * @returns { Promise<{ fast: any }> } - The FAST state from the page
     */
    async travelToCustomize(opts) {
        opts = applyDefaultOpts(opts);
        const { page } = this;
        await this.travelToStorefront(opts);

        const addOfferBtn = await page.locator('.feature-offer').first().getByText("ADD OFFER");
        await addOfferBtn.click();
        await page.waitForURL(/https\:\/\/www.spectrum.com\/buy\/internet.*/);

        if (opts.waitForFastToFinish) {
            return await waitAndGetFastMetric(page);
        } else {
            return { fast: null }
        }
    }

    /**
     * This scenario will localize, customize, then stop on EYI.
     * @param {Partial<TravelOptions>} [opts]
     * @returns { Promise<{ fast: any }> } - The FAST state from the page
     */
    async travelToEYI(opts) {
        opts = applyDefaultOpts(opts);
        const { page } = this;
        await this.travelToCustomize(opts);

        await page.waitForSelector("#accordion-header-internet-equipment");
        await page.getByText("WiFi + FREE Modem").first().click();
        await page.locator(".cmp-buyflow-button.btn-active").getByText("CHECKOUT").first().click();

        await page.waitForURL(/https\:\/\/www.spectrum.com\/buy\/enter-your-information.*/);

        if (opts.waitForFastToFinish) {
            return await waitAndGetFastMetric(page);
        } else {
            return { fast: null }
        }
    }

    async enableThirdPartyScriptABTesting() {
        return await thirdPartyABTester(this.page)
    }
}
