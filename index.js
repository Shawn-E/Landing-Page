// Basic Imports
const config = require("./config.js");
const express = require("express");
const app = express();
const chalk = require('chalk');

// MySQL Setup
// const mysql = require('mysql');
// config.sql.charset = "utf8mb4";
// let con = 0; // set = 0 to disable

// Backend Initialization
const backend = require('./backend.js');
backend.init(app);

// Discord Login Passport
// const passport = require('passport');
// const DiscordStrategy = require('passport-discord-faxes').Strategy;
// passport.serializeUser(function(user, done) { done(null, user) });
// passport.deserializeUser(function(obj, done) { done(null, obj) });
// passport.use(new DiscordStrategy({
//     clientID: config.discord.oauthId,
//     clientSecret: config.discord.oauthToken,
//     callbackURL: `${(config.domain.endsWith('/') ? config.domain.slice(0, -1) : config.domain)}/auth/discord/callback`,
//     scope: ['identify', 'guilds', 'email'],
//     prompt: 'consent'
// }, function(accessToken, refreshToken, profile, done) {
//     process.nextTick(function() {
//         return done(null, profile);
//     });
// }));

// Pages
app.get('', async function(req, res) {
    res.render('index.ejs', { });
});

app.get('/experience', async function(req, res) {
  res.render('experience.ejs', { });
});

app.get('/skills', async function(req, res) {
  res.render('skills.ejs', { });
});

app.get("/interests", async function (req, res) {
  res.render("interests.ejs", {});
});

app.get("/projects", async function (req, res) {
  res.render("projects.ejs", {});
});

app.get("/contact", async function (req, res) {
  res.render("contact.ejs", {});
});

//Temp Pages
app.get("/bugs", async function (req, res) {
    var submitted = req.query.msg || "false"
    // var amsg;
    // if (!msg) { 
    //   amsg = "NONE"
    // } else {
    //   amsg = msg
    // }
  res.render("bugs.ejs", { good: submitted });
});

// Staff Routing
// app.get("/staff", async function (req, res) {
//   res.render("staff.ejs", {});
// });

// Forms
app.post("/backend/forms/contact/submit", async function (req, res) {

  let { email, name, subject, message } = req.body;

  const { EmbedBuilder, WebhookClient } = require("discord.js");
  const webhookClient = new WebhookClient({
    id: "1003390083703001198",
    token:
      "aRSw5xa1iPc1-pD0-_Tdu1qdC9ZOSiZsMoMD73sEqpOAmJZ4F_vubskQzssIGxn0E-vZ",
  });

  const embed = new EmbedBuilder()
    .setTitle("New Message From " + name)
    .setColor(0x00ffff)
    .setDescription(
      `**Subject: **\`${subject}\`\n**Message**\n\`\`\`${message}\`\`\`\n**Email: **\`${email}\``
    );

  webhookClient.send({
    content: "<@668497496124686347>",
    username: "Contact Form - " + name,
    avatarURL: "https://store.shawnengmann.com/assets/logo.png",
    embeds: [embed],
  });

  res.redirect("/contact");
});

app.post("/backend/forms/bug/submit", async function (req, res) {
  let { email, page, bug, steps, add } = req.body;

  const { EmbedBuilder, WebhookClient } = require("discord.js");
  const webhookClient = new WebhookClient({
    id: "1003390083703001198",
    token:
      "aRSw5xa1iPc1-pD0-_Tdu1qdC9ZOSiZsMoMD73sEqpOAmJZ4F_vubskQzssIGxn0E-vZ",
  });

  const embed = new EmbedBuilder()
    .setTitle("New Bug Report")
    .setColor(0x00ffff)
    .setDescription(
      `**Page:** ${page}\n**Bug:** ${bug}\n**Steps to Reproduce:** ${steps}\n**Additional Info:** ${add}`
    );

  webhookClient.send({
    content: "<@668497496124686347>",
    username: "Bug Report - " + email,
    avatarURL: "https://store.shawnengmann.com/assets/logo.png",
    embeds: [embed],
  });

  res.redirect("/bugs?submitted=true ");
});



// app.get('/account', backend.checkAuth, async function(req, res) {
//     res.render('account.ejs', { user: req.session.passport.user });
// });

// app.get('/discorduserdata', backend.checkAuth, async function(req, res) {
//     res.type('json').send(JSON.stringify(req.session.passport.user, null, 4) + '\n');
// });

// app.get('/auth/discord', passport.authenticate('discord'));
// app.get('/auth/discord/callback', passport.authenticate('discord', {failureRedirect: '/'}), async function(req, res) {
//     req.session?.loginRef ? res.redirect(req.session.loginRef) : res.redirect('/');
//     delete req.session?.loginRef
// });

// MAKE SURE THIS IS LAST FOR 404 PAGE REDIRECT
app.get('*', function(req, res){
    res.render('404.ejs');
});


// Server Initialization
app.listen(config.port)
console.log(chalk.blue('ExpressJS Web Application Started on Port ' + config.port));

// Rejection Handler
process.on('unhandledRejection', (err) => { 
    if(config.debugMode) console.log(chalk.red(err));
});
