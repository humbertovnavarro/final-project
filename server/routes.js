const ClientError = require('./client-error');
const fs = require('fs');
const path = require('path');
module.exports = function routes(app, db) {
  app.get('/api/channel/:id', (req, res, next) => {
    const id = Number.parseInt(req.params.id);
    if (id < 0 || Number.isNaN(id)) {
      throw new ClientError(400, 'Invalid user id');
    }
    fs.stat(path.join(__dirname, `/public/live/${id}.mpd`), stat => {
      const isLive = !stat;
      const sql = `
        select "userName" as "channelName" from "users" where "userId" = $1;
      `;
      const params = [id];
      db.query(sql, params)
        .then(data => {
          const payload = data.rows[0];
          payload.isLive = isLive;
          res.json(payload);
        }).catch(err => next(err));
    });
  });

  app.get('/api/channels/live', (req, res, next) => {
    const limit = 10;
    const offset = Number.parseInt(req.body.offset) || 1;
    if (offset <= 0 || Number.isNaN(offset)) {
      throw new ClientError(400, 'Invalid offset');
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
      ).catch(err => next(err));
  });


  app.post('/api/channels/query', (req, res, next) => {
    const offset = Number.parseInt(req.params.offset) || 1;
    if (offset <= 0 || Number.isNaN(offset)) {
      throw new ClientError(400, 'Invalid offset');
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
      ).catch(err => { console.error(err); });
  });
};
