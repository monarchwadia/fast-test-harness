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
        await ensureFastIsFinishedOnPage(page);

        // get the FAST state
        const fast = await getFastStateFromPage(page);

        return { fast };
    }

    /**
     * This scenario will localize, navigate to the storefront, then select the first feature offer
     * @param {Partial<TravelOptions>} [opts]
     * @returns { Promise<{ fast: any }> } - The FAST state from the page
     */
    async travelToCustomize(opts) {
        opts = applyDefaultOpts(opts);
        const { page } = this;
        await this.travelToStorefront(opts);

        const addOfferBtn = await page.locator('.feature-offer').first().getByText("ADD OFFER");
        await addOfferBtn.click();
        await page.waitForURL(/https\:\/\/www.spectrum.com\/buy\/(internet).*/);
        await ensureFastIsFinishedOnPage(page);
        // get the FAST state
        const fast = await getFastStateFromPage(page);
        return { fast };
    }

    async enableThirdPartyScriptABTesting() {
        return await thirdPartyABTester(this.page)
    }
}