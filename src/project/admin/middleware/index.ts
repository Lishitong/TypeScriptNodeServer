/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export * from "./jsonwebtoken";
export * from "./interfaceIp";



const Log = async (ctx: any, next: any): Promise<any> => {
	await next();
};



export { Log };
