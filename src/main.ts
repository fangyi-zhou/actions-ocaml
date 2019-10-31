import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import * as path from 'path';
import {promises as fs} from 'fs';

const OPAM_BINARY_URL_LINUX = 'https://github.com/ocaml/opam/releases/download/2.0.5/opam-2.0.5-x86_64-linux';
const OPAM_BINARY_URL_DARWIN = 'https://github.com/ocaml/opam/releases/download/2.0.5/opam-2.0.5-x86_64-darwin';
const OPAM_BINARY_URL_OPENBSD = 'https://github.com/ocaml/opam/releases/download/2.0.5/opam-2.0.5-x86_64-openbsd';
const OPAM_VERSION = '2.0.5';

function get_opam_url() : string {
  switch (process.platform) {
    case 'darwin':
      return OPAM_BINARY_URL_DARWIN;
    case 'linux':
      return OPAM_BINARY_URL_LINUX;
    case 'openbsd':
      return OPAM_BINARY_URL_OPENBSD
    default:
      throw Error("Unsupported Platform");
  }
}

async function install_opam() {
  const local_bin = path.join(process.env.HOME!, ".local", "bin");
  const opam_path = await tc.downloadTool(get_opam_url());
  core.debug(`Downloaded opam ${OPAM_VERSION} to ${opam_path}`);
  await fs.chmod(opam_path, 0o755); // set executable
  core.debug(`Setting opam executable`)
  await io.mkdirP(local_bin);
  core.debug(`Created ${local_bin}`)
  await io.mv(opam_path, path.join(local_bin, 'opam'));
  core.debug(`Moving opam binary to ${local_bin}`)
  core.addPath(local_bin);
  core.debug("Running opam init")
  await exec.exec("opam", ["init", "-y", "--disable-sandboxing", "--bare"]);
}

async function run() {
  try {
    core.debug("Installing opam");
    await install_opam();
  } catch (e) {
    core.setFailed(`Failed ${e}`);
  }
}

run();
