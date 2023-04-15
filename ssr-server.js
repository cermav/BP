require("dotenv").config();

const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

// console.log(PORT);

app.prepare()
    .then(() => {
        const server = express();

        server.get("/veterinari/", (req, res) => {
            res.set("location", "/vets");
            res.status(301).send();
        });
        server.get("/o-dr-mousovi/", (req, res) => {
            res.set("location", "/about");
            res.status(301).send();
        });
        server.get("/o-nas/", (req, res) => {
            res.set("location", "/about");
            res.status(301).send();
        });
        server.get("new/*", (req, res) => {
            res.set("location", "/");
            res.status(301).send();
        });

        server.get("/clanky/*", (req, res) => {
            res.set("location", "/blog");
            res.status(301).send();
        });
        server.get("/posts*", (req, res) => {
            res.set("location", "/blog");
            res.status(301).send();
        });
        server.get("/tag*", (req, res) => {
            res.set("location", "/blog");
            res.status(301).send();
        });
        server.get("/category*", (req, res) => {
            res.set("location", "/blog");
            res.status(301).send();
        });
        server.get("/barevne-mutace-v-chovu-hadu/", (req, res) => {
            res.set("location", "/blog");
            res.status(301).send();
        });
        server.get("/neco-o-vnitrnich-parazitech/", (req, res) => {
            res.set("location", "/blog");
            res.status(301).send();
        });
        server.get("/kocky-a-syrova-strava/", (req, res) => {
            res.set("location", "/blog");
            res.status(301).send();
        });
        server.get("/zajimave-rasy-kocek/", (req, res) => {
            res.set("location", "/blog");
            res.status(301).send();
        });
        server.get("/analni-zlazky/", (req, res) => {
            res.set("location", "/blog");
            res.status(301).send();
        });
        server.get("/krevni-testy/", (req, res) => {
            res.set("location", "/blog");
            res.status(301).send();
        });

        server.get("*", (req, res) => {
            return handle(req, res);
        });
        /*
        server.get("*", function(req, res) {
            res.status(404).send("what???");
        }); */

        server.listen(PORT, err => {
            if (err) throw err;
            console.log(`> Ready on http://localhost:${PORT}`);
        });
    })
    .catch(ex => {
        console.error(ex.stack);
        process.exit(1);
    });
