#! /usr/bin/env node

const { Client } = require("pg");
require("dotenv").config();

const SQL = `
CREATE TABLE mo_users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL, 
    membership_status BOOLEAN DEFAULT FALSE
);


CREATE TABLE mo_posts (
    post_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    text TEXT NOT NULL,
    user_id INTEGER REFERENCES mo_users(id) ON DELETE CASCADE
);


INSERT INTO mo_users (full_name, username, password, membership_status)
VALUES 
    ('John Doe', 'johnd', 'hash_secret_123', TRUE),
    ('Jane Smith', 'janes', 'hash_secret_456', FALSE),
    ('Admin User', 'admin', 'hash_secret_789', TRUE);


INSERT INTO mo_posts (title, text, user_id)
VALUES 
    ('Welcome to the Club', 'This is the very first post on our exclusive board.', 1),
    ('Secret Recipe', 'The secret ingredient is actually... nutmeg.', 1),
    ('Hello World', 'Just testing if I can post here without membership.', 2),
    ('Admin Announcement', 'Please remember to be kind in the comments.', 3);`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
