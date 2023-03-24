// import "expect-puppeteer";
require("dotenv").config();
describe("Admin", () => {
  const delay = 50;
  // const debug = false;
  const baseUrl = process.env.TEST_URL ? process.env.TEST_URL : "https:///www.drmouse.cz"; // "http://localhost:3000";

  it("should be able to login", async () => {
    await page.goto(baseUrl + "/login", {
      waitUntil: "networkidle2",
    });
    await page.type("#vetEmail", "burt@code8.cz");
    await page.type("#vetPassword", "burten");
    await page.click("#vetLogin");

    await page.waitForNavigation();
    const pageContent = await page.content();
    const exists = pageContent.indexOf("Veterináři") > -1;

    await page.waitFor(delay);
    await expect(exists).toBe(true);
  });
  it("should be able to logout", async () => {
    await page.goto(baseUrl + "/login", {
      waitUntil: "networkidle2",
    });

    if ((await page.$("#consentPopup")) !== null) {
      await page.click(".close");
    }
    await page.click("#menuToggle");
    await page.click("#userMenu");
    await page.click("#logout");
    await page.waitForTimeout(delay);

    const pageContent = await page.content();
    const exists = pageContent.indexOf("Přihlášení") > -1;

    await expect(exists).toBe(true);
  });
});
