import { Mail } from "../../lib";
import { readFileSync } from "fs";

const sample1_path = "./test/data/sample1.html";
const sample1 = readFileSync(sample1_path);
const sample1_min_path = "./test/data/sample1.min.html";
const sample1_min = readFileSync(sample1_min_path);

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
