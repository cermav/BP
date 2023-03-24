import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const Metas = ({ title, description, keywords, image }) => {
  const router = useRouter();
  // console.log(router.asPath);
  return (
    <Head>
      <title key="title">{title ? title : "Dr.Mouse - Snadná cesta k veterináři"}</title>
      <meta property="og:title" key="ogTitle" content={title ? title : "Dr.Mouse - Snadná cesta k veterináři"} />
      <meta
        name="description"
        lang="cs"
        content={
          description
            ? description
            : "Dr. Mouse je webová a mobilní aplikace, díky které zjistíte adresy, otevírací hodiny a hodnocení všech veterinářů v ČR."
        }
        key="description"
      />
      <meta
        property="og:description"
        content={
          description
            ? description
            : "Dr. Mouse je webová a mobilní aplikace, díky které zjistíte adresy, otevírací hodiny a hodnocení všech veterinářů v ČR."
        }
        key="ogDescription"
      />
      <meta
        name="keywords"
        lang="cs"
        content={keywords ? keywords : "domácí mazlíčci, zvířata, péče, veterinární služba, psí lékařství, veterináři"}
        key="keywords"
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={"https://www.drmouse.cz" + router.asPath} />
      <meta property="og:image" content={image ? image : "https://www.drmouse.cz/images/og-image.png"} />
      <meta property="og:site_name" content="Dr.Mouse.cz" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />
      <link rel="stylesheet" href="/index.css" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
    </Head>
  );
};
export default Metas;
