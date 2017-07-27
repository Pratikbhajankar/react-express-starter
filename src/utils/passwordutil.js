import bcrypt from 'bcrypt';
class EncryptPassword {
	generateHash(passwrod,count,callback){
		bcrypt.hash(passwrod,count,callback,(err, bCryptedPassword)=>{
			if(err)
				callback(null);

			callback(bCryptedPassword);

		});
	}

	compareHash(passwrod,hash,callback){
		bcrypt.compare(passwrod,hash,(err, doesMatch)=>{
			if(err)
				callback(null);

			callback(doesMatch);
		})
	}
};
export default new EncryptPassword();