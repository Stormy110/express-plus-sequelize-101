const http = require('http');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const es6Renderer = require('express-es6-template-engine');

const app = express();
const server = http.createServer(app);

const PORT = 3000;
const HOST = '0.0.0.0';

const logger = morgan('tiny');

app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

const { newForm, processForm } = require('./controllers/pet')

// JS library that speaks to Postgres
const Sequelize = require('sequelize');
// Pets is an object that can
const { Pets } = require('./models');


app.use(logger);
// Disabling for local development
// app.use(helmet());

// Parse any form data from POST requests
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/new', newForm);

// When using Sequelize, you need async/await
// Put async in front of (req, res)
// It means that you will use the `await` keyword in the function
app.post('/new', processForm);

app.get('/list', async (req, res) => {
  // Read/retrieve all pets
    const pets = await Pets.findAll()
    res.render('list',{
      locals: {
        pets
      }
    });
        
});

app.get('/list/:id', async (req,res)=>{
  const pet = await Pets.findByPk(req.params.id);
  res.render('edit', {
    locals: {
      petName: pet.name,
      petBreed: pet.breed
    }
  })
})

app.post('/list/:id', async (req,res)=>{
  const { name, breed } = req.body;
  const { id } = req.params;
  const updatedPet = await Pets.update({
    name,
    breed
  }, {
    where: {
      id
    }
  });
  res.redirect('/list')
});

app.get('/list/:id/delete', async (req,res)=>{
  const { id } = req.params;
  const pet = await Pets.findByPk(id);
  res.render('delete', {
    locals: {
      name: pet.name
    }
  })
});

app.post('/list/:id/delete', async (req,res)=>{
  const { id } = req.params;
  const deletedPet = Pets.destroy({
    where: {
      id
    }
  });
  res.redirect('/list')
});

server.listen(PORT, HOST, () => {
    console.log(`Listening at http://${HOST}:${PORT}`);
});
