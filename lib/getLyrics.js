"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const searchSongs_1 = require("./searchSongs");
const utils_1 = require("./utils");
function getLyrics(optionsOrUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //provided genius URL
            if (optionsOrUrl && typeof optionsOrUrl === "string")
                return yield (0, utils_1.extractLyrics)(optionsOrUrl);
            //provided song artist and title
            if (typeof optionsOrUrl === "object") {
                (0, utils_1.validateOptions)(optionsOrUrl);
                const result = yield (0, searchSongs_1.searchSongs)(Object.assign(Object.assign({}, optionsOrUrl), { topResultOnly: true }));
                return result ? (0, utils_1.extractLyrics)(result.url) : null;
            }
            throw new TypeError("Invalid argument type");
        }
        catch (e) {
            throw e;
        }
    });
}
exports.default = getLyrics;
