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
const OPAM_BINARY_URL_LINUX = 'https://github.com/ocaml/opam/releases/download/2.0.5/opam-2.0.5-x86_64-linux';
const OPAM_BINARY_URL_DARWIN = 'https://github.com/ocaml/opam/releases/download/2.0.5/opam-2.0.5-x86_64-darwin';
const OPAM_BINARY_URL_OPENBSD = 'https://github.com/ocaml/opam/releases/download/2.0.5/opam-2.0.5-x86_64-openbsd';
const OPAM_VERSION = '2.0.5';
const OCAML_DEFAULT_VERSION = '4.09.0';
function get_opam_url() {
    switch (process.platform) {
        case 'darwin':
            return OPAM_BINARY_URL_DARWIN;
        case 'linux':
            return OPAM_BINARY_URL_LINUX;
        case 'openbsd':
            return OPAM_BINARY_URL_OPENBSD;
        default:
            throw Error("Unsupported Platform");
    }
}
const local_bin = path.join(process.env.HOME, ".local", "bin");
const opam_path = path.join(local_bin, 'opam');
const dot_opam = path.join(process.env.HOME, ".opam");
function setup_opam() {
    return __awaiter(this, void 0, void 0, function* () {
        const opam_download_path = yield tc.downloadTool(get_opam_url());
        core.debug(`Downloaded opam ${OPAM_VERSION} to ${opam_download_path}`);
        yield fs_1.promises.chmod(opam_download_path, 0o755); // set executable
        core.debug(`Setting opam executable`);
        yield io.mkdirP(local_bin);
        core.debug(`Created ${local_bin}`);
        yield io.mv(opam_download_path, opam_path);
        core.debug(`Moving opam binary to ${local_bin}`);
        core.addPath(local_bin);
        core.debug("Running opam init");
        yield exec.exec("opam", ["init", "-y", "--disable-sandboxing", "--bare"]);
        core.debug("opam is initialised");
    });
}
function setup_ocaml() {
    return __awaiter(this, void 0, void 0, function* () {
        const ocaml_version = core.getInput("ocaml_version") || OCAML_DEFAULT_VERSION;
        core.debug(`Installing OCaml switch ${ocaml_version}`);
        yield exec.exec("opam", ["switch", "create", ocaml_version]);
        const opam_switch = path.join(dot_opam, ocaml_version);
        const opam_bin = path.join(opam_switch, 'bin');
        // await tc.cacheDir(opam_switch, "OCaml", ocaml_version);
        core.addPath(opam_bin);
        core.debug("OCaml is installed");
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            core.debug("Setting up opam");
            yield setup_opam();
            core.debug("Installing OCaml");
            yield setup_ocaml();
        }
        catch (e) {
            core.setFailed(`Failed ${e}`);
        }
    });
}
run();
