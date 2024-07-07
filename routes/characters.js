const express = require('express');
const Character = require('../models/characters');
const router = express.Router();

router.use(express.json());

// Create
router.post('/', async (req, res) => {
    try {
        console.log('Received POST request with body:', req.body);  // Log the request body
        if (!req.body || !req.body.name) {
            return res.status(400).send({ error: 'Invalid request body' });
        }
        const character = new Character({
            name: req.body.name,
        });
        await character.save();
        res.status(201).send(character);
    } catch (error) {
        console.error('Error creating character:', error);  // Log any error
        res.status(400).send(error);
    }
});

  

// Read
router.get('/', async (req, res) => {
    try {
      const characters = await Character.find();
      res.send(characters);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const character = await Character.findById(req.params.id);
      if (!character) {
        return res.status(404).send();
      }
      res.send(character);
    } catch (error) {
      res.status(500).send(error);
    }
  });

// Update
router.put('/:id', async (req, res) => {
  try {
    const character = await Character.findByIdAndUpdate(req.params.id,
        {
        name : req.body.name,
        },
     { new: true, runValidators: true });

    if (!character) {
      return res.status(404).send();
    }
    res.send(character);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const character = await Character.findByIdAndDelete(req.params.id);
    if (!character) {
      return res.status(404).send();
    }
    res.send(character);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
