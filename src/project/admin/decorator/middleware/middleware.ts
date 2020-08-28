/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function Log(ctx: any, next: any): Promise<void> {
	console.log(123);
	await next();
}
