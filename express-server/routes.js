// grab the models
var User = require('./model/user');
var Project = require('./model/project');
var Team = require('./model/team');
var Comment = require('./model/comment');
var Issue = require('./model/issue');
var Board = require('./model/board');
var Sprint = require('./model/sprint');

// plugins
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');

// email client
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'projectlead2018@gmail.com',
    pass: 'nijeV@ljda!'
  }
});

module.exports = function(app) {

  // Authenticate ===
  app.post('/api/authenticate', function (req, res) {
    try {
      User.findOne({ 'email': req.body.email }, function (err, User) {
        if (err)
          res.status(422).send(err);

        if (!User) {
          res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (User) {
          // check if password matches
          var comparePass = bcrypt.compareSync(req.body.password, User.password);

          if (!comparePass) {
            res.json({ success: false, message: 'Authentication failed. Wrong password.' });
          } else {

            // if user is found and password is right
            // create a token
            var token = jwt.sign(User, app.get('superSecret'), {
              expiresIn: 60*60*24 // expires in 24 hours
            });

            // return the information including token as JSON
            res.json({
              success: true,
              message: 'Enjoy your token!',
              token: token,
              admin: User.admin,
              firstName: User.firstName,
              lastName: User.lastName,
              id: User._id
            });
          } 

        }

      })
    } catch (err) {
      res.status(422).send(err);
    }
  });

  // Middleware ===
  app.use('/api', function (req, res, next) {
    // check if not the /api/authenticate route
    if (req.originalUrl === '/api/authenticate/') {
      next();
    } else {

      // check header or url parameters or post parameters for token
      var token;
      // var token = req.body.token || req.query.token || req.headers['x-access-token'];

      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
      } else if (req.query && req.query.token) {
        token = req.query.token;
      }

      // decode token
      if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
          if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });    
          } else {
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;    
            next();
          }
        });

      } else {

        // if there is no token
        // return an error
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });

      }
    }
  });

  // User ===
  // get all REGULAR Users
  app.get('/api/users', function (req, res) {
    User.find({ 'admin': { $ne: true }}, function (err, Users) {
      if (err)
        res.status(400).send(err);

      res.json(Users);
    })
  });

  // get all Users for a Team
  app.get('/api/teams/:id/users', function (req, res) {
    User.find({ 'teams': req.params.id }, function (err, Users) {
      if (err)
        res.status(400).send(err);

      res.json(Users);
    })
  });

  // get User by id
  app.get('/api/users/:id', function (req, res) {
    try {
      User.findOne({ '_id': req.params.id }, function (err, User) {
        if (err)
          res.status(422).send(err);

        res.json(User);
      })
    } catch (err) {
      res.status(422).send(err);
    }
  });

  // add new User
  function createUser(req, callback) {
    var saltRounds = 5;
    var salt = bcrypt.genSaltSync(saltRounds);
    var hashPassword = bcrypt.hashSync(req.body.password, salt);

    new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      dateCreated: req.body.dateCreated || Date.now(),
      phone: req.body.phone,
      email: req.body.email,
      password: hashPassword,
      admin: req.body.admin || false,
      teams: req.body.teams
    }).save();

    callback();
  }

  app.post('/api/users', function (req, res) {
    try {

      User.findOne({ 'email': req.body.email }, function(err, User){
        if (err)
          res.status(422).send(err);
        
        if (!User) {
          createUser(req, function() {
            // sending an email to a new user
            var mailOptions = {
              from: 'projectlead2018@gmail.com',
              to: req.body.email,
              subject: 'You have been added as a user of ProjecLead application',
              html: 'Hi ' + req.body.firstName + ' ' + req.body.lastName + ',<br><br>' + 
              'You have been added to a ProjectLead application. You can <a href="http://project-lead.herokuapp.com/">login here</a> with credentials:<br><br>' + 
              'Email address: <em>' + req.body.email + '</em><br>' + 
              'Temporary password: <em>' + req.body.password + '</em><br><br>' + 
              'Please change your password into more secure one.<br><br>Have a good day.'
            };

            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });


            res.json({
              success: true,
              message: 'New User added sucessfully.'
            })
          });

        } else {
          res.json({
            success: false,
            message: 'User with this email address already exist.'
          })
        }

      });

    } catch (err) {
      res.status(422).send(err);
    }
  });

  // update a User
  app.put('/api/users/:id', function (req, res) {
    try {
      User.findById({ '_id': req.params.id }, function(err, User){
        if (err)
          res.status(422).send(err);

        var saltRounds = 5;
        var salt = bcrypt.genSaltSync(saltRounds);
        var hashPassword = bcrypt.hashSync(req.body.password, salt);

        // if password is the same DO NO UPDATE IT
        if (req.body.password === User.password) {
          hashPassword = req.body.password;
        }

        User.update({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          dateCreated: req.body.dateCreated || Date.now(),
          phone: req.body.phone,
          email: req.body.email,
          password: hashPassword,
          admin: req.body.admin,
          teams: req.body.teams
        }, function() {
          res.json({
            success: true,
            message: 'User updated sucessfully.'
          })
        });
      })

    } catch (err) {
      res.status(422).send(err);
    }
  });

  // delete a User
  app.delete('/api/users/:id', function (req, res) {
    try {
      User.findById({ '_id': req.params.id }, function (err, User) {
        if (err)
          res.status(422).send(err);

      }).remove().exec();
      res.json({
        success: true,
        message: 'User deleted sucessfully.'
      })
    } catch (err) {
      res.status(422).send(err);
    }
  });

  // Project ===
  // get all Projects
  app.get('/api/projects', function (req, res) {
    Project.find(function (err, Projects) {
      if (err)
        res.status(400).send(err);

      res.json(Projects);
    })
  });

  // get Project by id
  app.get('/api/projects/:id', function (req, res) {
    try {
      Project.findOne({ '_id': req.params.id }, function (err, Project) {
        if (err)
          res.status(422).send(err);

        res.json(Project);
      })
    } catch (err) {
      res.status(422).send(err);
    }
  });

  // add new Project
  app.post('/api/projects', function (req, res) {
    try {
      new Project({
        name: req.body.name,
      }).save();

      res.json({
        success: true,
        message: 'New Project added sucessfully.'
      })
    } catch (err) {
      res.status(422).send(err);
    }
  });

  // update a Project
  app.put('/api/projects/:id', function (req, res) {
    try {
      Project.findById({ '_id': req.params.id }, function(err, Project){
        if (err)
          res.status(422).send(err);

        Project.update({
          name: req.body.name
        }, function() {
          res.json({
            success: true,
            message: 'Project updated sucessfully.'
          })
        });
      })

    } catch (err) {
      res.status(422).send(err);
    }
  });

  // delete a Project
  app.delete('/api/projects/:id', function (req, res) {
    try {
      Project.findById({ '_id': req.params.id }, function (err, Project) {
        if (err)
          res.status(422).send(err);

      }).remove().exec();
      res.json({
        success: true,
        message: 'Project deleted sucessfully.'
      })
    } catch (err) {
      res.status(422).send(err);
    }
  });

  // Boards ===
  // get all Boards
  app.get('/api/boards', function (req, res) {
    Board.find(function (err, Boards) {
      if (err)
        res.status(400).send(err);

      res.json(Boards);
    })
  });

  // get all Boards for a Project
  app.get('/api/projects/:id/boards', function (req, res) {
    Board.find({ 'project': req.params.id }, function (err, Boards) {
      if (err)
        res.status(400).send(err);

      res.json(Boards);
    })
  });

  // get Board by id
  app.get('/api/boards/:id', function (req, res) {
    try {
      Board.findOne({ '_id': req.params.id }, function (err, Board) {
        if (err)
          res.status(422).send(err);

        res.json(Board);
      })
    } catch (err) {
      res.status(422).send(err);
    }
  });

  // add new Board
  app.post('/api/boards', function (req, res) {
    try {
      new Board({
        name: req.body.name,
        type: req.body.type,
        project: req.body.project,
        columns: req.body.columns
      }).save();

      res.json({
        success: true,
        message: 'New Board added sucessfully.'
      })
    } catch (err) {
      res.status(422).send(err);
    }
  });

  // update a Board
  app.put('/api/boards/:id', function (req, res) {
    try {
      Board.findById({ '_id': req.params.id }, function(err, Board){
        if (err)
          res.status(422).send(err);

        Board.update({
          name: req.body.name,
          type: req.body.type,
          project: req.body.project,
          columns: req.body.columns
        }, function() {
          res.json({
            success: true,
            message: 'Board updated sucessfully.'
          })
        });
      })

    } catch (err) {
      res.status(422).send(err);
    }
  });

  // delete a Board
  app.delete('/api/boards/:id', function (req, res) {
    try {
      Board.findById({ '_id': req.params.id }, function (err, Board) {
        if (err)
          res.status(422).send(err);

      }).remove().exec();
      res.json({
        success: true,
        message: 'Board deleted sucessfully.'
      })
    } catch (err) {
      res.status(422).send(err);
    }
  });

  // Issues ===
  // get all Issues
  app.get('/api/issues', function (req, res) {
    Issue.find(function (err, Issues) {
      if (err)
        res.status(400).send(err);

      res.json(Issues);
    })
  });

  // get all Issues for a Board
  app.get('/api/boards/:id/issues', function (req, res) {
    Issue.find({ 'board': req.params.id }, function (err, Issues) {
      if (err)
        res.status(400).send(err);

      res.json(Issues);
    })
  });

  // get all Issues for a Sprint
  app.get('/api/sprints/:id/issues', function (req, res) {
    Issue.find({ 'sprints': req.params.id }, function (err, Issues) {
      if (err)
        res.status(400).send(err);

      res.json(Issues);
    })
  });

  // get Issue by id
  app.get('/api/issues/:id', function (req, res) {
    try {
      Issue.findOne({ '_id': req.params.id }, function (err, Issue) {
        if (err)
          res.status(422).send(err);

        res.json(Issue);
      })
    } catch (err) {
      res.status(422).send(err);
    }
  });

  // reset all board Issues
  app.post('/api/boards/:id/reset', function (req, res) {
    try {
      // set isActive to false on all previous sprints!
      Issue.update({board: req.params.id, status: { $ne: 'DONE' }}, {"$set": { status: 'OPEN'}}, {multi: true}, function(err, num) {
        if (err)
          res.status(422).send(err);

          res.json({
            success: true,
            message: 'All issues reset sucessfully.'
          })
      });
    } catch (err) {
      res.status(422).send(err);
    }
  });

  // add new Issue
  app.post('/api/issues', function (req, res) {
    try {
      new Issue({
        name: req.body.name,
        desc: req.body.desc,
        priority: req.body.priority,
        status: req.body.status,
        points: req.body.points,
        date: req.body.date || Date.now(),
        assignee: req.body.assignee,
        board: req.body.board,
        user: req.body.user,
        sprints: req.body.sprints
      }).save();

      res.json({
        success: true,
        message: 'New Issue added sucessfully.'
      })
    } catch (err) {
      res.status(422).send(err);
    }
  });

  // update a Issue
  app.put('/api/issues/:id', function (req, res) {
    try {
      Issue.findById({ '_id': req.params.id }, function(err, Issue){
        if (err)
          res.status(422).send(err);

        Issue.update({
          name: req.body.name,
          desc: req.body.desc,
          priority: req.body.priority,
          status: req.body.status,
          points: req.body.points,
          assignee: req.body.assignee,
          board: req.body.board,
          user: req.body.user,
          sprints: req.body.sprints
        }, function() {
          res.json({
            success: true,
            message: 'Issue updated sucessfully.'
          })
        });
      })

    } catch (err) {
      res.status(422).send(err);
    }
  });

  // assign Issues to a Sprint
  app.post('/api/issues/assign/:id', function (req, res) {
    try {
      var send = false;

      req.body.issueIds.forEach((item, index, array) => {
        Issue.findByIdAndUpdate(item, {$push: {sprints: req.params.id}, $set: {status: 'OPEN'}}, { 'new': true}, function(err, num) {

          if ( (index + 1) === array.length)
            send = true;
        });
      });

      // ugly hack, but ATM only solution
      // check if response modification is done
      var interval = setInterval(function(){
        if (send) {
          res.json({
            success: true,
            message: 'Issues updated sucessfully.'
          })
          clearInterval(interval);
        }
      }, 100);
    
      

    } catch (err) {
      res.status(422).send(err);
    }
  });

  // delete a Issue
  app.delete('/api/issues/:id', function (req, res) {
    try {
      Issue.findById({ '_id': req.params.id }, function (err, Issue) {
        if (err)
          res.status(422).send(err);

      }).remove().exec();
      res.json({
        success: true,
        message: 'Issue deleted sucessfully.'
      })
    } catch (err) {
      res.status(422).send(err);
    }
  });

  // Team ===
  // get all Teams
  app.get('/api/teams', function (req, res) {
    Team.find(function (err, Teams) {
      if (err)
        res.status(400).send(err);

      res.json(Teams);
    })
  });

  // get Team by id
  app.get('/api/teams/:id', function (req, res) {
    try {
      Team.findOne({ '_id': req.params.id }, function (err, Team) {
        if (err)
          res.status(422).send(err);

        res.json(Team);
      })
    } catch (err) {
      res.status(422).send(err);
    }
  });

  // get Teams for a Project
  app.get('/api/projects/:id/teams', function (req, res) {
    Team.find({ 'project': req.params.id }, function (err, Teams) {
      if (err)
        res.status(400).send(err);

      res.json(Teams);
    })
  });

  // add new Team
  app.post('/api/teams', function (req, res) {
    try {
      new Team({
        name: req.body.name,
        project: req.body.project
      }).save();

      res.json({
        success: true,
        message: 'New Team added sucessfully.'
      })
    } catch (err) {
      res.status(422).send(err);
    }
  });

  // update a Team
  app.put('/api/teams/:id', function (req, res) {
    try {
      Team.findById({ '_id': req.params.id }, function(err, Team){
        if (err)
          res.status(422).send(err);

          Team.update({
          name: req.body.name,
          project: req.body.project
        }, function() {
          res.json({
            success: true,
            message: 'Team updated sucessfully.'
          })
        });
      })

    } catch (err) {
      res.status(422).send(err);
    }
  });

  // delete a Team
  app.delete('/api/teams/:id', function (req, res) {
    try {
      Team.findById({ '_id': req.params.id }, function (err, Team) {
        if (err)
          res.status(422).send(err);

      }).remove().exec();
      res.json({
        success: true,
        message: 'Team deleted sucessfully.'
      })
    } catch (err) {
      res.status(422).send(err);
    }
  });

  // Sprint ===
  // get all Sprints
  app.get('/api/sprints', function (req, res) {
    Sprint.find(function (err, Sprints) {
      if (err)
        res.status(400).send(err);

      res.json(Sprints);
    })
  });

  // get Sprints for a Board
  app.get('/api/boards/:id/sprints', function (req, res) {
    Sprint.find({ 'board': req.params.id }, function (err, Sprints) {
      if (err)
        res.status(400).send(err);

      res.json(Sprints);
    })
  });

  // get active Sprint for a Board
  app.get('/api/boards/:id/sprints/active', function (req, res) {
    Sprint.find({ 'board': req.params.id, 'isActive': true }, function (err, Sprint) {
      if (err)
        res.status(400).send(err);

      res.json(Sprint);
    })
  });

  // get Sprint by id
  app.get('/api/sprints/:id', function (req, res) {
    try {
      Sprint.findOne({ '_id': req.params.id }, function (err, Sprint) {
        if (err)
          res.status(422).send(err);

        res.json(Sprint);
      })
    } catch (err) {
      res.status(422).send(err);
    }
  });

  // add new Sprint
  app.post('/api/sprints', function (req, res) {
    try {

      // set isActive to false on all previous sprints!
      Sprint.update({board: req.body.board}, {isActive: false}, {multi: true}, function(err, num) {
        if (err)
          res.status(422).send(err);

          new Sprint({
            name: req.body.name,
            dateStart: req.body.dateStart || Date.now(),
            dateEnd: req.body.dateEnd,
            board: req.body.board,
            points: req.body.points,
            issueCount: req.body.issueCount,
            isActive: req.body.isActive
          }).save();
    
          res.json({
            success: true,
            message: 'New Sprint added sucessfully.'
          })
      });
    } catch (err) {
      res.status(422).send(err);
    }
  });

  // update a Sprint
  app.put('/api/sprints/:id', function (req, res) {
    try {
      Sprint.findById({ '_id': req.params.id }, function(err, Sprint){
        if (err)
          res.status(422).send(err);

        Sprint.update({
          name: req.body.name,
          dateStart: req.body.dateStart,
          dateEnd: req.body.dateEnd,
          board: req.body.board,
          points: req.body.points,
          issueCount: req.body.issueCount,
          isActive: req.body.isActive
        }, function() {
          res.json({
            success: true,
            message: 'Sprint updated sucessfully.'
          })
        });
      })

    } catch (err) {
      res.status(422).send(err);
    }
  });

  // delete a Sprint
  app.delete('/api/sprints/:id', function (req, res) {
    try {
      Sprint.findById({ '_id': req.params.id }, function (err, Sprint) {
        if (err)
          res.status(422).send(err);

      }).remove().exec();
      res.json({
        success: true,
        message: 'Sprint deleted sucessfully.'
      })
    } catch (err) {
      res.status(422).send(err);
    }
  });

  // Comment ===
  // get all Comments
  app.get('/api/comments', function (req, res) {
    Comment.find(function (err, Comments) {
      if (err)
        res.status(400).send(err);

      res.json(Comments);
    })
  });

  // get Comments for an Issue
  app.get('/api/issues/:id/comments', function (req, res) {
    Comment.find({ 'issue': req.params.id }, function (err, Comments) {
      if (err)
        res.status(400).send(err);

      res.json(Comments);
    })
  });

  // get Comment by id
  app.get('/api/comments/:id', function (req, res) {
    try {
      Comment.findOne({ '_id': req.params.id }, function (err, Comment) {
        if (err)
          res.status(422).send(err);

        res.json(Comment);
      })
    } catch (err) {
      res.status(422).send(err);
    }
  });

  // add new Comment
  app.post('/api/comments', function (req, res) {
    try {
      new Comment({
        desc: req.body.desc,
        dateCreated: req.body.dateCreated || Date.now(),
        user: req.body.user,
        userFullName: req.body.userFullName,
        issue: req.body.issue
      }).save();

      res.json({
        success: true,
        message: 'New Comment added sucessfully.'
      })
    } catch (err) {
      res.status(422).send(err);
    }
  });

  // update a Comment
  app.put('/api/comments/:id', function (req, res) {
    try {
      Comment.findById({ '_id': req.params.id }, function(err, Comment){
        if (err)
          res.status(422).send(err);

        Comment.update({
          desc: req.body.desc,
          dateCreated: req.body.dateCreated,
          user: req.body.user,
          userFullName: req.body.userFullName,
          issue: req.body.issue
        }, function() {
          res.json({
            success: true,
            message: 'Comment updated sucessfully.'
          })
        });
      })

    } catch (err) {
      res.status(422).send(err);
    }
  });

  // delete a Comment
  app.delete('/api/comments/:id', function (req, res) {
    try {
      Comment.findById({ '_id': req.params.id }, function (err, Comment) {
        if (err)
          res.status(422).send(err);

      }).remove().exec();
      res.json({
        success: true,
        message: 'Comment deleted sucessfully.'
      })
    } catch (err) {
      res.status(422).send(err);
    }
  });

  // General ===
  app.get('*', function (req, res) {
    res.sendFile(__dirname + '/index.html');
  });

}
