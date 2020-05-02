const users = [];

exports.addUser = (userId) => {
  users.push(userId);
  return users;
};

exports.removeUser = (userId) => {
  const index = users.indexOf(userId);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

exports.getUsers = () => users;
