/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { interfaceIp } from "../config";

const dao_ip_filter = async (ctx: any, next: any): Promise<any> => {
	const host = ctx.request.header.host;
	if (interfaceIp[host]) {
		await next();
	} else {
		ctx.status = 403;
		ctx.body = {
			status: 403,
			state: "success",
			message: "资源不可用",
		};
	}
};

export { dao_ip_filter };
