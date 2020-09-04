type Validate = {
	val: string;
	createTime: number;
	invalidTime: number;
};

const code = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM0123456789".split(
	""
);

let result: Validate;
let token: string;

const getRndInteger = (min = 0, max = 62, isclude = 0): number => {
	return Math.floor(Math.random() * (max - min + isclude)) + min;
};

const getValidateCode = ({ invalid } = { invalid: 60 * 1000 * 5 }): void => {
	let validateCode = "";
	for (let i = 0; i < 4; i++) {
		validateCode += code[getRndInteger()];
	}
	const time = new Date();
	const createTime = time.getTime();
	const invalidTime = createTime + invalid;
	result = {
		val: validateCode,
		createTime,
		invalidTime,
	};
};

const getResult = (): Validate => result;
const setToken = (token: string): string => token;
const getToken = (): string => token;

export { getRndInteger, getValidateCode, getResult, setToken, getToken };
