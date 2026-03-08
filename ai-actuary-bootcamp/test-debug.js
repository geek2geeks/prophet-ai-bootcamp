async function main() {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:3000");
  const headings = await page.$$eval("h1", (elements) =>
    elements.map((element) => element.textContent),
  );
  console.log("H1s:", headings);
  await browser.close();
}

void main();
