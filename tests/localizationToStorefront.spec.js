// @ts-check

import { test, expect } from '@playwright/test';
import path from "path";
import fs from "fs-extra";

test('localizationToStorefront', async ({ page, browser, browserName }, testInfo) => {
    // Get the response from the HAR file
    await page.routeFromHAR('./harfile/session.har', {
        url: '*/**/proxy.api/*/**',
        update: true, // flip to true to update the HAR file, false to not update
    });


    const disableThirdPartyScripts = process.env.AB_TEST_THIRD_PARTY === "true" ? Math.random() < 0.5 : false;

    const blacklist = [
        "appdynamics-eun.charter.com",
        "cdn.appdynamics.com",
        "p11.techlab-cdn.com",
        "tags.tiqcdn.com",
        "cdn.attn.tv", // unsure if working correctly
        "googletagmanager.com", // unsure if working correctly
    ];

    await page.route("**/*", (route) => {
        if (disableThirdPartyScripts) {
            const { hostname } = new URL(route.request().url());
    
            if (blacklist.includes(hostname)) {
                return route.abort();
            }
        }
        
        return route.continue();
    });

    await page.goto("https://spectrum.com");

    // fill in the form with name "address" with "6 Fiedler Cir"
    // fill in the form with name="apt" with "Apt 100"
    // fill in the form with name="zip" with "63026"
    await page.fill('.sp-localization-bar  [placeholder="Street Address"]', "6 Fiedler Cir");
    await page.fill('.sp-localization-bar  [placeholder="Apt/Unit"]', "Apt 100");
    await page.fill('.sp-localization-bar  [placeholder="Zip Code"]', "63026");

    // Click the get started link.
    await page.click('.sp-localization-bar button');

    await page.waitForURL(/https\:\/\/www.spectrum.com\/buy\/(featured|internet).*/);

    await page.waitForFunction(() => {
        // @ts-ignore
        return window.reduxStore.getState().analytics.fast.state === "finished";
    })

    await page.waitForTimeout(10);

    const fast = await page.evaluate(() => {
        // @ts-ignore
        return window.reduxStore.getState().analytics.fast;
    });

    // // yyyy-MM-dd HH_mm_ss format
    // // @ts-ignore
    // const folderName = new Date().toISOString().replaceAll("T", " ").replaceAll(":", "_").replaceAll('.',"_").replaceAll("Z","")

    // // log the object
    // const RESULT_FOLDER = path.join(__dirname, "..", "fast-results", browserName, folderName);
    // fs.ensureDirSync(RESULT_FOLDER);

    // const JSON_FILE_PATH =  path.join(RESULT_FOLDER, "localizationToStorefront.json")
    // fs.ensureFileSync(JSON_FILE_PATH);
    // fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(fast, null, 2));

    // // output the duration to a file
    // const duration = fast.duration;
    // const DURATION_FILE_PATH = path.join(RESULT_FOLDER, `${duration} was the duration`);
    // fs.ensureFileSync(DURATION_FILE_PATH);

    // @ts-ignore
    const timestamp = new Date().toISOString();
    const duration = fast.duration;

    const RESULT_FILE = path.join(__dirname, "..", "results.csv");
    fs.ensureFileSync(RESULT_FILE);
    fs.appendFileSync(RESULT_FILE, `${timestamp},${browserName},${duration},"${disableThirdPartyScripts ? "Disabled" : "Enabled"} 3rd party scripts"\n`);
})
