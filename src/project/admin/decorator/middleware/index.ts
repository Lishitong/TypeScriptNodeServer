/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Log } from "./middleware";
// middlerware -> decorator
export const Convert = (middlerware: any) => (
	target: any,
	name: string,
	decorator: any
) => {
	if (typeof middlerware !== "function")
		throw TypeError("Argument type must be a function");

	let middlerwareHandler = null;

	if (typeof (middlerwareHandler = middlerware(target, name)) !== "function") {
		middlerwareHandler = middlerware;
	}

	target[name] = [middlerwareHandler, target[name]];

	return decorator;
};
const middlerwares = [Log];
const decorators: any = {};
middlerwares.map(middlerware => {
	decorators[middlerware.name + "d"] = Convert(
		(target: any, name: string) => middlerware
	);
});

console.log(decorators);

export default decorators;
