import { readFileSync } from "fs";
import htmlMinifier from "html-minifier";
import inlineCSS from "inline-css";
import fetch from "node-fetch";
import FileType from "file-type";

export const default_minimize_config = {
  collapseWhitespace: true,
  removeComments: true,
};

function encodeImg(image: string): Promise<string> {
  return new Promise((resolve, _) => {
    async function loadFile(file: Buffer, type?: string) {
      if (!type) {
        type = (await FileType.fromBuffer(file))?.mime;
        if (!type) {
          console.warn(`type of ${image} not found defaulting to "image/jpg"`);
          type = "image/jpg";
        }
      }
      const encoded = file.toString("base64");

      if (encoded.length > 3000)
        console.warn(`${image} is realy big! ${encoded.length} characters`);
      resolve("data:" + type + ";base64," + encoded);
    }

    if (image.match(/^https?:.+/)) {
      fetch(image).then(async (response) => {
        loadFile(
          await response.buffer(),
          response.headers.get("content-type") || ""
        );
      });
    } else if (image.match(/^[^<>:]+?$/i)) {
      const file = readFileSync(image);
      loadFile(file);
    }
  });
}

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
  private pending: Promise<void>[] = [];
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
    await Promise.all(this.pending);
    return this.html;
  }
  minimize(options: htmlMinifier.Options = default_minimize_config): Mail {
    const minimize = () => {
      this.html = htmlMinifier.minify(this.html, options);
    };
    Promise.all(this.pending).then(minimize);
    return this;
  }
  addCSS(css: string | Buffer) {
    this.css?.push(getContent(css));
    return this;
  }
  inlineCSS() {
    this.pending.push(
      new Promise((resolve, _) => {
        inlineCSS(this.html, {
          extraCss: this.css.join("\n"),
          url: "example.com",
        }).then((inlined) => {
          this.html = inlined;
          resolve();
        });
      })
    );

    return this;
  }
  inlineImages() {
    this.pending.push(
      new Promise(async (resolve) => {
        const re = /<img[^>]*?src\s*=\s*[""']?([^'"" >]+?)[ '""][^>]*?>/gi;
        let result = this.html;
        let m;

        while ((m = re.exec(this.html)) !== null) {
          // This is necessary to avoid infinite loops with zero-width matches
          if (m.index === re.lastIndex) {
            re.lastIndex++;
          }
          for (let groupIndex = 0; groupIndex < m.length; groupIndex++) {
            const match = m[groupIndex];
            if (groupIndex == 1 && match) {
              result = result.replace(match, await encodeImg(match));
            }
          }
        }
        this.html = result;
        resolve();
      })
    );
    return this;
  }
}
