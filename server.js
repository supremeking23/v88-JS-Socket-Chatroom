const EXPRESS = require("express");
const APP = EXPRESS();
const PORT = 9000;
const SERVER = APP.listen(PORT, (req, res) => {
	console.log(`server is listening to port ${PORT}`);
});
const IO = require("socket.io")(SERVER);
let session = require("express-session");

// const { v4: uuidv4 } = require("uuid");

// for image/js/css
APP.use(EXPRESS.static(__dirname + "/static"));
// This sets the location where express will look for the ejs views
APP.set("views", __dirname + "/views");
// Now lets set the view engine itself so that express knows that we are using ejs as opposed to another templating engine like jade
APP.set("view engine", "ejs");
// use app.get method and pass it the base route '/' and a callback

// APP.use(
// 	session({
// 		secret: "secret",
// 		resave: false,
// 		saveUninitialized: true,
// 		cookie: { maxAge: 600000 },
// 	})
// );
const setBg = () => {
	const randomColor = Math.floor(Math.random() * 16777215).toString(16);
	return randomColor;
};

let users = [];
IO.on("connection", function (socket) {
	console.log(`a user is connected`);
	socket.on("got_a_new_user", function (data) {
		let user = {
			name: data.user,
			socket_id: socket.id,
			background: `#${setBg()}`,
		};

		users.push(user);

		socket.emit("new_user", { users: users });
		socket.broadcast.emit("new_user", { users: users });
	});

	socket.on("disconnect", function () {
		console.log(`a user is disconnected`);
		// console.table(socket);
		users = users.filter((user) => user.socket_id != socket.id);
		socket.emit("remove_user", { users: users });
		socket.broadcast.emit("remove_user", { users: users });
	});

	socket.on("leave", function () {
		console.log(`a user leave the socket`);
	});
});

APP.get("/", (req, res) => {
	res.render("index");
});

// APP.listen(PORT, (req, res) => {
// 	console.log(`Server is listening to ${PORT}`);
// });
