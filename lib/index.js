"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mail = exports.default_minimize_config = void 0;
const fs_1 = require("fs");
const html_minifier_1 = __importDefault(require("html-minifier"));
exports.default_minimize_config = {
    collapseWhitespace: true,
    removeComments: true,
};
function getContent(data) {
    if (Buffer.isBuffer(data)) {
        // data is a buffer
        return data.toString();
    }
    else if (data.match(/^[^<>]+?$/i)) {
        // data is a path
        return fs_1.readFileSync(data).toString();
    }
    else {
        // data is plaintext
        return data;
    }
}
class Mail {
    /**
     *
     * @param html Path of an html file or html content
     * @param css path of a css file to apply
     */
    constructor(html, css) {
        this.html = getContent(html);
        this.css = css;
    }
    generate() {
        return this.html;
    }
    minimize(options = exports.default_minimize_config) {
        this.html = html_minifier_1.default.minify(this.html, options);
        return this;
    }
    addCSS(css) {
        this.css = getContent(css);
    }
}
exports.Mail = Mail;
