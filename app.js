var bodyParser  = require('body-parser'),
    methodOverride = require('method-override'),
    expressSanitizer = require('express-sanitizer'),
    mongoose    = require('mongoose'),
    express     = require('express'),
    app         = express();

mongoose.connect("mongodb://localhost:27017/restful_blog_app", {useNewUrlParser: true, useUnifiedTopology: true});
app.set('view engine', "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(expressSanitizer());
 
//creating a schema MONGOOSE/MODEL config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    caption: String,
    body: String,
    created: {type: Date, default: Date.now}
})
var Blog = mongoose.model("Blog", blogSchema);

/*
Blog.create({
    title: "Norway",
    image: "https://images.unsplash.com/photo-1516537243045-194d7d6b4884?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
    caption: "The Land of Midnight Sun",
    body: "From cosmopolitan Oslo to its endless snow-capped mountain peaks and deep fjords, there's no end of choices for travelers in the land of the midnight sun and stunning northern lights. One of the world's most prosperous nations, Norway seems to have a fascinating museum for just about every important aspect of its rich cultural and social history, covering everything from the Vikings to seafaring and fishing, as well as art and entertainment. Norway is also rich in spectacular scenery, from its stunning fjords to its spectacular mountains and glaciers, many of which are easily accessible to tourists."
});
*/

//>     RESTful ROUTES     <
app.get('/', function(req, res){
    res.redirect('/blogs');
})

//index route
app.get('/blogs', function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!");
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

//new route
app.get('/blogs/new', function(req, res){
    res.render('new');
});

//create route
app.post('/blogs', function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    //create blog
    var data = req.body.blog;
    Blog.create(data, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            //then, redirect to the index
            res.redirect('/blogs');
        }
    });
});

//show route
app.get('/blogs/:id', function(req, res){
    var id = req.params.id;
    Blog.findById(id, function(err, foundBlog){
        if(err) {
            res.redirect('/blogs');
        } else {
            res.render('show', {blog: foundBlog});
        }
    });
});

//edit route
app.get('/blogs/:id/edit', function(req, res){
    var id = req.params.id;
    Blog.findById(id, function(err, foundBlog){
        if(err) {
            res.redirect('/blogs');
        } else {
            res.render('edit', {blog: foundBlog});
        }
    })
});

//update route
app.put('/blogs/:id', function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    let id = req.params.id;
    let newData = req.body.blog;
    Blog.findById(id, newData, function(err, updatedBlog){
        if(err){
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs/' + id);
        }
    });
});

//delete route
app.delete('/blogs/:id', function(req, res){
    //destroy blog
    let id = req.params.id;
    Blog.findByIdAndRemove(id, function(err){
        if(err){
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs');
        }
    })
})


//app.listen(process.env.PORT, process.env.IP, function({}));
app.listen(5500, function(){
    console.log('server started running!');
});