const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const app = express();
const accounts = {};

app.use(session({
  secret: crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
}));

app.use(express.json());
app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({ extended: false }));

app.get('/account', (req, res) => {
  if (!req.session.username)
    return res.redirect("/login");
  res.sendFile(__dirname + "/static/account.html");
});

app.get('/logout', (req, res) => {
  req.session.username = null;
  return res.redirect("/message?msg=logged+out&path=.");
});

app.get('/user', (req, res) => {
  if (!req.session.username)
    return res.json({});
  const { username, userkey } = accounts[req.session.username];
  res.json({ username, userkey });
});

app.post('/notes', (req, res) => {
  if (!req.session.username)
    return res.json({});
  const { key, note } = req.body;
  const { username, userkey } = accounts[req.session.username];
  if (key != userkey) return res.json({});
  if (note)
    accounts[req.session.username].notes = note;
  const { notes } = accounts[req.session.username];
  res.json({ notes });
});

app.get('/login', (req, res) => {
  if (req.session.username)
    return res.redirect("/account");
  res.sendFile(__dirname + "/static/login.html");
});

app.get('/message', (req, res) => {
  res.sendFile(__dirname + "/static/message.html");
});

app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.redirect("/message?msg=please+fill+in+the+stuff&path=login");
  if (!/^[\w.-]{4,16}$/.test(username)) return res.redirect("/message?msg=bad+username&path=login");
  const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
  const account = accounts[username];
  if (account)
    return res.redirect("/message?msg=account+already+exists&path=login");
  accounts[username] = {
    username: username,
    password: passwordHash,
    userkey: crypto.randomBytes(32).toString('hex'),
    notes: "",
  }
  req.session.username = username;
  return res.redirect("/message?msg=account+created&path=account");
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.redirect("/message?msg=please+fill+in+the+stuff&path=login");
  const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
  const account = accounts[username];
  if (!account || !account?.password)
    return res.redirect("/message?msg=account+does+not+exist&path=login");
  if (account.password !== passwordHash)
    return res.redirect("/message?msg=wrong+password&path=login");
  req.session.username = username;
  return res.redirect("/account");
});

module.exports = { app, accounts };