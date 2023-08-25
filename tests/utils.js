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

export const thirdPartyABTester = () => {
    const isDisabled = process.env.AB_TEST_THIRD_PARTY === "true" ? Math.random() < 0.5 : false;

    return {
        isDisabled,
        handler: isDisabled
            ? ((route) => {
                const { hostname } = new URL(route.request().url());

                if (blacklist.includes(hostname)) {
                    return route.abort();
                }
            })
            : (route) => route.continue()
    }
}

/**
 * 
 * @param {{ timestamp: string, browserName: string, duration: number, areThirdPartyScriptsDisabled: boolean }} param
 */
export const logEvent = ({ timestamp, browserName, duration, areThirdPartyScriptsDisabled: disableThirdPartyScripts }) => {
    const RESULT_FILE = path.join(__dirname, "..", "results.csv");
    fs.ensureFileSync(RESULT_FILE);
    fs.appendFileSync(RESULT_FILE, `${timestamp},${browserName},${duration},"${disableThirdPartyScripts ? "Disabled" : "Enabled"} 3rd party scripts"\n`);
}

export const getFastStateFromPage = async (page) => await page.evaluate(() => window.reduxStore.getState().analytics.fast);
export const ensureFastIsFinishedOnPage = async (page) => {
    await page.waitForFunction(() => window.reduxStore.getState().analytics.fast.state === "finished");
    await page.waitForTimeout(10); // give it a little more time to make sure it's done
}