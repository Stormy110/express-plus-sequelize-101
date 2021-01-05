const { Pets } = require('../models');

const newForm = (req, res) => {
    res.render('new')
}

const processForm = async (req, res) => {
    const { name, breed } = req.body;
    // db.push(thought);
    // await will "pause" before running the rest
    // of the function.
    // 1. We start to talk to Postgres: Pets.create()
    // 2. Pause...until Postgres answers
    // 3. Whenever we finish talking to Postgres, assign result
    //    to new variable: newPet
    // const petDataFromTheForm = {
    //     name,   // equivalent to name: name
    //     breed   // equivalent to breed: breed
    // };
    // const newPet = await Pets.create(petDataFromTheForm);
    // console.log(newPet);
    const newPet = await Pets.create({
      name,
      breed
  });
    res.redirect('/list');    
}

module.exports = {
    newForm,
    processForm
}