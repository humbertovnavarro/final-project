require('dotenv/config');
const fs = require('fs');
const path = require('path');
const argon2 = require('argon2');
const authMiddleware = require('./auth-middleware');
const jwt = require('jsonwebtoken');
const db = require('./db');
const StreamKey = require('./lib/stream-key');
const ValidatedInput = require('./lib/validated-input');
module.exports = function routes(app) {

  app.get('/api/genkey', authMiddleware, (req, res, next) => {
    const userId = req.user.userId;
    const streamKey = new StreamKey(userId);
    const sql = `
      update "users" set "streamKey" = $1 where "userId" = $2;
    `;
    const params = [streamKey.key, userId];
    db.query(sql, params).then(data => {
      if (data.rows.length > 1) {
        res.status(500).json({ error: 'An unexpected error occured' });
        return;
      }
      const payload = {
        streamKey: `${userId}?k=${streamKey.key}`
      }
      res.json(payload);
    }).catch(err => {
      console.error(err);
      res.status(500).json({ error: 'An unexpected error occured' });
    });
  });

  app.get('/api/user', authMiddleware, (req, res, next) => {
    const userId = req.user.userId;
    const sql = `
      select "userId", "userName", "email", "color", "streamKey", "streamKeyExpires" from "users" where "userId" = $1;
    `;
    const params = [userId];
    db.query(sql, params).then(data => {
      const payload = data.rows[0];
      if(payload.streamKey) {
        payload.streamKey = `${req.user.userId}?k=${payload.streamKey}`;
      } else {
        payload.streamKey = '';
      }
      res.json(data.rows[0]);
    }).catch(err => {
      console.error(err);
      res.status(500).json({ error: 'An unexpected error occured' });
    });
  });

  app.post('/api/user/:field', authMiddleware, (req, res, next) => {
    const field = new ValidatedInput(req.params.field, req.body[req.params.field]);
    if (field.error) {
      res.status(400).json({ error: field.error });
      return;
    }
    const sql = `
      update "users" set "${req.params.field}" = $1 where "userId" = $2;
    `;
    const params = [field.value, req.user.userId];
    db.query(sql, params).then(data => {
      res.status(200).json({error: null});
      return;
    }).catch(err => {
      res.status(500).json({ error: 'An unexpected error occured' });
      console.error(err);
    });
  });

  app.get(['/channel/:name', 'c/:name', '/u/:name', '/user/:name'], (req, res, next) => {
    const sql = `
      select "userId" from "users" where LOWER("userName") = $1
    `;
    db.query(sql, [req.params.name.toLowerCase()])
      .then(data => {
        if (data.rows.length === 0) {
          res.redirect('/404');
        } else {
          res.redirect(`/#channel?channelId=${data.rows[0].userId}`);
        }
      });
  });

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

  app.get('/api/channel/:id/messages', (req, res, next) => {
    const sql = `
      select * from "messages" where "channelId" = $1 order by "createdAt" asc limit 100;
    `;
    const params = [Number.parseInt(req.params.id)];
    db.query(sql, params)
      .then(data => {
        res.json(data.rows);
      }
      ).catch(err => {
        console.error(err);
        res.status(500).json({ error: 'An unexpected error occured' });
      }
      );
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
    const userName = new ValidatedInput('userName', req.body.userName);
    const password = new ValidatedInput('password', req.body.password);
    const email = new ValidatedInput('email', req.body.email);
    if (userName.error) {
      res.status(400).json({ error: userName.error });
      return;
    }
    if (password.error) {
      res.status(400).json({ error: password.error });
      return;
    }
    if (email.error) {
      res.status(400).json({ error: email.error });
      return;
    }
    const sql = `
        select "userName" from "users" where LOWER("userName") = LOWER($1);
      `;
    const params = [userName.value];
    db.query(sql, params).then(data => {
      if (data.rows.length > 0) {
        res.status(400).json({ error: 'Username already taken' });
        return;
      }
      argon2.hash(password.value).then(hash => {
        const sql = `
          insert into "users" ("userName", "hash", "email", "color")
          values ($1, $2, $3, $4) returning "userId";
        `;
        const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        const params = [userName.value, hash, email.value, color];
        db.query(sql, params).then(data => {
          const encode = {
            userId: data.rows[0].userId
          };
          const token = jwt.sign(encode, process.env.TOKEN_SECRET);
          const payload = {
            userId: data.rows[0].userId,
            userName: userName.value,
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

  app.post('/api/login', (req, res, next) => {
    const password = req.body.password;
    const userName = req.body.userName;
    const sql = `
      select "userId", "userName", "hash", "color", "streamKeyExpires" from "users" where "userName" = $1;
    `;
    const params = [userName];
    db.query(sql, params)
      .then(data => {
        const { hash } = data.rows[0];
        argon2.verify(hash, password).then(match => {
          if (!match) {
            res.status(401).json({ error: 'Bad Login' });
            return;
          }
          const payload = data.rows[0];
          const token = jwt.sign({ userId: payload.userId }, process.env.TOKEN_SECRET);
          payload.token = token;
          res.status(200).json(payload);
        });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'An unexpected error occured' });
      });
  });
};
