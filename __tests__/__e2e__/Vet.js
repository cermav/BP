// import "expect-puppeteer";
require("dotenv").config();
describe("Vet", () => {
  const delay = 50;
  // const debug = false;
  const baseUrl = process.env.TEST_URL ? process.env.TEST_URL : "https:///www.drmouse.cz"; // "http://localhost:3000";

  it("should be able to login", async () => {
    await page.goto(baseUrl + "/login", {
      waitUntil: "networkidle2",
    });
    await page.type("#vetEmail", "carlos@vacak.cz");
    await page.type("#vetPassword", "Veslo2010");
    await page.click("#vetLogin");

    await page.waitForNavigation();
    const pageContent = await page.content();
    const exists = pageContent.indexOf("Můj profil") > -1;

    await page.waitFor(delay);
    await expect(exists).toBe(true);
  });
  it("should be able to logout", async () => {
    await page.goto(baseUrl + "/", {
      waitUntil: "networkidle2",
    });
    await page.click("#logout2");

    await page.waitForNavigation();
    const pageContent = await page.content();
    const exists = pageContent.indexOf("Přihlášení") > -1;

    await page.waitFor(delay);
    await expect(exists).toBe(true);
  });
});
