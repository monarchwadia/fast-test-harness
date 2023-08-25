// @ts-check

import { test } from '@playwright/test';
import { ensureFastIsFinishedOnPage, getFastStateFromPage, logEvent, thirdPartyABTester } from './utils';

test('localizationToStorefront', async ({ page, browser, browserName }, testInfo) => {
    // Get the response from the HAR file
    // await page.routeFromHAR('./harfile/session.har', {
    //     url: '*/**/proxy.api/*/**',
    //     update: true, // flip to true to update the HAR file, false to not update
    // });

    // set AB testing on third party scripts
    const { areThirdPartyScriptsDisabled } = await thirdPartyABTester(page);

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

    const timestamp = new Date().toISOString();
    const duration = fast.duration;

    logEvent({ timestamp, browserName, duration, areThirdPartyScriptsDisabled })
})
