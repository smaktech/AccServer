const jwt = require("jsonwebtoken");
const fs = require("fs");

module.exports = async (token) => {
	if (token == "") {
		// if the accesstoken is given empty
		return "";
	}

	if (!token) {
		//if no otken present

		throw new Error("Token is not Given");
	}
	const publicKey = fs.readFileSync("JWT_keys/public.key"); //will read the public key viewing the token

	try {
		const decrypt = await jwt.verify(token, publicKey); //decrypting the token using the keys

		if (!decrypt) {
			return false;
		} else {
			return decrypt; //return the payload
		}
	} catch (error) {
		throw new Error(`Dycription ERROR : ${err}`);
	}
};
