/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import 'babel-polyfill';
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import expressGraphQL from 'express-graphql';
import jwt from 'jsonwebtoken';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import passport from './core/passport';
import schema from './data/schema';
import Router from './routes';
import assets from './assets';
import { port, auth, analytics } from './config';
import Promise from 'bluebird';
import pgPromise from 'pg-promise';

const initOptions = {
	promiseLib:Promise,
	connect: (client, dc, isFresh) => {
		const cp = client.connectionParameters;
		console.log('Connected to database:', cp.database);
	},
	disconnect: (client, dc) => {
		const cp = client.connectionParameters;
		console.log('Disconnecting from database:', cp.database);
	},
	query: e => {
		console.log('QUERY:', e.query);
	}
};
const pgp = pgPromise(initOptions);

const server = global.server = express();

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
server.use(express.static(path.join(__dirname, 'public')));
server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

//
// Authentication
// -----------------------------------------------------------------------------
server.use(expressJwt({
  secret: auth.jwt.secret,
  credentialsRequired: false,
  /* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
  getToken: req => req.cookies.id_token,
  /* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */
}));
server.use(passport.initialize());

//Adding Middleware
var credentials;
try{
	credentials = require('./credentials'); //CREATE THIS FILE YOURSELF
}catch(e){
	//heroku support
	credentials = require('./credentials_env');
}
//var connection  = mysql.createConnection(credentials);
//connection.connect();
var connection = pgp(credentials);
var apiRouter = require('./api/index.js')(express,connection);

server.use('/api', apiRouter);

//server.get('/login/facebook',
//  passport.authenticate('facebook', { scope: ['email', 'user_location'], session: false })
//);
//server.get("/api/test",(req,res)=>{
//	console.log("here in test")
//	res.send("ok you are in");
//})
//server.get('/login/facebook/return',
//  passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
//  (req, res) => {
//    const expiresIn = 60 * 60 * 24 * 180; // 180 days
//    const token = jwt.sign(req.user, auth.jwt.secret, { expiresIn });
//    res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
//    res.redirect('/');
//  }
//);

//
// Register API middleware
// -----------------------------------------------------------------------------
server.use('/graphql', expressGraphQL(req => ({
  schema,
  graphiql: true,
  rootValue: { request: req },
  pretty: process.env.NODE_ENV !== 'production',
})));

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
server.get('/*', async (req, res, next) => {
  try {
    let statusCode = 200;
    const template = require('./views/index.jade');
    const data = { title: '', description: '', css: '', body: '', entry: assets.main.js };

    if (process.env.NODE_ENV === 'production') {
      data.trackingId = analytics.google.trackingId;
    }

    const css = [];
    const context = {
      insertCss: styles => css.push(styles._getCss()),
      onSetTitle: value => (data.title = value),
      onSetMeta: (key, value) => (data[key] = value),
      onPageNotFound: () => (statusCode = 404),
    };

    await Router.dispatch({ path: req.path, query: req.query, context }, (state, component) => {
      data.body = ReactDOM.renderToString(component);
      data.css = css.join('');
    });

    res.status(statusCode);
    res.send(template(data));
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(pe.render(err)); // eslint-disable-line no-console
  const template = require('./views/error.jade');
  const statusCode = err.status || 500;
  res.status(statusCode);
  res.send(template({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '' : err.stack,
  }));
});


//
// Launch the server
// -----------------------------------------------------------------------------
server.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`The server is running at http://localhost:${port}/`);
});
