"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mail = exports.default_minimize_config = void 0;
const fs_1 = require("fs");
const html_minifier_1 = __importDefault(require("html-minifier"));
const inline_css_1 = __importDefault(require("inline-css"));
exports.default_minimize_config = {
    collapseWhitespace: true,
    removeComments: true,
};
function getContent(data) {
    if (Buffer.isBuffer(data)) {
        // data is a buffer
        return data.toString();
    }
    else if (data.match(/^[^<>:]+?$/i)) {
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
     * @param {string | Buffer} html - Path of an html file or html content
     * @param {string[]} css - path/content of css styles to apply
     */
    constructor(html, css) {
        this.pending = null;
        this.html = getContent(html);
        this.css = (css === null || css === void 0 ? void 0 : css.map(getContent)) || [];
    }
    async generate() {
        await this.pending;
        return this.html;
    }
    minimize(options = exports.default_minimize_config) {
        const minimize = () => {
            this.html = html_minifier_1.default.minify(this.html, options);
        };
        if (this.pending) {
            this.pending.then(minimize);
        }
        minimize();
        return this;
    }
    addCSS(css) {
        var _a;
        (_a = this.css) === null || _a === void 0 ? void 0 : _a.push(getContent(css));
        return this;
    }
    inlineCSS() {
        this.pending = new Promise((resolve, _) => {
            inline_css_1.default(this.html, {
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
exports.Mail = Mail;
//# sourceMappingURL=index.js.map