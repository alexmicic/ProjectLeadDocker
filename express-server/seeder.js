var seeder = require('mongoose-seed');
var db = require('./config/db');
var bcrypt = require('bcrypt');

// Connect to MongoDB via Mongoose 
seeder.connect(db.url, function() {
 
    // Load Mongoose models 
    seeder.loadModels([
		'model/board.js',
		'model/comment.js',
		'model/issue.js',
		'model/project.js',
		'model/sprint.js',
		'model/team.js',
		'model/user.js'
    ]);
 
    // Clear specified collections 
    seeder.clearModels(['Board', 'Comment', 'Issue', 'Project', 'Sprint', 'Team', 'User'], function() {
 
        // Callback to populate DB once collections have been cleared 
        seeder.populateModels(data, function() {
            //seeder.disconnect(); 
        });
 
    });
});

var hashPass = function (pass) {
	var saltRounds = 5;
	var salt = bcrypt.genSaltSync(saltRounds);
	var hashPassword = bcrypt.hashSync(pass, salt);

	return hashPassword;
};

var data = [
	{
		model: 'User',
		documents: [
			{
				firstName: 'Admin',
				lastName: 'Admin',
				phone: '+00000000000',
				email: 'admin@test.com',
				password: hashPass('admin'),
				admin: true
			}
		]
	}
];