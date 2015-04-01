var bcrypt = require('bcrypt-nodejs');
console.log(bcrypt.hashSync('password', bcrypt.genSaltSync(8), null));