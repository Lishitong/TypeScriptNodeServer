/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, GET } from "../decorator/router";
import { getValidateCode, getResult } from "../utils";

@Controller("api")
class ValidateCode {
	@GET("validateCode")
	validateCode(ctx: any) {
		getValidateCode();
		const validate = getResult();
		ctx.body = {
			codeInfo: validate,
			status: 200,
			state: "success",
		};
	}
}

export { ValidateCode };
