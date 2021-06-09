import { Mail } from "../lib";
import { readFileSync } from "fs";

const sample1_path = "./test/data/sample1.html";
const sample1 = readFileSync(sample1_path);
const sample1_min_path = "./test/data/sample1.min.html";
const sample1_min = readFileSync(sample1_min_path);

describe("Mail", () => {
describe("Load html", () => {
  it("should be able to read Html from a path", () => {
    expect(new Mail(sample1_path).generate()).toBe(sample1.toString());
  });
  it("should be able to read Html from text", () => {
    expect(new Mail(sample1.toString()).generate()).toBe(sample1.toString());
  });
  it("should be able to read Html from a buffer", () => {
    expect(new Mail(sample1).generate()).toBe(sample1.toString());
  });
});

describe("minify", () => {
  it("should return a Mail object", () => {
    expect(new Mail(sample1).minimize().constructor).toBe(Mail);
  });
  it("should minify", () => {
    expect(new Mail(sample1).minimize().generate()).toBe(
      sample1_min.toString()
    );
  });
  it("should be configurable", () => {
    expect(
      new Mail(
        `
				<p>
					p
				</p>
			`
      )
        .minimize({
          collapseWhitespace: false,
        })
        .generate()
    ).toBe(
      `
				<p>
					p
				</p>
			`
    );
  });
});
