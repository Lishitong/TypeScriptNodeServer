import { Test } from "./test";
import { Login, Register, ValidateCode, VlidatePwd } from "./user";
import { Home } from "./home";
// import { auto_import } from "../utils";

const routesClass = [Test, Login, Register, ValidateCode, Home, VlidatePwd];
const install = (): void => {
	routesClass.map(r => new r());
};
export { install };
