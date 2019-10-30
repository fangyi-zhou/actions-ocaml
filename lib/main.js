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
const io = __importStar(require("@actions/io"));
const path = __importStar(require("path"));
const fs_1 = require("fs");
const OPAM_BINARY_URL = 'https://github.com/ocaml/opam/releases/download/2.0.5/opam-2.0.5-x86_64-linux';
const OPAM_VERSION = '2.0.5';
function get_opam_url() {
    // TODO: Check platform
    return OPAM_BINARY_URL;
}
function install_opam() {
    return __awaiter(this, void 0, void 0, function* () {
        const local_bin = path.join(process.env.HOME, ".local", "bin");
        const opam_path = yield tc.downloadTool(OPAM_BINARY_URL);
        core.debug(`Downloaded opam ${OPAM_VERSION} to ${opam_path}`);
        yield fs_1.promises.chmod(opam_path, 0o755); // set executable
        core.debug(`Setting opam executable`);
        yield io.mkdirP(local_bin);
        core.debug(`Created ${local_bin}`);
        yield io.mv(opam_path, local_bin);
        core.debug(`Moving opam binary to ${local_bin}`);
        core.addPath(local_bin);
        core.debug("Running opam init");
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
