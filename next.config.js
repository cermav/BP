require("dotenv").config();
const API_URL = process.env.API_URL || "https://api.drmouse.code8.link/api/";
const STORAGE_URL = process.env.STORAGE_URL || "https://api.drmouse.code8.link/storage";
const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID || "1020802082701-snpg5g9rkrgs6nnln90f6g79nh3t3tj1.apps.googleusercontent.com";
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || "503390981088653";

const withCSS = require("@zeit/next-css");
const withImages = require("next-images");

// Use the hidden-source-map option when you don't want the source maps to be
// publicly available on the servers, only to the error reporting
const withSourceMaps = require("@zeit/next-source-maps")();

// Use the SentryWebpack plugin to upload the source maps during build step
const SentryWebpackPlugin = require("@sentry/webpack-plugin");
const {
  NEXT_PUBLIC_SENTRY_DSN: SENTRY_DSN,
  SENTRY_ORG,
  SENTRY_PROJECT,
  SENTRY_AUTH_TOKEN,
  NODE_ENV,
  VERCEL_GITHUB_COMMIT_SHA,
  VERCEL_GITLAB_COMMIT_SHA,
  VERCEL_BITBUCKET_COMMIT_SHA,
} = process.env;

const COMMIT_SHA = VERCEL_GITHUB_COMMIT_SHA || VERCEL_GITLAB_COMMIT_SHA || VERCEL_BITBUCKET_COMMIT_SHA;

process.env.SENTRY_DSN = SENTRY_DSN;
const basePath = "";

module.exports = withImages(
  withCSS(
    withSourceMaps({
      cssLoaderOptions: {
        cssModules: true,
      },
      env: {
        apiURL: API_URL,
        storageUrl: STORAGE_URL,
        googleAppId: GOOGLE_CLIENT_ID,
        FacebookAppId: FACEBOOK_APP_ID,
        //            sentryDSN: "https://d3c4e7b0dbf34defae93f1e1e36446df@o463714.ingest.sentry.io/5469160",
        mapBoxAccessToken: "pk.eyJ1IjoiY29kZTgiLCJhIjoiY2p1eTRoNnFjMGZzNDQzcGdtOG40Z2ZpdSJ9.88MlcA9PvsL90Ii21XVkcw",
        mapBoxStyle: "mapbox://styles/code8/cjyu35fb904zq1cn4dqhoy1q6",
        blogProxyApi: "https://directus.code8.link/drmouse/",
      },
      serverRuntimeConfig: {
        rootDir: __dirname,
      },
      webpack: (config, options) => {
        // In `pages/_app.js`, Sentry is imported from @sentry/browser. While
        // @sentry/node will run in a Node.js environment. @sentry/node will use
        // Node.js-only APIs to catch even more unhandled exceptions.
        //
        // This works well when Next.js is SSRing your page on a server with
        // Node.js, but it is not what we want when your client-side bundle is being
        // executed by a browser.
        //
        // Luckily, Next.js will call this webpack function twice, once for the
        // server and once for the client. Read more:
        // https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config
        //
        // So ask Webpack to replace @sentry/node imports with @sentry/browser when
        // building the browser's bundle
        if (!options.isServer) {
          config.resolve.alias["@sentry/node"] = "@sentry/browser";
        }

        // When all the Sentry configuration env variables are available/configured
        // The Sentry webpack plugin gets pushed to the webpack plugins to build
        // and upload the source maps to sentry.
        // This is an alternative to manually uploading the source maps
        // Note: This is disabled in development mode.
        if (
          SENTRY_DSN &&
          SENTRY_ORG &&
          SENTRY_PROJECT &&
          SENTRY_AUTH_TOKEN &&
          COMMIT_SHA &&
          NODE_ENV === "production"
        ) {
          config.plugins.push(
            new SentryWebpackPlugin({
              include: ".next",
              ignore: ["node_modules"],
              stripPrefix: ["webpack://_N_E/"],
              urlPrefix: `~${basePath}/_next`,
              release: COMMIT_SHA,
            })
          );
        }
        return config;
      },
      basePath,
      async redirects() {
        return [
          /*           {
            source: "/vets",
            destination: "/veterinari",
            permanent: true,
          }, */
          {
            source: "/consult",
            destination: "/poradna",
            permanent: true,
          },
          {
            source: "/my",
            destination: "/moje-zver",
            permanent: true,
          },
          {
            source: "/app",
            destination: "/aplikace",
            permanent: true,
          },
          {
            source: "/about",
            destination: "/o-nas",
            permanent: true,
          },
          {
            source: "/terms-of-use",
            destination: "/podminky-pouziti",
            permanent: true,
          },
          {
            source: "/privacy-policy",
            destination: "/zasady-ochrany-osobnich-udaju",
            permanent: true,
          },
          {
            source: "/blog/31",
            destination: "/blog/31_andulky-mila-domaci-zviratka",
            permanent: true,
          },
          {
            source: "/blog/30",
            destination: "/blog/30_demence-u-psu-jak-ji-poznat-a-lecit",
            permanent: true,
          },
          {
            source: "/blog/29",
            destination: "/blog/29_jak-krmit-ptactvo-v-zime",
            permanent: true,
          },
          {
            source: "/blog/28",
            destination: "/blog/28_agama-mazlicek-i-pro-zacinajici-chovatele",
            permanent: true,
          },
          {
            source: "/blog/27",
            destination: "/blog/27_pruvodce-kastraci-psa",
            permanent: true,
          },
          {
            source: "/blog/26",
            destination: "/blog/26_srdecni-cervi-u-psu-pozor-na-nebezpeci",
            permanent: true,
          },
          {
            source: "/blog/25",
            destination: "/blog/25_8-tipu-jak-predchazet-rakovine-u-psu",
            permanent: true,
          },
          {
            source: "/blog/24",
            destination: "/blog/24_axolotl-mexicky-vodni-dracek",
            permanent: true,
          },
          {
            source: "/blog/23",
            destination: "/blog/23_vse-o-cincilach",
            permanent: true,
          },
          {
            source: "/blog/22",
            destination: "/blog/22_nemoci-akvarijnich-ryb-1-cast",
            permanent: true,
          },
          {
            source: "/blog/21",
            destination: "/blog/21_jak-chovat-kralika",
            permanent: true,
          },
          {
            source: "/blog/20",
            destination: "/blog/20_nezachranujte-opustena-mladata",
            permanent: true,
          },
          {
            source: "/blog/19",
            destination: "/blog/19_prepravovani-kocek",
            permanent: true,
          },
          {
            source: "/blog/18",
            destination: "/blog/18_vyziva-akvarijnich-ryb",
            permanent: true,
          },
          {
            source: "/blog/17",
            destination: "/blog/17_chov-krecka-syrskeho",
            permanent: true,
          },
          {
            source: "/blog/16",
            destination: "/blog/16_vse-o-separacni-uzkosti",
            permanent: true,
          },
          {
            source: "/blog/15",
            destination: "/blog/15_jak-zabavit-kocku",
            permanent: true,
          },
          {
            source: "/blog/14",
            destination: "/blog/14_umrti-domaciho-mazlicka",
            permanent: true,
          },
          {
            source: "/blog/13",
            destination: "/blog/13_krmite-sveho-kralika-spravne",
            permanent: true,
          },
          {
            source: "/blog/12",
            destination: "/blog/12_nemoc-silenych-krav",
            permanent: true,
          },
          {
            source: "/blog/11",
            destination: "/blog/11_jakeho-papouska-si-vybrat",
            permanent: true,
          },
          {
            source: "/blog/10",
            destination: "/blog/10_neco-o-vnitrnich-parazitech",
            permanent: true,
          },
          {
            source: "/blog/9",
            destination: "/blog/9_jak-pecovat-o-drapky",
            permanent: true,
          },
          {
            source: "/blog/8",
            destination: "/blog/8_naucte-psa-aby-mel-rad-veterinare",
            permanent: true,
          },
          {
            source: "/blog/7",
            destination: "/blog/7_strasak-jmenem-panleukopenie",
            permanent: true,
          },
          {
            source: "/blog/6",
            destination: "/blog/6_muze-pes-kosti",
            permanent: true,
          },
          {
            source: "/blog/5",
            destination: "/blog/5_torze-zaludku-lze-ji-predejit",
            permanent: true,
          },
          {
            source: "/blog/4",
            destination: "/blog/4_psi-senior-jak-o-nej-pecovat",
            permanent: true,
          },
          {
            source: "/blog/2",
            destination: "/blog/2_kralici-zuby-pozor-na-prerustani",
            permanent: true,
          },
        ];
      },
    })
  )
);
