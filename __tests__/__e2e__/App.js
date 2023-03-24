// import "expect-puppeteer";
require("dotenv").config();
describe("App", () => {
  beforeEach(async () => {
    await jestPuppeteer.resetBrowser();
  });
  const delay = 10;
  const debug = false;
  const baseUrl = process.env.TEST_URL ? process.env.TEST_URL : "https:///www.drmouse.cz"; // "http://localhost:3000";
  console.log("baseUrl: ", baseUrl);

  it("should render navigation", async () => {
    await page.goto(baseUrl + "", {
      waitUntil: "networkidle2",
    });
    const rows = await page.$$("#menu li");
    if (debug) console.log("Number of items in navigation:", rows.length);
    if (debug) await page.waitFor(delay);
    await expect(rows.length).toBeGreaterThan(3);
  });

  it("should display at least 10 vets", async () => {
    await page.goto(baseUrl + "/vets", {
      waitUntil: "networkidle2",
    });
    const rows = await page.$$(".vetMeta");
    if (debug) console.log("Number of vets: ", rows.length);
    if (debug) await page.waitFor(delay);
    await expect(rows.length).toBeGreaterThan(3);
  });
  it("should display at least 10 blog posts", async () => {
    await page.goto(baseUrl + "/blog", {
      waitUntil: "networkidle2",
    });
    const rows = await page.$$(".postTeasersItem");
    if (debug) console.log("Number of blog posts: ", rows.length);
    if (debug) await page.waitFor(delay);
    await expect(rows.length).toBeGreaterThan(3);
  });
  it("should display at least 10 answers", async () => {
    await page.goto(baseUrl + "/poradna", {
      waitUntil: "networkidle2",
    });
    const rows = await page.$$(".consultItem");
    if (debug) console.log("Number of poradna: ", rows.length);
    if (debug) await page.waitFor(delay);
    await expect(rows.length).toBeGreaterThan(10);
  });

  it("should filter FAQs", async () => {
    await page.goto(baseUrl + "/poradna", {
      waitUntil: "networkidle2",
    });
    const tags = await page.$$(".tags .tag");
    if (debug) console.log("Number of filters in consult section:", tags.length);
    if (debug) await page.waitFor(delay);

    const filterText = await page.$eval(".tags .tag", (e) => e.innerText);
    if (debug) console.log(filterText);
    await tags[0].click();
    const filteredText = await page.$eval(".nonClickable", (e) => e.innerText);
    if (debug) console.log(filteredText);
    const matchesCorrectly = filterText === filteredText;
    await expect(matchesCorrectly).toBe(true);
  });

  it("should behave responsively", async () => {
    await page.setViewport({ width: 320, height: 600 });
    await page.goto(baseUrl + "/blog", {
      waitUntil: "networkidle2",
    });
    // await page.click(".hamburger");
    const hamburgerVisible = await page.waitForSelector(".hamburger", {
      visible: true,
    });
    if (debug) await page.waitFor(delay);
    await expect(hamburgerVisible).toBeTruthy();
  });

  it("shouldn't throw errors", async () => {
    await page.setViewport({ width: 800, height: 600 });
    await page.goto(baseUrl + "/poradna", {
      waitUntil: "networkidle2",
    });
    let errors = [];
    page.on("error", (err) => {
      if (debug) console.log("error: ", err);
      errors.push(err);
    });
    page.on("pageerror", (err) => {
      if (debug) console.log("pageerror: ", err);
      errors.push(err);
    });
    if (debug) console.log(errors);
    if (debug) await page.waitFor(delay);
    await expect(errors.length).toBe(0);
  });
  it("shouldn't throw errors", async () => {
    await page.setViewport({ width: 800, height: 600 });
    await page.goto(baseUrl + "/my", {
      waitUntil: "networkidle2",
    });
    let errors = [];
    page.on("error", (err) => {
      if (debug) console.log("error: ", err);
      errors.push(err);
    });
    page.on("pageerror", (err) => {
      if (debug) console.log("pageerror: ", err);
      errors.push(err);
    });
    if (debug) console.log(errors);
    if (debug) await page.waitFor(delay);
    await expect(errors.length).toBe(0);
  });
  it("shouldn't throw errors", async () => {
    await page.setViewport({ width: 800, height: 600 });
    await page.goto(baseUrl + "/moje-zver/zvire", {
      waitUntil: "networkidle2",
    });
    let errors = [];
    page.on("error", (err) => {
      if (debug) console.log("error: ", err);
      errors.push(err);
    });
    page.on("pageerror", (err) => {
      if (debug) console.log("pageerror: ", err);
      errors.push(err);
    });
    if (debug) console.log(errors);
    if (debug) await page.waitFor(delay);
    await expect(errors.length).toBe(0);
  });
});
