require('dotenv').config();
require('colors');

const express = require('express');
const mysql = require('mysql2');

const connection = mysql.createConnection({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
});

const PORT = process.env.PORT || 5000;
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	let count;
	const q = 'SELECT COUNT(*) AS count FROM users;';
	connection.query(q, (err, results) => {
		if (err) throw err;
		count = results[0].count;
		res.render('home', { data: count });
	});
});

app.post('/register', (req, res) => {
	const person = {
		email: req.body.email,
	};
	connection.query(
		'INSERT INTO users SET ? ',
		person,
		(err, results) => {
            if (err) throw err;
            res.redirect("/");
		}
	);
});

app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`.blue);
});
