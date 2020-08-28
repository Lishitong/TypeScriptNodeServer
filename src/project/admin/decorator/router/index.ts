/*
 * @Author: lidalan
 * @Date: 2020-08-26 16:20:05
 * @LastEditors: lidalan
 * @LastEditTime: 2020-08-28 16:58:10
 * @Description:
 * @FilePath: \TypeScriptNodeServer\src\project\admin\decorator\router\index.ts
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
type Callback = () => void;

interface Routes {
	target: any;
	method: string;
	path: string;
	callback: Array<Callback>;
}

const prefixPath = "admin";
const routeMap: Array<Routes> = [];

export default class Router {
	router: any;
	constructor(router: any) {
		this.router = router;
	}

	init() {
		const { router } = this;

		routeMap.map(route => {
			const { target, method, path, callback } = route;
			const prefix = target.admin;
			this.router[method](prefix + path, ...callback);
		});

		return router;
	}
}

export const Controller = (path: string) => (target: any): void => {
	target.prototype[prefixPath] = _resolvePath(path);
};


const _resolvePath = (path: string) => {
	if (!path) return "";
	if (path.charAt(0) === "/") path = path.slice(1);
	if (path.lastIndexOf("/") === path.length - 1)
		path = path.slice(0, path.length - 1);
	return `/${path}`;
};

const _setRouter = (method: string) => (path: string) => (
	target: any,
	name: string,
	decorator: any
) => {
	routeMap.push({
		target,
		method,
		path: _resolvePath(path),
		callback: target[name],
	});
	return decorator;
};

// compose-middlerware
// const compose = (...middlerwares: any) => {

// 	const dispath = (i: number): Promise<any> => {
// 		if (i === middlerwares.length) return Promise.resolve();
// 		const route = middlerwares[i];
// 		return Promise.resolve(route(() => dispath(i + 1)));
// 	};

// 	dispath(0);
// };

export const GET = _setRouter("get");
export const POST = _setRouter("post");
