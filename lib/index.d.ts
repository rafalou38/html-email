/// <reference types="node" />
import htmlMinifier from "html-minifier";
export declare const default_minimize_config: {
    collapseWhitespace: boolean;
    removeComments: boolean;
};
export declare class Mail {
    private pending;
    private html;
    private css;
    /**
     *
     * @param {string | Buffer} html - Path of an html file or html content
     * @param {string[]} css - path/content of css styles to apply
     */
    constructor(html: string | Buffer, css?: string[]);
    generate(cb?: (html: string) => any): Promise<string>;
    minimize(options?: htmlMinifier.Options): Mail;
    addCSS(css: string | Buffer): this;
    inlineCSS(): this;
    inlineImages(): this;
}
