import { Login } from "./user";
import { ValidateCode } from "./utils";
// import { auto_import } from "../utils";

const routesClass = [Login, ValidateCode];
const install = (): void => {
	routesClass.map(r => new r());
};
export { install };
