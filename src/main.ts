import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as exec from '@actions/exec';

const OPAM_INSTALL_SH : string = "https://raw.githubusercontent.com/ocaml/opam/master/shell/install.sh";

async function install_opam() {
  const opam_install_sh = await tc.downloadTool(OPAM_INSTALL_SH);
  core.debug(`Downloading opam install.sh to ${opam_install_sh}`);
  await exec.exec("sh", [opam_install_sh]);
  await exec.exec("opam", ["init", "-y"]);
}

async function run() {
  core.debug("Installing opam");
  await install_opam();
}

run();
