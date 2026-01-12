const pool = require("./pool");

const getUserByUsername = async (username) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return rows[0];
};

const getUserById = async (userid) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
    userid,
  ]);
  return rows[0];
};

module.exports = { getUserByUsername, getUserById };
