/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { join, parse } from "node:path";
import { existsSync } from "node:fs";
import { find, load } from "node-gyp-load";

const bindings = await find({
  name: "winVerifyTrust",
  dir: join(import.meta.url, "../"),
  prebuild: true
});

const { verifySignature } = load(bindings);

async function isSignedVerbose(filePath) {

  const allowed = [ '.exe', '.cab', '.dll', '.ocx', '.msi', '.msix', '.xpi' ];
  const ext = parse(filePath).ext;
  if (!allowed.includes(ext)) throw new Error(`Accepted file types are: ${allowed.join(",")}`, "ERR_UNEXPECTED_FILE_TYPE");
  
  if (!existsSync(filePath)) throw new Error("Unable to locate target file", "ERR_NO_SUCH_FILE");

  return verifySignature(filePath);
}

async function isSigned(filePath) {
  const { signed } = await isSignedVerbose(filePath);
  return signed;
}

async function trustStatus(filePath) {
  const { message } = await isSignedVerbose(filePath);
  return message;
}

export { isSigned, trustStatus, isSignedVerbose };