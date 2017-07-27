var bcrypt = require('bcrypt');
const saltRounds = 10;
class EncryptPassword {
	generateHash(passwrod, count, callback) {
		console.log("here in hash creation method");
		callback(bcrypt.hashSync(passwrod, count));
	}

	compareHash(passwrod, hash, callback) {
		console.log("here in hash compaire method");
		callback(bcrypt.compareSync(passwrod, hash));
	}
};
export default new EncryptPassword();