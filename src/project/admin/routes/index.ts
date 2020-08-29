import { Test } from "./test";

const routesClass = [Test];
const install = (): void => {
	routesClass.map(r => new r());
};

export { install };
