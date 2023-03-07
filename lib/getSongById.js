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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSongById = void 0;
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const parseSongInfo_1 = require("./parseSongInfo");
const utils_1 = require("./utils");
function getSongById(id, apiKey) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        if (!id)
            throw new TypeError("No song id was provided");
        if (!apiKey)
            throw new TypeError("No API key was provided");
        try {
            const res = yield (0, cross_fetch_1.default)(`${utils_1.API_SONG}${encodeURIComponent(id)}`, {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + apiKey
                }
            });
            const resJson = yield res.json();
            return ((_a = resJson === null || resJson === void 0 ? void 0 : resJson.response) === null || _a === void 0 ? void 0 : _a.song) ? (0, parseSongInfo_1.parseSongInfo)((_b = resJson === null || resJson === void 0 ? void 0 : resJson.response) === null || _b === void 0 ? void 0 : _b.song, true) : null;
        }
        catch (e) {
            throw e;
        }
    });
}
exports.getSongById = getSongById;
