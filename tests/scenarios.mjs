// @ts-check
import { thirdPartyABTester, ensureFastIsFinishedOnPage, getFastStateFromPage } from "./utils.mjs";

// ====== TYPES ======
/**
 * @typedef ScenarioManagerOptions
 * @property {boolean} waitForFastToFinish
 */

// ====== FUNCTIONS ======

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

// ====== CLASSES ======

/**
 * This class contains scenarios that can be used to test the buyflow.
 * It is used in both the CLI and the tests.
 * 
 * @example
 * // travels to the storefront
 * const sm = new ScenarioModel(page, options);
 * await sm.travelToStorefront();
 * @example
 * // travels to the storefront, then stops on the Customize page
 * const sm = new ScenarioModel(page, options);
 * await sm.travelToCustomize();
 */
export class ScenarioModel {
    page;
    options;

    /**
     * 
     * @param {import("@playwright/test").Page} page 
     * @param {Partial<ScenarioManagerOptions>} [options]
     */
    constructor(page, options) {
        options = options || {};
        this.page = page;

        const DEFAULT_OPTIONS = {
            waitForFastToFinish: true
        }
        this.options = { ...DEFAULT_OPTIONS, ...options };
    }

    /**
     * This scenario will localize, and then navigate to the storefront
     * @returns { Promise<{ fast: any }> } - The FAST state from the final page
     */
    async travelToStorefront() {
        const { page, options } = this;

        // Localize on spectrum.com
        await page.goto("https://spectrum.com");
        await page.fill('.sp-localization-bar  [placeholder="Street Address"]', "6 Fiedler Cir");
        await page.fill('.sp-localization-bar  [placeholder="Apt/Unit"]', "Apt 100");
        await page.fill('.sp-localization-bar  [placeholder="Zip Code"]', "63026");
        await page.click('.sp-localization-bar button');

        // wait for localization to complete and FAST to be finished
        await page.waitForURL(/https\:\/\/www.spectrum.com\/buy\/(featured|internet).*/);

        if (options.waitForFastToFinish) {
            return await waitAndGetFastMetric(page);
        } else {
            return { fast: null }
        }
    }

    /**
     * This scenario will localize, select the first feature offer, then stop on Customize.
     * @returns { Promise<{ fast: any }> } - The FAST state from the final page
     */
    async travelToCustomize() {
        const { page, options } = this;

        await this.travelToStorefront();

        const addOfferBtn = await page.locator('.feature-offer').first().getByText("ADD OFFER");
        await addOfferBtn.click();
        await page.waitForURL(/https\:\/\/www.spectrum.com\/buy\/internet.*/);

        if (options.waitForFastToFinish) {
            return await waitAndGetFastMetric(page);
        } else {
            return { fast: null }
        }
    }

    /**
     * This scenario will localize, customize, then stop on EYI.
     * @param {Partial<ScenarioManagerOptions>} [opts]
     * @returns { Promise<{ fast: any }> } - The FAST state from the final page
     */
    async travelToEYI(opts) {
        const { page, options } = this;
        await this.travelToCustomize();

        await page.waitForSelector("#accordion-header-internet-equipment");
        await page.getByText("WiFi + FREE Modem").first().click();
        await page.locator(".cmp-buyflow-button.btn-active").getByText("CHECKOUT").first().click();

        await page.waitForURL(/https\:\/\/www.spectrum.com\/buy\/enter-your-information.*/);

        if (options.waitForFastToFinish) {
            return await waitAndGetFastMetric(page);
        } else {
            return { fast: null }
        }
    }

    async enableThirdPartyScriptABTestingIfAllowed() {
        return await thirdPartyABTester(this.page)
    }
}
