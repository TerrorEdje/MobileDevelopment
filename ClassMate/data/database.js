var mongoose = require('mongoose');

module.exports = function(){
	if(mongoose.connection.readyState == 0){
		// Get these from config
		var uri = 'mongodb://localhost:27017/ClassMate';
		var options = {
			db: { native_parser: true },
			server: { poolSize: 5 },
			replset: { rs_name: 'myReplicaSetName' },
			user: 'myUserName',
			pass: 'myPassword'
		}

		//mongoose.connect(uri, options);
		mongoose.connect(uri);
	}
	return mongoose;
};