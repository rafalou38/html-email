"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mail = void 0;
const fs_1 = require("fs");
class Mail {
    /**
     *
     * @param html Path of an html file or html content
     * @param css path of a css file to apply
     */
    constructor(html, css) {
        if (Buffer.isBuffer(html)) {
            // html is a html buffer
            this.html = html.toString();
        }
        else if (html.match(/^[^<>]+?\.html$/i)) {
            // html is a path
            this.html = fs_1.readFileSync(html).toString();
        }
        else {
            // html is html code
            this.html = html;
        }
        this.css = css;
    }
    generate() {
        return this.html;
    }
}
exports.Mail = Mail;
