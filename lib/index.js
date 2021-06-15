"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mail = exports.default_minimize_config = void 0;
const fs_1 = require("fs");
const html_minifier_1 = __importDefault(require("html-minifier"));
const inline_css_1 = __importDefault(require("inline-css"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const file_type_1 = __importDefault(require("file-type"));
exports.default_minimize_config = {
    collapseWhitespace: true,
    removeComments: true,
};
function encodeImg(image) {
    return new Promise((resolve, _) => {
        async function loadFile(file, type) {
            var _a;
            if (!type) {
                type = (_a = (await file_type_1.default.fromBuffer(file))) === null || _a === void 0 ? void 0 : _a.mime;
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
            node_fetch_1.default(image).then(async (response) => {
                loadFile(await response.buffer(), response.headers.get("content-type") || "");
            });
        }
        else if (image.match(/^[^<>:]+?$/i)) {
            const file = fs_1.readFileSync(image);
            loadFile(file);
        }
        else
            resolve(image);
    });
}
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
        this.pending = [];
        this.html = getContent(html);
        this.css = (css === null || css === void 0 ? void 0 : css.map(getContent)) || [];
    }
    async generate(cb) {
        await Promise.all(this.pending);
        if (cb) {
            cb(this.html);
        }
        return this.html;
    }
    minimize(options = exports.default_minimize_config) {
        const minimize = () => {
            this.html = html_minifier_1.default.minify(this.html, options);
        };
        Promise.all(this.pending).then(minimize);
        return this;
    }
    addCSS(css) {
        var _a;
        (_a = this.css) === null || _a === void 0 ? void 0 : _a.push(getContent(css));
        return this;
    }
    inlineCSS() {
        this.pending.push(new Promise((resolve, _) => {
            inline_css_1.default(this.html, {
                extraCss: this.css.join("\n"),
                url: "example.com",
            }).then((inlined) => {
                this.html = inlined;
                resolve();
            });
        }));
        return this;
    }
    inlineImages() {
        this.pending.push(new Promise(async (resolve) => {
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
        }));
        return this;
    }
}
exports.Mail = Mail;
//# sourceMappingURL=index.js.map