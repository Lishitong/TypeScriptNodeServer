/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const isArray = (arr: any) =>
	toString.call(arr).slice(8, -1) === "Array" ? arr : [arr];

