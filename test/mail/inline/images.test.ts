import { Mail } from "../../../lib";
import { readFileSync } from "fs";

it("inline from url", () => {
  new Mail(`
		<img src="https://github.com/rafalou38/html-email/raw/main/test/data/baboon.png"/>
	`)
    .inlineImages()
    .minimize()
    .generate()
    .then((e) => {
      expect(e).toBe(readFileSync("./test/data/baboon.html").toString());
    });
});
it("inline from file", () => {
  new Mail(`
		<img src="./test/data/baboon.html"/>
	`)
    .inlineImages()
    .minimize()
    .generate()
    .then((e) => {
      expect(e).toBe(readFileSync("./test/data/baboon.html").toString());
    });
});
