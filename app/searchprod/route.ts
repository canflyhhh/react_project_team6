import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

// async function crawlWebsite1(url: string): Promise<any[]> {
//   const browser = await puppeteer.launch({ headless: "new" });
//   const page = await browser.newPage();

//   try {
//     await page.goto(url);
//     const baseUrl = page.url();
//     const html = await page.content();
//     const $ = cheerio.load(html);

//     const products = $(".block.pointblock.item").map((index, element) => {
//       const title = $(element).find("h3 a").text();
//       const relativeUrl = $(element).find("h3 a").attr("href");
//       const absoluteUrl = relativeUrl ? new URL(relativeUrl, baseUrl).href : '';

//       const imageUrl = $(element).find("img").attr("src");
//       const absoluteImageUrl = imageUrl ? new URL(imageUrl, baseUrl).href : '';

//       return { title, url: absoluteUrl, imageUrl: absoluteImageUrl };
//     }).get();

//     return products;
//   } catch (error: any) {
//     console.error(`An error occurred while crawling ${url}: ${error.message}`);
//     return [];
//   } finally {
//     await browser.close();
//   }
// }

async function crawlWebsite2(url: string): Promise<any[]> {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    await page.goto(url);
    const baseUrl = page.url();
    const html = await page.content();
    const $ = cheerio.load(html);

    const products = $(".wsite-section-elements").map((index, element) => {
      const title = $(element).find(".wsite-multicol-col h2.wsite-content-title font[size='6']").text();
      const relativeUrl = $(element).find("td a.wsite-button").attr("href");
      const absoluteUrl = relativeUrl ? new URL(relativeUrl, baseUrl).href : '';

      const imageUrl = $(element).find("td img").attr("src");
      const absoluteImageUrl = imageUrl ? new URL(imageUrl, baseUrl).href : '';

      return { title, url: absoluteUrl, imageUrl: absoluteImageUrl };
    }).get();

    return products;
  } catch (error: any) {
    console.error(`An error occurred while crawling ${url}: ${error.message}`);
    return [];
  } finally {
    await browser.close();
  }
}

export async function POST(request: Request) {
  const { searchPrompt: userSearch } = await request.json();

  let browser;

  function delay(time: number) {
    return new Promise(function (resolve) {
      setTimeout(() => resolve(true), time);
    });
  }

  try {
    browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    // await page.goto("https://www.fju.edu.tw/");

    // Get the base URL
    // const baseUrl = page.url();
    const html = await page.content();
    const $ = cheerio.load(html);

    // const website1Products = await crawlWebsite1(baseUrl);
    const website2Products = await crawlWebsite2("https://newfjnews.weebly.com/");

    // Slice the array to get only the first 9 products from each website
    const slicedProducts = [
      // ...website1Products.slice(0, 6),
      ...website2Products.slice(1, 7)
    ];

    return NextResponse.json({ products: slicedProducts });
  } catch (error: any) {
    return NextResponse.json(
      { error: `An error occurred: ${error.message}` },
      { status: 200 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
