/**
 * GET /version → { version: "<package.json version>" }
 * Reads version from package.json to keep it source-of-truth.
 */

import { Router } from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const router = Router();

router.get("/version", (_req, res) => {
  const pkg = JSON.parse(
<<<<<<< HEAD
    fs.readFileSync(path.join(__dirname, "..", "..","..", "package.json"), "utf-8")
=======
    fs.readFileSync(path.join(__dirname,"..",".." ,"..", "package.json"), "utf-8")
>>>>>>> b743bbe80450145ed1579c0ceb93649e85782d26
  );
  res.status(200).json({ version: pkg.version });
});

export default router;
