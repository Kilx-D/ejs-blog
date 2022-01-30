//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const { lowerCase } = require("lodash");
const mongoose = require("mongoose");
//sets up required packages for project


//connects to the database
mongoose.connect("mongodb://localhost:27017/BlogDB");

//the way data entries to the database should look like
const PostSchema = {
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  creationDate: String
}

//use the above object as a standard for data entries
const Post = mongoose.model("Post", PostSchema);


//a few sample text
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

//sets up the express package for making requests
const app = express();

//makes the back end able to use ejs to represent data to web pages
app.set('view engine', 'ejs');


//makes it able to retrieve data from html forms
app.use(bodyParser.urlencoded({ extended: true }));

//makes web pages able to have external assets like javaascript and css
app.use(express.static("public"));




//what to do when receiving a get request, sends the home page
app.get("/", function (req, res) {


  Post.find({}, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      //renders the home page, including the sample text and the collection of posts
      //the string is the name of the file thats gonna be rendered
      //while the object is the data that will be represented in the page
      res.render("home", { homeText: homeStartingContent, postCollection: results });

    }

  })





})


//what to do when a user makes a get request to a individual post page
//the :post is a variable of the independent page, whatever that page would be
app.get("/posts/:post", function (req, res) {

  Post.findOne({_id: req.params.post}, (err, entry) => {
    console.log(entry);
    res.render("post", { postTitle: entry.title, postBody: entry.body });
  })



  // //cycles through the post collection looking for the post specified in the url
  // posts.forEach(x => {
  //   //if the post is found, the post is then rendered in a page
  //   if (lodash.lowerCase(x.title) === lodash.lowerCase(req.params.post)) {
      
  //   }
  // });

});


//shows the about page, just renders the sample text
app.get("/about", function (req, res) {
  res.render("about", { aboutText: aboutContent });
})

//shows the contact page, also shows sample text
app.get("/contact", function (req, res) {
  res.render("contact", { contactText: contactContent });
})


//shows a page where a user can create their own posts
app.get("/compose", function (req, res) {
  res.render("compose");
})

//an easer egg when the user visits the sexy page of the website
app.get("/sexy", function (req, res) {
  res.render("sexy");
})

//when the user creats a new post and makes a post request to the website
app.post("/compose", function (req, res) {
  //gathers data from post data
  let postBody = req.body.post;
  let postTitle = req.body.title;

  //easter egg that if a user types sexy, they're redirected to a special page
  if (postTitle == "hey sexy ;)") {
    res.redirect("/sexy");
    return 0;
  }

  //makes a new data object to show the date
  const today = new Date();

  //how the date should be formated
  const options = {
    
    day: "numeric",
    month: "long",
    year: "numeric"
  };

  //sets the date to be formated as shown above
  const date = today.toLocaleDateString("en-US", options);

  //sets and formats the data to be sent to the database
  //the "new Post" is the collection/document the data will be sent to
  const post = new Post({
    title: postTitle,
    body: postBody,
    creationDate: date
  });

  //saves the data to the database
  post.save((err) => {
    if(!err){
      //redirects the user to the home page
      res.redirect("/")
    }
  });

})


//sets the server up to listen at port 3000
app.listen(3000, function () {
  console.log("Server started on port 3000");
});