"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const express_graphql_1 = __importDefault(require("express-graphql"));
const mongoose_1 = __importDefault(require("mongoose"));
require("./models");
const apollo_upload_server_1 = require("apollo-upload-server");
const body_parser_1 = __importDefault(require("body-parser"));
const schema_1 = __importDefault(require("./schema/schema"));
const express_session_1 = __importDefault(require("express-session"));
const graphql_1 = require("graphql");
const http_1 = require("http");
const subscriptions_transport_ws_1 = require("subscriptions-transport-ws");
const passport_1 = __importDefault(require("passport"));
const v4_1 = __importDefault(require("uuid/v4"));
const passport_local_1 = __importDefault(require("passport-local"));
const session_file_store_1 = __importDefault(require("session-file-store"));
const FileStore = session_file_store_1.default(express_session_1.default);
const app = express_1.default();
const MONGO_URI = 'mongodb+srv://vikrant17:tnarkiv17@cluster0-ocli4.mongodb.net/social-app?retryWrites=true&w=majority';
mongoose_1.default.connect(MONGO_URI, { useNewUrlParser: true });
mongoose_1.default.connection
    .once('open', () => console.log('Connection with MongoDB is established'))
    .on('error', (e) => console.log('Error connecting to MongoDB', e));
const User = mongoose_1.default.model('User');
const Post = mongoose_1.default.model('Post');
passport_1.default.use(new passport_local_1.default.Strategy({ usernameField: 'email', passwordField: 'password' }, function (email, password, done) {
    User.findOne({ email }, function (err, user) {
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
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(this, void 0, void 0, function* () {
    const user = yield User.findById(id);
    done(null, user);
}));
app.use('/', express_1.default.static(path_1.default.join(__dirname, '..', 'dist')));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(express_session_1.default({
    secret: 'cats',
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
    cookie: {
        maxAge: 86400000
    },
    genid: () => v4_1.default()
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.post('/login', passport_1.default.authenticate('local'), (req, res) => {
    res.json({ auth: true });
});
app.post('/register', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    const savedUser = yield user.save();
    req.login(savedUser, err => {
        if (err) {
            next(err);
        }
        res.json({ auth: true, username: savedUser.username });
    });
}));
app.get('/uploads/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const id = req.params.id;
    const post = yield Post.findById(id);
    if (post && post.image) {
        res.send(post.image.file);
    }
    else
        res.send('no image');
}));
app.get('/profileImage/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const id = req.params.id;
    console.log(id);
    let user;
    if (id === 'me')
        user = yield User.findById(req.user.id);
    else
        user = yield User.findById(id);
    if (user && user.profileImage) {
        res.send(user.profileImage.file);
    }
    else
        res.send('no image');
}));
app.get('/coverImage/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const id = req.params.id;
    console.log(id);
    let user;
    if (id === 'me')
        user = yield User.findById(req.user.id);
    else
        user = yield User.findById(id);
    if (user && user.profileCover) {
        res.send(user.profileCover.file);
    }
    else
        res.send('no image');
}));
app.get('/login', (req, res) => {
    if (!req.isAuthenticated())
        return res.json({ auth: false });
    res.json({ auth: true, username: req.user.username });
});
app.get('/logout', (req, res) => {
    req.logout();
    res.send('logged out');
});
app.use('/graphql', apollo_upload_server_1.apolloUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }), express_graphql_1.default({
    schema: schema_1.default,
    graphiql: true
}));
const ws = http_1.createServer(app);
ws.listen(3000, () => {
    console.log('Server is running on port 3000...');
    new subscriptions_transport_ws_1.SubscriptionServer({
        execute: graphql_1.execute,
        subscribe: graphql_1.subscribe,
        schema: schema_1.default
    }, {
        server: ws,
        path: '/subscriptions'
    });
});
