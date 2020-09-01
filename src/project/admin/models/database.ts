import { readFileSync } from "fs";

const local_text = readFileSync("db.local").toString();
const local_info = JSON.parse(local_text);
const { ip, port, base, username, password, url } = local_info;

Object.keys(base).map(key => {
	module.exports[key] = base[key];
});

Object.keys(url).map(key => {
	module.exports[key + "_url"] = url[key];
});

export { ip, port, username, password };
