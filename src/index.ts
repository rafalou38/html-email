import { readFileSync } from "fs";
import htmlMinifier from "html-minifier";
import inlineCSS from "inline-css";

export const default_minimize_config = {
  collapseWhitespace: true,
  removeComments: true,
};

function getContent(data: string | Buffer) {
  if (Buffer.isBuffer(data)) {
    // data is a buffer
    return data.toString();
  } else if (data.match(/^[^<>:]+?$/i)) {
    // data is a path
    return readFileSync(data).toString();
  } else {
    // data is plaintext
    return data;
  }
}

export class Mail {
  private pending: Promise<void> | null = null;
  private html: string;
  private css: string[];
  /**
   *
   * @param {string | Buffer} html - Path of an html file or html content
   * @param {string[]} css - path/content of css styles to apply
   */
  constructor(html: string | Buffer, css?: string[]) {
    this.html = getContent(html);
    this.css = css?.map(getContent) || [];
  }
  async generate(): Promise<string> {
    await this.pending;
    return this.html;
  }
  minimize(options: htmlMinifier.Options = default_minimize_config): Mail {
    const minimize = () => {
      this.html = htmlMinifier.minify(this.html, options);
    };
    if (this.pending) {
      this.pending.then(minimize);
    }
    minimize();
    return this;
  }
  addCSS(css: string | Buffer) {
    this.css?.push(getContent(css));
    return this;
  }
  inlineCSS() {
    this.pending = new Promise((resolve, _) => {
      inlineCSS(this.html, {
        extraCss: this.css.join("\n"),
        url: "example.com",
      }).then((inlined) => {
        this.html = inlined;
        resolve();
      });
    });

    return this;
  }
}
