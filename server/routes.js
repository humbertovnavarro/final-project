require('dotenv/config');
const fs = require('fs');
const path = require('path');
const StreamKey = require('./stream-key');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
module.exports = function routes(app, db) {
  app.get('/api/channel/:id', (req, res, next) => {
    const id = Number.parseInt(req.params.id);
    if (id < 0 || Number.isNaN(id)) {
      res.json({ error: 'Invalid user id' });
      return;
    }
    fs.stat(path.join(__dirname, `/public/live/${id}.mpd`), stat => {
      const isLive = !stat;
      const sql = `
        select "userName" as "channelName" from "users" where "userId" = $1;
      `;
      const params = [id];
      db.query(sql, params)
        .then(data => {
          if (data.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
          }
          const payload = data.rows[0];
          payload.isLive = isLive;
          res.json(payload);
        }).catch(err => {
          console.error(err);
          res.status(500).json({ error: 'An unexpected error occured' });
        });
    });
  });

  app.get('/api/channels/live/:offset?', (req, res, next) => {
    const limit = 10;
    const offset = Number.parseInt(req.params.offset) || 1;
    if (offset <= 0 || Number.isNaN(offset)) {
      res.status(400).json({ error: 'Invalid offset' });
      return;
    }
    const sql = `
    select "userId" as "channelId", "userName" as "channelName", "isLive", "viewers" from "users" left join "streams"
    on "users"."userId" = "streams"."channelId"
    where "isLive" = true
    order by "streams"."viewers" desc offset $1 limit $2;
    `;
    db.query(sql, [offset * limit - limit, offset + limit])
      .then(data => {
        res.json(data.rows);
      }
      ).catch(err => {
        console.error(err);
        res.status(500).json({ error: 'An unexpected error occured' });
      });
  });

  app.post('/api/channels/query', (req, res, next) => {
    const offset = Number.parseInt(req.params.offset) || 1;
    if (offset <= 0 || Number.isNaN(offset)) {
      res.status(400).json({ error: 'Invalid offset' });
      return;
    }
    const query = req.body.query;
    const sql = `
    select "userId" as "channelId", "userName" as "channelName", "isLive", "viewers" from "users" left join "streams"
    on "users"."userId" = "streams"."channelId"
    where "userName" like $1
    order by "isLive", "streams"."viewers" desc;
    `;
    const params = [`%${query}%`];
    db.query(sql, params)
      .then(data => {
        res.json(data.rows);
      }
      ).catch(err => {
        console.error(err);
        res.status(500).json({ error: 'An unexpected error occured' });
      });
  });

  app.post('/api/register', (req, res, next) => {
    if (!req.body.userName || !req.body.password || !req.body.email) {
      res.json({ error: 'Missing username, password, or email' });
      return;
    }
    const invalidUserName = /[^a-zA-Z0-9_]/.test(req.body.userName);
    if (invalidUserName) {
      res.json({ error: 'Invalid username, usernames may only contain letters and numbers' });
      return;
    }
    const sql = `
        select "userName" from "users" where LOWER("userName") = LOWER($1);
      `;
    const params = [req.body.userName];
    db.query(sql, params).then(data => {
      if (data.rows.length > 0) {
        res.status(400).json({ error: 'Username already taken' });
        return;
      }
      argon2.hash(req.body.password).then(hash => {
        const streamKey = new StreamKey();
        const sql = `
          insert into "users" ("userName", "hash", "email", "streamKey")
          values ($1, $2, $3, $4) returning "userId";
        `;
        const params = [req.body.userName, hash, req.body.email, streamKey.hash];
        db.query(sql, params).then(data => {
          const encode = {
            userId: data.rows[0].userid,
            streamKey: streamKey.key,
            streamKeyExpires: streamKey.expires
          };
          const token = jwt.sign(encode, process.env.TOKEN_SECRET);
          const payload = {
            token: token
          };
          res.json(payload);
        });
      });
    })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'An unexpected error occured' });
      });
  });

};
