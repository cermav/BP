// import "expect-puppeteer";
require("dotenv").config();
describe("myPet", () => {
  beforeAll(async () => {});
  const delay = 10;
  // const debug = false;
  const baseUrl = "https://drmouse.dev.code8.link"; // "http://localhost:3000";

  it("should show teaser when logged out", async () => {
    await page.goto(baseUrl + "/moje-zver", {
      waitUntil: "networkidle2",
    });
    if ((await page.$("#consentPopup")) !== null) {
      await page.click(".close");
    }
    const pageContent = await page.content();
    const teaser = pageContent.indexOf("Moje zvěř") > -1;
  });
  it("should login && end in pet-create after login", async () => {
    await page.goto(baseUrl, {
      waitUntil: "networkidle2",
    });
    await page.waitForTimeout(500);
    await page.evaluate(() => document.querySelector("#myPets").click());
    await page.waitForTimeout(500);
    await page.waitForTimeout(500);
    await page.waitForTimeout(500);
    await page.waitForTimeout(500);
    await page.waitForTimeout(500);
    await page.waitForTimeout(500);
    await page.click("#heroButton");
    await page.waitForTimeout(500);
    await page.waitForTimeout(500);
    await page.waitForTimeout(500);
    await page.waitForTimeout(500);
    await page.type("#vetEmail", "vitek@code8.cz");
    await page.type("#vetPassword", "hesloo");
    await page.click("#vetLogin");
    await page.waitForTimeout(1000);
    await page.goto(baseUrl + "/moje-zver/vytvorit", {
      waitUntil: "networkidle2",
    });
    const petCreate = page.url() === baseUrl + "/moje-zver/vytvorit";
    await expect(petCreate).toBe(true);
  });
  it("should be able to create new pet", async () => {
    //pet to be created
    const pet = {
      name: "Karel",
      kind: "Pes",
      gender: "Samec",
      breed: "Akita",
      birthDate: "10012011",
      birth_date: "10. 1. 2011",
    };

    await page.goto(baseUrl + "/moje-zver/vytvorit", {
      waitUntil: "networkidle2",
    });
    const petCreate = page.url() === `${baseUrl}/moje-zver/vytvorit`;
    if (!petCreate) {
      await page.type("#vetEmail", "vitek@code8.cz");
      await page.type("#vetPassword", "hesloo");
      await page.click("#vetLogin", {
        waitUntil: "networkidle0",
      });
      await page.waitForNavigation();
      await page.goto(baseUrl + "/moje-zver/vytvorit");
    }

    //create pet
    await page.type("#pet_name", pet.name);
    await page.click("#submit");
    await page.click(`#${pet.kind}`);
    await page.click(`#${pet.gender}`);
    await page.click(`#${pet.gender}`); //for some reason, one click only points at the span
    await page.click("#submit");
    //await page.waitForTimeout(500);
    await page.click(`#${pet.breed.charAt(0)}`);
    await page.waitForTimeout(100);
    await page.click(`#${pet.breed}`);
    await page.click("#submit");
    //await page.waitForTimeout(500);
    await page.type("#birth_date", pet.birthDate);
    //await page.waitForTimeout(500);
    await page.click("#submit");
    //await page.waitForTimeout(500);

    //check progress spans
    await page.click("#submit");
    //await page.waitForTimeout(3000);

    //pet created correctly ?
    const content = await page.content();
    const name = content.indexOf(pet.name) > -1;
    const kind = content.indexOf(pet.kind) > -1;
    const gender = content.indexOf(pet.gender) > -1;
    const breed = content.indexOf(pet.breed) > -1;
    const birthDate = content.indexOf(pet.birth_date) > -1;
    expect(name && kind).toBe(true);
    expect(gender && breed && birthDate).toBe(true);
  });
  it("should be able to create, update and delete appointment", async () => {
    const term = {
      date: "10012021",
      description: "Test",
    };
    await page.goto(baseUrl + "/moje-zver/zvire", {
      waitUntil: "networkidle0",
    });
    //await page.waitForTimeout(500);
    const loggedOut = page.url() === baseUrl + "/login";
    if (loggedOut) {
      await page.type("#vetEmail", "vitek@code8.cz");
      await page.type("#vetPassword", "hesloo");
      await page.click("#vetLogin", {
        waitUntil: "networkidle0",
      });
      await page.waitForNavigation();
      await page.goto(baseUrl + "/moje-zver/zvire", {
        waitUntil: "networkidle0",
      });
      //await page.waitForTimeout(500);
    }
    if ((await page.$("#consentPopup")) !== null) {
      await page.click(".close");
    }
    //create
    await page.click("#addTerm", {
      waitUntil: "networkidle2",
    });
    //await page.waitForTimeout(500);
    await page.type("#description", term.description);
    await page.type(".modal-date", term.date);
    await page.click("#submit");
    await page.waitForTimeout(1500);
    //open All terms
    await page.click("#allTerms", {
      waitUntil: "networkidle2",
    });
    await page.waitForTimeout(500);
    //edit
    await page.click(`#edit${term.description}`);
    await page.click("#description");
    for (let i = 0; i < term.description.length; i++) await page.keyboard.press("Backspace");
    term.description = "test2";
    await page.type("#description", term.description);
    await page.type(".modal-date", "22041997");
    await page.click("#submit", {
      waitUntil: "networkidle2",
    });
    await page.waitForTimeout(1000);
    //delete
    await page.click(`#delete${term.description}`);
    await page.click("#confirm", {
      waitUntil: "networkidle2",
    });
    await page.waitForTimeout(500);
    //deleted?
    const content = await page.content();
    const exist = content.indexOf(term.description) > -1;
    await expect(exist).toBe(false);
  });
  it("should be able to update pet", async () => {
    await page.goto(baseUrl + "/moje-zver/zvire");
    await page.waitForTimeout(1500);
    if (page.url() === baseUrl + "/moje-zver/zvire/[object%20Object]")
      page.goto(baseUrl + "/moje-zver/zvire/1", {
        waitUntil: "networkidle2",
      });
    const loggedOut = page.url() === baseUrl + "/login";
    if (loggedOut) {
      if ((await page.$("#consentPopup")) !== null) {
        await page.click(".close");
      }
      await page.goto(baseUrl + "/login", {
        waitUntil: "networkidle2",
      });
      await page.type("#vetEmail", "vitek@code8.cz");
      await page.type("#vetPassword", "hesloo");
      await page.click("#vetLogin", {
        waitUntil: "networkidle2",
      });
      await page.waitForTimeout(1500);
      await page.goto(baseUrl + "/moje-zver/zvire", {
        waitUntil: "networkidle2",
      });
    }
    await page.waitForTimeout(1500);
    await page.click("#petUpdate", {
      waitUntil: "networkidle2",
    });

    const pet = {
      name: "Barak",
      kind: "Pes",
      gender: "Samec",
      breed: "Beagle",
      birthDate: "10012011",
      // mind the result j. n. Y format
      birth_date: "10. 1. 2011",
    };

    await page.click("#pet_name");
    for (let i = 0; i < pet.name.length; i++) await page.keyboard.press("Backspace");
    for (let i = 0; i < pet.name.length; i++) await page.keyboard.press("Delete");
    await page.type("#pet_name", pet.name);
    await page.click("#submit");
    await page.click(`#${pet.kind}`);
    await page.click(`#${pet.gender}`);
    await page.click(`#${pet.gender}`); //for some reason, one click only points at the span
    await page.click("#submit");
    //await page.waitForTimeout(500);
    await page.click(`#${pet.breed.charAt(0)}`);
    //await page.waitForTimeout(500);
    await page.click(`#${pet.breed}`);
    await page.click("#submit");
    //await page.waitForTimeout(500);
    await page.click("#birth_date");
    for (let i = 0; i < pet.birthDate.length; i++) await page.keyboard.press("ArrowRight");
    for (let i = 0; i < pet.birthDate.length; i++) await page.keyboard.press("Backspace");
    for (let i = 0; i < pet.name.length; i++) await page.keyboard.press("Delete");
    await page.keyboard.press("ArrowLeft");
    for (let i = 0; i < pet.birthDate.length; i++) await page.keyboard.press("Backspace");
    for (let i = 0; i < pet.name.length; i++) await page.keyboard.press("Delete");
    await page.keyboard.press("ArrowLeft");
    for (let i = 0; i < pet.birthDate.length; i++) await page.keyboard.press("Backspace");
    for (let i = 0; i < pet.name.length; i++) await page.keyboard.press("Delete");
    await page.type("#birth_date", pet.birthDate);
    //await page.waitForTimeout(500);
    await page.click("#submit");
    //await page.waitForTimeout(500);
    await page.click("#submit", {
      waitUntil: "networkidle2",
    });
    await page.waitForTimeout(500);

    const content = await page.content();
    const name = content.indexOf(pet.name) > -1;
    const kind = content.indexOf(pet.kind) > -1;
    const gender = content.indexOf(pet.gender) > -1;
    const breed = content.indexOf(pet.breed) > -1;
    const birthDate = content.indexOf(pet.birth_date) > -1;
    await expect(name && kind).toBe(true);
    await expect(gender && breed && birthDate).toBe(true);
  });
  it("should be able to delete pet", async () => {
    await page.goto(baseUrl + "/moje-zver/zvire", {
      waitUntil: "networkidle2",
    });
    await page.waitForTimeout(500);
    if (page.url() === baseUrl + "/moje-zver/zvire/[object%20Object]") page.goto(baseUrl + "/moje-zver/zvire/1");
    const loggedOut = page.url() === baseUrl + "/login";
    if (loggedOut) {
      await page.goto(baseUrl + "/login", {
        waitUntil: "networkidle2",
      });
      await page.type("#vetEmail", "vitek@code8.cz");
      await page.type("#vetPassword", "hesloo");
      await page.click("#vetLogin", {
        waitUntil: "networkidle2",
      });
      await page.waitForTimeout(500);
    }
    await page.goto(baseUrl + "/moje-zver/zvire", {
      waitUntil: "networkidle2",
    });
    await page.waitForTimeout(1000);
    const initialUrl = await page.url();
    //delete
    await page.click("#petUpdate", {
      waitUntil: "networkidle2",
    });
    //await page.waitForTimeout(500);
    await page.click("#deletePet");
    //await page.waitForTimeout(500);
    await page.click("#confirm");
    await page.waitForTimeout(1000);
    const newUrl = await page.url();
    await expect(initialUrl === newUrl).toBe(false);
  });
  it("should be able to add favorite doctor and then delete it", async () => {
    await page.goto(baseUrl + "/moje-zver/zvire", {
      waitUntil: "networkidle2",
    });
    if (page.url() === baseUrl + "/moje-zver/zvire/[object%20Object]") page.goto(baseUrl + "/moje-zver/zvire/1");
    const loggedOut = page.url() === baseUrl + "/login";
    if (loggedOut) {
      await page.goto(baseUrl + "/login", {
        waitUntil: "networkidle2",
      });
      await page.type("#vetEmail", "vitek@code8.cz");
      await page.type("#vetPassword", "hesloo");
      await page.click("#vetLogin", {
        waitUntil: "networkidle2",
      });
      await page.waitForNavigation();
    }
    await page.goto(baseUrl + "/moje-zver/zvire/1", {
      waitUntil: "networkidle2",
    });

    if ((await page.$("#consentPopup")) !== null) {
      await page.click(".close");
    }

    /*
     * Zacatek testu *
     */
    await page.click("#addVet", {
      waitUntil: "networkidle2",
    });
    await page.waitForTimeout(1000);
    await page.click("#autoComplete");
    const vetName = "Písek";
    await page.type("#autoComplete", vetName);
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(500);

    await page.click("#submit");
    await page.click("#submit");

    await page.waitForTimeout(1000);
    const content = await page.content();
    await page.waitForTimeout(1000);
    const exist = content.indexOf(vetName) > -1;
    await expect(exist).toBe(true);

    await page.click("#editVets");
    await page.waitForTimeout(500);
    await page.click("#removeVet");
    await page.waitForTimeout(1000);

    const content2 = await page.content();
    const exist2 = content2.indexOf(vetName) > -1;
    await expect(exist2).toBe(false);

    // const rendered = await page.$(".vetMeta");
    //console.log(rendered);
    //await expect(page.$(".vetMeta").length.toBeGreaterThan(0));
  });
  it("Should be able to create, update and delete vaccine", async () => {
    /*
    login
    click vaccines
    waitfor navigation

    click add vaccine
    try blank submit
    fill form
    submit

    evaluate if created

    click update
    try erase and submit
    change values
    unselect vet
    submit

    evaluate if changed
    
    */
  });
  it("Should be able to create, update and delete record", async () => {
    /*
    login
    click records
    click add record
    try empty submit
    evaluate error
    fill form
    submit
    evaluate if created
    */

    //login
    await page.goto(baseUrl + "/moje-zver/zvire", {
      waitUntil: "networkidle2",
    });
    await page.waitForTimeout(500);
    if (page.url() === baseUrl + "/moje-zver/zvire/[object%20Object]") page.goto(baseUrl + "/moje-zver/zvire/1");
    const loggedOut = page.url() === baseUrl + "/login";
    if (loggedOut) {
      await page.goto(baseUrl + "/login", {
        waitUntil: "networkidle2",
      });
      await page.type("#vetEmail", "vitek@code8.cz");
      await page.type("#vetPassword", "hesloo");
      await page.click("#vetLogin", {
        waitUntil: "networkidle2",
      });
      await page.waitForTimeout(1000);
    }
    await page.goto(baseUrl + "/moje-zver/zvire/1", {
      waitUntil: "networkidle2",
    });
    await page.waitForTimeout(1000);

    if ((await page.$("#consentPopup")) !== null) {
      await page.click(".close");
    }
    await page.waitForTimeout(500);

    await page.click("#records", {
      waitUntil: "networkidle2",
    });
    //await page.waitForNavigation();

    await page.click("#createRecord");
    await page.waitForTimeout(10000);
  });
  it("Should be able to create, update and delete record", async () => {
    /*
    login
    click records
    waitfor navigation
    &&
    click add record
    try empty submit
    evaluate error
    fill form
    submit
    evaluate if created
    
    click delete
    evaluate delete

    click add
    fill form
    add single file
    add multiple files
    rename three files
    remove one default-name and one custom-name file
    submit

    evaluate uploaded files and their names

    click add
    try adding invalid file type
    expect error

    add file
    try rename with invalid chars
    expect error

    edit record with files
    upload file
    rename both saved and new file
    evaluate file names

    delete all
    
    */
  });
});
