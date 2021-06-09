import { readFileSync } from "fs";

export class Mail {
  private html: string;
  private css: string | string[] | undefined;
  /**
   *
   * @param html Path of an html file or html content
   * @param css path of a css file to apply
   */
  constructor(html: string | Buffer, css?: string | string[]) {
    if (Buffer.isBuffer(html)) {
      // html is a html buffer
      this.html = html.toString();
    } else if (html.match(/^[^<>]+?\.html$/i)) {
      // html is a path
      this.html = readFileSync(html).toString();
    } else {
      // html is html code
      this.html = html;
    }
    this.css = css;
  }
  generate(): string {
    return this.html;
  }
}
