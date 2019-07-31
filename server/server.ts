import path from 'path';
import express from 'express';
import expressGraphQL from 'express-graphql';
import mongoose from 'mongoose';
import './models';
import { apolloUploadExpress } from 'apollo-upload-server';
import bodyParser from 'body-parser';
import schema from './schema/schema';
import session from 'express-session';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import passport from 'passport';
import uuid from 'uuid/v4';
import LocalStrategy from 'passport-local';
import SessionFileStore from 'session-file-store';
const FileStore = SessionFileStore(session);

const app = express();

const MONGO_URI =
  'mongodb+srv://vikrant17:tnarkiv17@cluster0-ocli4.mongodb.net/social-app?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, { useNewUrlParser: true });
mongoose.connection
  .once('open', () => console.log('Connection with MongoDB is established'))
  .on('error', (e: any) => console.log('Error connecting to MongoDB', e));

const User = mongoose.model('User');
const Post = mongoose.model('Post');

passport.use(
  new LocalStrategy.Strategy(
    { usernameField: 'email', passwordField: 'password' },
    function(email: String, password: String, done: Function) {
      User.findOne({ email }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: 'Incorrect email.' });
        }
        // if (!user.validPassword(password)) {
        //   return done(null, false, { message: 'Incorrect password.' });
        // }
        return done(null, user);
      });
    }
  )
);

passport.serializeUser((user: { id: String }, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: String, done) => {
  const user = await User.findById(id);
  done(null, user);
});

app.use('/', express.static(path.join(__dirname, '..', 'dist')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: 'cats',
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
    cookie: {
      maxAge: 86400000
    },
    genid: () => uuid()
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ auth: true });
});

app.post('/register', async (req, res, next) => {
  const { username, email, password } = req.body;

  const user = new User({ username, email, password });
  const savedUser: any = await user.save();

  req.login(savedUser, err => {
    if (err) {
      next(err);
    }
    res.json({ auth: true, username: savedUser.username });
  });
});

app.get('/uploads/:id', async (req, res) => {
  const id = req.params.id;

  const post: any = await Post.findById(id);

  if (post && post.image) {
    res.send(post.image.file);
  } else res.send('no image');
});

app.get('/profileImage/:id', async (req, res) => {
  const id = req.params.id;

  console.log(id);
  let user: any;
  if (id === 'me') user = await User.findById(req.user.id);
  else user = await User.findById(id);

  if (user && user.profileImage) {
    res.send(user.profileImage.file);
  } else res.send('no image');
});

app.get('/coverImage/:id', async (req, res) => {
  const id = req.params.id;

  console.log(id);
  let user: any;
  if (id === 'me') user = await User.findById(req.user.id);
  else user = await User.findById(id);

  if (user && user.profileCover) {
    res.send(user.profileCover.file);
  } else res.send('no image');
});

app.get('/login', (req, res) => {
  if (!req.isAuthenticated()) return res.json({ auth: false });
  res.json({ auth: true, username: req.user.username });
});

app.get('/logout', (req, res) => {
  req.logout();
  res.send('logged out');
});

app.use(
  '/graphql',
  apolloUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  expressGraphQL({
    schema,
    graphiql: true
  })
);

const ws = createServer(app);

ws.listen(3000, () => {
  console.log('Server is running on port 3000...');

  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema
    },
    {
      server: ws,
      path: '/subscriptions'
    }
  );
});
