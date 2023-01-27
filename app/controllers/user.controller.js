exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send(JSON.stringify(managementData));
};

exports.operatorBoard = (req, res) => {
  res.status(200).send(JSON.stringify(managementData));
};

exports.setting = (req, res) => {
  res.status(200).send(JSON.stringify(settingData));
};

exports.log = (req, res) => {
  res.status(200).send(JSON.stringify(logData));
};

var settingData = {
  "user" : [
    {
      "name" : "user 1",
      "role" : "operator"
    },
    {
      "name" : "user 2",
      "role" : "admin"
    }
  ],
  "device" : [
    {
      "name" : "device 1",
      "type" : "type 1"
    },
    {
      "name" : "device 2",
      "type" : "type 2"
    }
  ],
  "api" : [
    {
      "name" : "api 1",
      "data" : "data 1"
    }
  ]
};

var logData = [
  "message 1",
  "message 2",
  "message 3",
  "message 4"
];

var managementData = {
  "description" : "Test description bla bla bla bla bla bla",
  "logs" : logData
}