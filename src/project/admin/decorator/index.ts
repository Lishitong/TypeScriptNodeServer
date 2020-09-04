/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Log, Jwt } from "../middleware";
import { isArray } from "../utils";
// middlerware -> decorator

export const Convert = (middlerware: any) => (
	target: any,
	name: string,
	decorator: any
) => {
	if (typeof middlerware !== "function")
		throw TypeError("Argument type must be a function");

	// let middlerwareHandler: any = null;

	// if (typeof (middlerwareHandler = middlerware()) !== "function") {
	// 	middlerwareHandler = middlerware;
	// }

	target[name] = [middlerware(), ...isArray(target[name])];

	return decorator;
};

const middlerwares = [Log, Jwt];

middlerwares.map(middlerware => {
	module.exports[middlerware.name + "Decorator"] = Convert(() => middlerware);
});
