/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

// import {
// 	readFile as file,
// 	readFileSync as fileSync,
// 	readdir as dir,
// 	readdirSync as dirSync,
// } from "fs";
// import { resolve } from "path";
// export const auto_import = (
// 	path: string,
// 	{ readdir = true, readFile = true } = { readdir: true, readFile: true }
// ) => {
// 	if (readdir && readFile) return _import(path);
// 	if (!readdir && !readFile) return _importAsync(path);
// 	if (readdir && !readFile) return _import_(path);
// 	if (!readdir && readFile) return _import_async(path);
// };

// const _importAsync = (path: string) => {};
// const _import = async (path: string) => {
// 	const dirs = await dirSync(path);
// 	dirs
// 		.filter(file => file.indexOf("index.") == -1)
// 		.map(async file => {
// 			const resolvePath = resolve(path, file);
// 			const fileData = await fileSync(resolvePath, { encoding: "utf-8" });
// 			console.log(fileData);
// 		});
// };
// const _import_async = (path: string) => {};
// const _import_ = (path: string) => {};

export const isArray = (arr: any) =>
	toString.call(arr).slice(8, -1) === "Array" ? arr : [arr];

export * from "./validate";
