export async function Log(ctx: any, next: any) {
	console.log(123);
	await next();
}
