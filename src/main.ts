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

const local_bin = path.join(process.env.HOME!, ".local", "bin");
const opam_path = path.join(local_bin, 'opam');

async function setup_opam() {
  const opam_download_path = await tc.downloadTool(get_opam_url());
  core.debug(`Downloaded opam ${OPAM_VERSION} to ${opam_download_path}`);
  await fs.chmod(opam_download_path, 0o755); // set executable
  core.debug(`Setting opam executable`)
  await io.mkdirP(local_bin);
  core.debug(`Created ${local_bin}`)
  await io.mv(opam_download_path, opam_path);
  core.debug(`Moving opam binary to ${local_bin}`)
  core.addPath(local_bin);
  core.debug("Running opam init")
  await exec.exec("opam", ["init", "-y", "--disable-sandboxing", "--bare"]);
  core.debug("opam is initialised")
}

async function setup_ocaml() {
  // TODO: Make OCaml version an argument
  const ocaml_version = '4.09.0';
  core.debug(`Installing OCaml switch ${ocaml_version}`);
  await exec.exec("opam", ["switch", "create", ocaml_version]);
  const opam_switch = path.join(opam_path, ocaml_version);
  const opam_bin = path.join(opam_switch, 'bin');
  // await tc.cacheDir(opam_switch, "OCaml", ocaml_version);
  core.addPath(opam_bin);
  core.debug("OCaml is installed");
}

async function run() {
  try {
    core.debug("Setting up opam");
    await setup_opam();
    core.debug("Installing OCaml")
    await setup_ocaml();
  } catch (e) {
    core.setFailed(`Failed ${e}`);
  }
}

run();
