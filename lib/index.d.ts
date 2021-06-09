/// <reference types="node" />
import htmlMinifier from "html-minifier";
export declare const default_minimize_config: {
    collapseWhitespace: boolean;
    removeComments: boolean;
};
export declare class Mail {
    private html;
    private css;
    /**
     *
     * @param html Path of an html file or html content
     * @param css path of a css file to apply
     */
    constructor(html: string | Buffer, css?: string | string[]);
    generate(): string;
    minimize(options?: htmlMinifier.Options): Mail;
}
