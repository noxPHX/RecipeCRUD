const app = require('express')();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe');

mongoose.connect('')
	.then(() => {
		console.log('Successfully connected to MongoDB Atlas!');
	})
	.catch((error) => {
		console.log('Unable to connect to MongoDB Atlas!');
		console.error(error);
	});

app
	.use((req, res, next) => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
		next();
	})
	.use(bodyParser.json())
	.post('/api/recipes', (req, res, next) => {
		const recipe = new Recipe({
			title: req.body.title,
			ingredients: req.body.ingredients,
			instructions: req.body.instructions,
			time: req.body.time,
			difficulty: req.body.difficulty
		});
		recipe.save().then(() => {
			res.status(201).json({
				message: 'Post saved successfully!'
			});
		}).catch((error) => {
			res.status(400).json({
				error: error
			});
		});
	})
	.get('/api/recipes/:id', (req, res, next) => {
		Recipe.findOne({
			_id: req.params.id
		}).then((recipe) => {
			res.status(200).json(recipe);
		}).catch((error) => {
			res.status(404).json({
				error: error
			});
		});
	})
	.put('/api/recipes/:id', (req, res, next) => {
		if (req.body.difficulty > 5 || req.body.difficulty < 1) {
			res.status(400).json({error: 'Invalid difficulty'});
			return;
		}
		const recipe = new Recipe({
			_id: req.params.id,
			title: req.body.title,
			ingredients: req.body.ingredients,
			instructions: req.body.instructions,
			time: req.body.time,
			difficulty: req.body.difficulty
		});
		Recipe.updateOne({_id: req.params.id}, recipe).then(() => {
			res.status(201).json({
				message: 'Recipe updated successfully!'
			});
		}).catch((error) => {
			res.status(400).json({
				error: error
			});
		});
	})
	.delete('/api/recipes/:id', (req, res, next) => {
		Recipe.deleteOne({_id: req.params.id}).then(() => {
			res.status(200).json({
				message: 'Deleted!'
			});
		}).catch((error) => {
			res.status(400).json({
				error: error
			});
		});
	})
	.get('/api/recipes', (req, res, next) => {
		Recipe.find().then((recipes) => {
			res.status(200).json(recipes);
		}).catch((error) => {
			res.status(400).json({
				error: error
			});
		});
	});

module.exports = app;
