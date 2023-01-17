exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.operatorBoard = (req, res) => {
  res.status(200).send("Operator Content.");
};

exports.setting = (req, res) => {
  res.status(200).send("Setting Content.");
};

exports.log = (req, res) => {
  res.status(200).send("Logs Content.");
};