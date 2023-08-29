import path from "path";
import fs from "fs-extra";

const THIRD_PARTY_DOMAIN_BLACKLIST = [
    "appdynamics-eun.charter.com",
    "cdn.appdynamics.com",
    "p11.techlab-cdn.com",
    "tags.tiqcdn.com",
    "cdn.attn.tv", // unsure if working correctly
    "googletagmanager.com", // unsure if working correctly
];

export const thirdPartyABTester = async (page) => {
    const isDisabled = process.env.AB_TEST_THIRD_PARTY === "true" ? Math.random() < 0.5 : false;

    let handler;
    if (isDisabled) {
        handler = ((route) => {
            const { hostname } = new URL(route.request().url());

            if (THIRD_PARTY_DOMAIN_BLACKLIST.includes(hostname)) {
                return route.abort();
            }

            route.continue();
        })

        await page.route("**/*", handler);
    }

    return { areThirdPartyScriptsDisabled: isDisabled };
}

/**
 * 
 * @param {string} eventLabel
 * @param {{ browserName: string, duration: number, areThirdPartyScriptsDisabled: boolean }} param
 */
export const logEvent = (eventLabel, { browserName, duration, areThirdPartyScriptsDisabled: disableThirdPartyScripts }) => {
    const RESULT_FILE = path.join(__dirname, "..", "results.csv");
    fs.ensureFileSync(RESULT_FILE);

    // if file is empty, add headers
    if (fs.readFileSync(RESULT_FILE).length === 0) {
        const headers = `"Event Label","Timestamp","Browser","FAST Duration","3rd party scripts Enabled?"\n`;
        fs.appendFileSync(RESULT_FILE, headers);
    }

    // write the event
    const timestamp = new Date().toISOString();
    fs.appendFileSync(RESULT_FILE, `"${eventLabel}","${timestamp}","${browserName}",${duration},"${disableThirdPartyScripts ? "No" : "Yes"}"\n`);
}

export const getFastStateFromPage = async (page) => await page.evaluate(() => window.reduxStore.getState().analytics.fast);
export const ensureFastIsFinishedOnPage = async (page) => {
    await page.waitForFunction(() => window.reduxStore.getState().analytics.fast.state === "finished");
    await page.waitForTimeout(10); // give it a little more time to make sure it's done
}