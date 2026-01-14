const pool = require("./pool");
const bcrypt = require("bcryptjs");

const getUserByUsername = async (username) => {
  const { rows } = await pool.query(
    "SELECT * FROM mo_users WHERE username = $1",
    [username]
  );
  return rows[0];
};

const getUserById = async (userid) => {
  const { rows } = await pool.query("SELECT * FROM mo_users WHERE id = $1", [
    userid,
  ]);
  return rows[0];
};

const createNewUser = async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  await pool.query(
    "INSERT INTO mo_users (full_name,username,password) VALUES ($1, $2, $3)",
    [user.fullname, user.username, hashedPassword]
  );
};

const getAllPosts = async () => {
  const { rows } = await pool.query(`
    SELECT 
      mo_posts.*, 
      mo_users.username 
    FROM mo_posts 
    JOIN mo_users ON mo_posts.user_id = mo_users.id
    ORDER BY timestamp DESC
  `);
  return rows;
};

const createPost = async (post, userid) => {
  await pool.query(
    "INSERT INTO mo_posts (title,text,user_id) VALUES ($1,$2,$3)",
    [post.title, post.text, userid]
  );
};

const setMemberStatus = async (userid) => {
  await pool.query(
    "UPDATE mo_users SET membership_status = TRUE WHERE id = $1",
    [userid]
  );
};

const deletePost = async (postid) => {
  await pool.query("DELETE FROM mo_posts WHERE post_id = $1", [postid]);
};
module.exports = {
  getUserByUsername,
  getUserById,
  createNewUser,
  getAllPosts,
  createPost,
  setMemberStatus,
  deletePost,
};
