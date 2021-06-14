import { Mail } from "../lib";
import { readFileSync } from "fs";

const sample1_path = "./test/data/sample1.html";
const sample1 = readFileSync(sample1_path);
const sample1_min_path = "./test/data/sample1.min.html";
const sample1_min = readFileSync(sample1_min_path);

describe("Load html", () => {
  it("should be able to read Html from a path", async () => {
    const html = await new Mail(sample1_path).generate();
    expect(html).toBe(sample1.toString());
  });
  it("should be able to read Html from text", async () => {
    const html = await new Mail(sample1.toString()).generate();
    expect(html).toBe(sample1.toString());
  });
  it("should be able to read Html from a buffer", async () => {
    const html = await new Mail(sample1).generate();
    expect(html).toBe(sample1.toString());
  });
});

describe("minify", () => {
  it("should return a Mail object", () => {
    expect(new Mail(sample1).minimize().constructor).toBe(Mail);
  });
  it("should minify", async () => {
    const html = await new Mail(sample1).minimize().generate();
    expect(html).toBe(sample1_min.toString());
  });
  it("should be configurable", async () => {
    const html = await new Mail(
      `
				<p>
					p
				</p>
			`
    )
      .minimize({
        collapseWhitespace: false,
      })
      .generate();
    expect(html).toBe(
      `
				<p>
					p
				</p>
			`
    );
  });
});
describe("inline css", () => {
  it("should return a Mail object", () => {
    expect(new Mail(sample1).inlineCSS().constructor).toBe(Mail);
  });
  it("should inline", async () => {
    const html = await new Mail(`
		<p>Hello</p>

		<style>
			p{
				color: #fff;
				background-color: #aaa;
			}
			p::before{
				position: absolute;
			}
		</style>
		`)
      .inlineCSS()
      .minimize()
      .generate();
    expect(html).toBe(
      `<p style="background-color: #aaa; color: #fff;">Hello</p>`
    );
  });
  it("add css", async () => {
    const html = await new Mail(
      `
					<p>Hello</p>
				`
    )
      .addCSS(
        `
						p{
							color: #fff;
							background-color: #aaa;
						}
					`
      )
      .addCSS(
        `
						p{
							width: 10px;
						}
					`
      )
      .addCSS("./test/data/style.css")
      .inlineCSS()
      .minimize()
      .generate();
    expect(html).toBe(
      `<p style="background-color: #aaa; color: #fff; display: block; width: 10px;">Hello</p>`
    );
  });
});
