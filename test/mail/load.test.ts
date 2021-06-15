import { Mail } from "../../lib";
import { readFileSync } from "fs";

const sample1_path = "./test/data/sample1.html";
const sample1 = readFileSync(sample1_path);

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
