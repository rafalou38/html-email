import { Mail } from "../lib";
import { readFileSync } from "fs";

const sample1_path = "./test/data/sample1.html";
const sample1 = readFileSync(sample1_path);

describe("Mail", () => {
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
