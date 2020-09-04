import { Test } from "./test";
import { Login, Register, ValidateCode } from "./user";
// import { auto_import } from "../utils";

const routesClass = [Test, Login, Register, ValidateCode];
const install = (): void => {
	routesClass.map(r => new r());
};
export { install };
