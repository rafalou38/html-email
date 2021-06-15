import { Mail } from "../../../lib";
import { readFileSync } from "fs";

const sample1_path = "./test/data/sample1.html";
const sample1 = readFileSync(sample1_path);

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
