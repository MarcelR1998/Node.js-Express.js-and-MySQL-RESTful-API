//Basic node/express structure from Colt Steele Web developer boot camp
let mysql = require("mysql");
let express = require("express");
let bodyParser = require("body-parser");

//Create a file in root that looks like this: 
/* const myCredentials = {
    host: "<insert host here>",
    user: "<insert username here>",
    password: "<insert password here>",
    database: "<insert database here>",
}
module.exports = myCredentials; */
let myCredentials = require("./authCredentials");

//https://www.youtube.com/watch?v=EN6Dx22cPRI
const db = mysql.createConnection({
    host: myCredentials.host,
    user: myCredentials.user,
    password: myCredentials.password,
    database: myCredentials.database,
});
/* Port: 3306 */

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("MySql connected...")
});

let app = express();

//https://www.youtube.com/watch?v=rin7gb9kdpk&t=353s
let urlencodedParser = bodyParser.urlencoded({ extended: true })

//Learned about serving static content with express
//https://alligator.io/nodejs/serving-static-files-in-express/
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.sendFile("index.html");
});

//Creates table in database
app.get("/createpoststable", (req, res) => {
    let sql = "CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY(id))";
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({ success: true, message: 'Posts table created' });
    })
});

//Adds post in database, with param as title
app.get("/addpost/:title", (req, res) => {
    let post = { title: `${req.params.title}`, body: "This is a post" }
    let sql = "INSERT INTO posts SET ?";
    let query = db.query(sql, post, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({ success: true, message: 'Post added' });
    });
});

//Gets all posts from database
app.get("/getposts", (req, res) => {
    let sql = "SELECT * FROM posts";
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.send({ success: true, message: 'Posts updated' });
    });
});

//Gets a specified post from database
app.get("/getpost/:id", (req, res) => {
    let sql = `SELECT * FROM posts WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({ success: true, message: 'Post fetched' });
    });
});

//Updates specified post in database
app.get("/updatepost/:id", (req, res) => {
    let newTitle = "Updated Title";
    let sql = `UPDATE posts SET title = '${newTitle}' WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({ success: true, message: 'Post updated' });
    });
});

//Deletes specified post in database
app.get("/deletepost/:id", (req, res) => {
    let sql = `DELETE FROM posts WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({ success: true, message: 'Post deleted' });
    });
});

let count = 0;

// GET show - visar räknarean i json
app.get("/api/show", (req, res) => {
    res.json({ counter: count });
});

// GET add - plussar på ett, talar om att det gick bra som json
app.get("/api/add", (req, res) => {
    let oldCount = count;
    count++;
    if (count > oldCount) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
})

//Outputs random number between 0 and 1023
app.get("/api/random", (req, res) => {
    let randNum = Math.floor(Math.random() * 1023);
    //Learned about returning JSON through this video
    //https://www.youtube.com/watch?v=vjf774RKrLc
    res.json({ number: randNum });
});

//Outputs random number between 0 and user input
app.get("/api/custom_random/:num", (req, res) => {
    let maxNum = req.params.num;
    let randNum = Math.floor(Math.random() * maxNum);
    res.json({ number: randNum });
});

//Handles post route
app.post("/countVowels", urlencodedParser, (req, res) => {
    let myString = req.body["string"];
    //res.send("The passed string contains " + getVowels(myString) + " vowels.");
    res.send({ vowels: getVowels(myString) });
});

//Server to port 3000, and logs if success
app.listen(3000, () => {
    console.log("Server is up and running on port 3000")
});

//counts vowels in passed string
//https://stackoverflow.com/a/29450463
getVowels = (str) => {
    var m = str.match(/[aeiou]/gi);
    return m === null ? 0 : m.length;
}
