const express = require('express');
const morgan = require('morgan');
const playstore = require('./playstore');

const app = express();
app.use(morgan('common'));

app.get('/apps', (req, res) => {
  const { sort, genre } = req.query;
  const validSort = ['rating', 'app'];
  const validGenres = ['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'];
  
  //validate sort input
  if(sort) {
    if(!validSort.includes(sort.toLowerCase())) {
      return res.status(400).send('Sort must be rating or app');
    }
  }
  
  //validate genre input
  if(genre) {
    if(!validGenres.includes(genre.toLowerCase())) {
      return res.status(400).send('Genre must be action, puzzle, strategy, casual, arcade, or card');
    }
  }

  // sort and genre
  if(sort && genre) {
    let filteredApps = playstore.filter(app => 
      app.Genres
        .toLowerCase()
        .includes(genre.toLowerCase()));
    let filteredAndSortedApps = filteredApps.sort((a, b) => {
      return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
    });

    return res.json(filteredAndSortedApps);
  }

  //sort only
  if(sort && !genre) {
    let sortCapitalized = sort.charAt(0).toUpperCase() + sort.slice(1);
    let sortedApps = playstore.sort((a, b) => {
      return a[sortCapitalized] > b[sortCapitalized] ? 1 : a[sortCapitalized] < b[sortCapitalized] ? -1 : 0;
    });
    return res.json(sortedApps);
  }

  // genre only
  if(genre && !sort) {
    let filteredApps = playstore.filter(app => 
      app.Genres
        .toLowerCase()
        .includes(genre.toLowerCase()));
    return res.json(filteredApps);
  }

  // no parameters - return all apps
  if(!genre && !sort) {
    return res.json(playstore);
  }
});

app.listen(8000, () => {
  console.log('Server started on PORT 8000');
});