const express = require("express");
const cors = require("cors");

const app = express();

var bcrypt = require("bcryptjs");

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Role = db.role;
const User = db.user;
const Op = db.Sequelize.Op;

db.sequelize.sync();
// force: true will drop the table if it already exists
db.sequelize.sync({ force: false }).then(() => {
  createRoles();
  registerDefaultUsers();
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function createRoles() {
  let roles = [
    {
      id: 1,
      name: "admin"
    },
    {
      id: 2,
      name: "operator"
    },
    {
      id: 3,
      name: "user"
    }
  ];

  roles.forEach(role => {
    Role.findOne({
      where: {
        name: role.name
      }
    })
      .then(roleExist => {
        if (roleExist == null) {

          Role.create({
            id: role.id,
            name: role.name
          });

          console.log({ message: `Create role ${role.name} successfully!` })
        }
      });
  });
}

function registerDefaultUsers() {
  let users = [
    {
      username: "admin",
      email: "admin@outlook.com",
      password: "12345678",
      roles: ["admin", "operator"]
    },
    {
      username: "operator",
      email: "operator@outlook.com",
      password: "12345678",
      roles: ["operator"]
    },
    {
      username: "user",
      email: "user@outlook.com",
      password: "12345678",
      roles: ["user"]
    }
  ]

  users.forEach(async user => {

    // find if already create users
    var userExist = await User.findOne({
      where: {
        username: user?.username ?? ""
      }
    });

    if (userExist == null) {

      console.log("user", user);

      User.create({
        username: user?.username ?? "",
        email: user.email,
        password: bcrypt.hashSync(user.password, 8)
      })
        .then(userCreated => {
          if (user.roles) {
            Role.findAll({
              where: {
                name: {
                  [Op.or]: user.roles
                }
              }
            }).then(roles => {
              userCreated.setRoles(roles).then(() => {
                console.log({ message: `User ${user.name} registered successfully!` });
              });
            });
          } else {
            // user role = 3
            userCreated.setRoles([3]).then(() => {
              console.log({ message: `User ${user.name} registered successfully!` });
            });
          }
        })
        .catch(err => {
          throw err
        });
    }

  });
}