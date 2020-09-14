const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');
const _ = require('lodash');
//Connect to database server.
mongoose.connect('mongodb+srv://new-admin:*******@cluster0.ad3uw.mongodb.net/todolistDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//ASSIGNING APP
const app = express();

//HELPING VARIABLE
const listSchema = new mongoose.Schema({
  name: String
})

const lists = new mongoose.Schema({
  name :String,
  type : [listSchema]
})
const Items = mongoose.model("list", listSchema);
const List = mongoose.model("item", lists);
//ASSIGNING APP TO IMPORTED NPM PACKAGES
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const item1 = new Items({
  name: "Mengaji"
})
const item2 = new Items({
  name: "Shalat"
})
const item3 = new Items({
  name: "Makan"
})
const newItem = [];
const defaultItems = [item1, item2, item3];
//SETTING GETS METHOD TO ROOT ROUTE



app.get("/", function(req, res) {

  console.log(res.statusCode);
  let days = date.getDate();

  Items.find({}, function(err, result) {
      if (result.length === 0) {
        Items.insertMany(defaultItems, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Succesfully added to our database, boss.");

          }
        });
        res.redirect('/');
      } else {
        res.render('list', {
            worklist: "Today",
            newlist: result


      });
    }

  });
});

app.get('/:userreq/', function(req,res){
  const userreq = _.capitalize(req.params.userreq);


  List.findOne({name: {$eq: userreq}}, function(err, result){
    if(!err){
      if(!result){

        const userItem = new List({
          name : userreq,
          type : defaultItems
        });

        userItem.save();
        res.redirect('/'+userreq);
      }else{
        res.render('list', {worklist: result.name, newlist: result.type});
      }
    }
  })
})

app.post('/delete', function(req,res){
  const deletedItemChecked = req.body.checkbox;
  const hiddenInput = req.body.itemInput;

  if(hiddenInput === "Today"){
    Items.findByIdAndRemove(deletedItemChecked, function(err){
      res.redirect('/');
    })
  } else {
    List.findOneAndUpdate({name: hiddenInput}, {$pull: {type: {_id: deletedItemChecked}}}, function(err, found){
      if(!err){
        res.redirect('/'+hiddenInput);
      }
    })

  }

})

app.post('/', function(req, res) {
  const isi = req.body.item;
  const click = req.body.list;
  const item = new Items({
    name: isi
  });
  if (click === "Today"){
    item.save();
    res.redirect('/');
  } else {
    List.findOne({name: click}, function(err, found){
      found.type.push(item);
      found.save();
      res.redirect('/'+ click);
    })
  }



});


app.listen(3000, function() {
  console.log('To do list running ...');
});
