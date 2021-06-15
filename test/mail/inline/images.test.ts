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

it("not inline already inlined", () => {
  const inlined = `
	<img
			src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTBweCIgaGVpZ2h0PSIxMnB4IiB2aWV3Qm94PSIwIDAgMTAgMTIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQ0LjEgKDQxNDU1KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IlN5bWJvbHMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJCbG9jay9FeHRlbnNpb24vTGFyZ2UvTm9ybWFsIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNjExLjAwMDAwMCwgLTI3LjAwMDAwMCkiIGZpbGw9IiNBREI1QkQiPgogICAgICAgICAgICA8ZyBpZD0iSWNvbi9Vc2VyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MTAuMDAwMDAwLCAyNy4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJHcm91cC0yIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLjAwMDAwMCwgMC4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNi43MzA1LDcuMDExNSBDNi4yMTIsNy4zMTYgNS42MjksNy41IDUsNy41IEM0LjM3MSw3LjUgMy43ODgsNy4zMTYgMy4yNjk1LDcuMDExNSBDMS40NDcsNy4xMzEgMCw4LjY0OCAwLDEwLjUgTDAsMTEuMzY1IEwwLjM0NzUsMTEuNDc2NSBDMC40MTQ1LDExLjQ5NzUgMi4wMTksMTIgNSwxMiBDNy45ODEsMTIgOS41ODU1LDExLjQ5NzUgOS42NTI1LDExLjQ3NjUgTDEwLDExLjM2NSBMMTAsMTAuNSBDMTAsOC42NDggOC41NTMsNy4xMzEgNi43MzA1LDcuMDExNSBaIiBpZD0iU2hhcGUiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik01LDYuNSBDNi42ODk1LDYuNSA4LDQuNjE4NSA4LDMgQzgsMS4zNDU1IDYuNjU0NSwwIDUsMCBDMy4zNDU1LDAgMiwxLjM0NTUgMiwzIEMyLDQuNjE4NSAzLjMxMDUsNi41IDUsNi41IFoiIGlkPSJTaGFwZSIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo="
		/>
	`;
  new Mail(inlined)
    .inlineImages()
    .generate()
    .then((e) => {
      expect(e).toBe(inlined);
    });
});
