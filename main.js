var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
const upload = require("express-fileupload");
const app = express();
app.use(bodyParser.json());
app.use(upload());
app.use(express.static(path.join(__dirname, 'views')));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));

const port = 8000;


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/Resumeuploader.html'));
})


app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
})


app.post('/', function (req, res) {
  if(req.files){ 
    var file = req.files.myfile;
    var filename = file.name;
    file.mv("./resumes/"+filename,function(err){
      if(err){
        res.send(err);
      }
      else{
        res.send("File Uploaded...Thank You");
      }
    })
  }
  var uname = req.body.name;
  var num = req.body.number;
  var email = req.body.email;
  var birthday = req.body.birthday;
  var gender = req.body.gender;
  var interests = [];
  if (typeof req.body.bed !== 'undefined') {
    interests.push(req.body.bed);
  }
  if (typeof req.body.fed !== 'undefined') {
    interests.push(req.body.fed);
  }
  if (typeof req.body.fd !== 'undefined') {
    interests.push(req.body.fd);
  }
  if (typeof req.body.da !== 'undefined') {
    interests.push(req.body.da);
  }
 
  const MongoClient = require('mongodb').MongoClient;

  const url = "mongodb+srv://resumeuploader:BtucGx3VIR8MEmvk@resumeuploader.2ljze.mongodb.net/resumeuploader?retryWrites=true&w=majority";
  const client = new MongoClient(url, { useNewUrlParser: true });
  const dbName = "resumeuploader";
  client.connect(err => {
    if (err) console.log('failed to connect')
    else {
      console.log("Connected correctly to server");
      const db = client.db(dbName);

      // Use the collection "people"
      const col = db.collection("userdetails");

      let personDocument = {
        "name": uname,
        "number": num,
        "email": email,
        "birthday": birthday,
        "gender": gender,
        "jobinterests": interests
      }
      col.insertOne(personDocument);
    }

  });
});