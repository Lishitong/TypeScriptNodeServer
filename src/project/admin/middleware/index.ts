/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

const Test = async function Test(ctx: any, next: any): Promise<any> {
	console.log(321);
	await next();
};

const Log = async (ctx: any, next: any): Promise<any> => {
	await next();
};

const Test2 = async (ctx: any, next: any): Promise<any> => {
	console.log(1234);
	await next();
};

export {
	Log,
	Test,
	Test2
};
