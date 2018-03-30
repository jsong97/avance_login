const express = require('express');
const router = express.Router();

// Bring in Article model
let Article = require('../models/article');

// Add Submit POST Route
// you can have multiple things going to the same address
// as long as they are different requests (i.e. post, use, etc.)
router.post('/add', function(req, res){
  // check if the fields are empty
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('author', 'Author is required').notEmpty();
  req.checkBody('body', 'Body is required').notEmpty();

  // Get errors
  let errors = req.validationErrors();

  if (errors){
    res.render('add_article', {
      errors: errors,
      title: 'Add Article'
    });
  } else {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err){
      if(err){
        console.log(err);
        return;
      }
      req.flash('success', 'Your article has been added');
      res.redirect('/');
    });
  }
});


// Add an Article
router.get('/add', function(req, res) {
  res.render('add_article', {
    title: 'Add Article'
  });
});

// Get single article
router.get('/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('article', {
      article:article
    });
  });
});

// Load edit form
router.get('/edit/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('edit_article', {
      title: 'Edit Article',
      article:article
    });
  });
});

// Update Submit POST Route
router.post('/edit/:id', function(req, res){
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  // speifies which one to update
  let query = {_id:req.params.id};

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    }
    req.flash('success', 'Your article has been updated');
    res.redirect('/');
  });
});

// Delete article
router.delete('/:id', function(req, res){
  let query = {_id:req.params.id}

  Article.remove(query, function(err){
    if(err){
      console.log(err);
    }
    res.send('Success');
  });
});

module.exports = router;
