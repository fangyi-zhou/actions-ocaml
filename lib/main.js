"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const tc = __importStar(require("@actions/tool-cache"));
const exec = __importStar(require("@actions/exec"));
const OPAM_INSTALL_SH = "https://raw.githubusercontent.com/ocaml/opam/master/shell/install.sh";
function install_opam() {
    return __awaiter(this, void 0, void 0, function* () {
        const opam_install_sh = yield tc.downloadTool(OPAM_INSTALL_SH);
        core.debug(`Downloading opam install.sh to ${opam_install_sh}`);
        yield exec.exec("sh", [opam_install_sh]);
        yield exec.exec("opam", ["init", "-y"]);
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        core.debug("Installing opam");
        yield install_opam();
    });
}
run();
