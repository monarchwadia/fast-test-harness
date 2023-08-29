import { thirdPartyABTester, ensureFastIsFinishedOnPage, getFastStateFromPage } from "./utils";


export class ScenarioModel {
    constructor({ page }) {
        /**
         * @type {import("@playwright/test").Page}
         */
        this.page = page;
    }

    async localizationToStorefrontScenario() {
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

    async storefrontToCustomizeScenario() {
        const { page } = this;
        await this.localizationToStorefrontScenario();

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
