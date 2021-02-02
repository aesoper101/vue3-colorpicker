/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs-extra");
const path = require("path");
const projectRoot = path.resolve(__dirname, "..");
const distRoot = path.resolve(projectRoot, "dist");

const pkg = require(path.resolve(__dirname, "package.json"));
const devPkg = require(path.resolve(projectRoot, "package.json"));

const pkgKeys = Object.keys(pkg);
const devPkgKeys = Object.keys(devPkg);

fs.copyFileSync(
  path.resolve(projectRoot, "README.md"),
  path.resolve(distRoot, "README.md")
);

if (fs.existsSync(path.resolve(projectRoot, "LICENSE"))) {
  fs.copyFileSync(
    path.resolve(projectRoot, "LICENSE"),
    path.resolve(distRoot, "LICENSE")
  );
}

const packageData = pkg;
pkgKeys.forEach(value => {
  if (
    pkgKeys.includes(value) &&
    devPkgKeys.includes(value) &&
    !["scripts", "main", "types"].includes(value)
  ) {
    packageData[value] = devPkg[value];
  } else {
    packageData[value] = pkg[value];
  }
});

// 异步写入数据到文件
fs.writeJSONSync(path.resolve(distRoot, "package.json"), packageData, {
  spaces: 2
});
