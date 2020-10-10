import {
	Login,
} from "./user";
import { Home } from "./home";
// import { auto_import } from "../utils";

const routesClass = [
	Login,
	Home,
];
const install = (): void => {
	routesClass.map(r => new r());
};
export { install };
