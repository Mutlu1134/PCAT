// const circle = require('./circle.js');
const express = require('express');
// import express from 'express';

// import fileUpload from 'express-fileupload';
const fileUpload = require('express-fileupload');

// import fs from 'fs';
const fs = require('fs');

// import methodOverride from 'method-override';
const methodOverride = require('method-override');
const mongoose = require('mongoose');

const mongoDbAtlasPass = require('./pass/mongoDbAtlasPass');

//controllers
const photoController = require('./controllers/photoController.js');
const pageController = require('./controllers/pageController.js');

// import photoController from './controllers/photoController.js';
//Models
// import Photo from './models/Photo.js';
const Photo = require('./models/Photo.js');

const app = express();
const port = process.env.PORT || 8000;

app.listen(port, () => {
	console.log(`Server has been started on ${port} port`);
});

//Connect DB
// mongoose.connect('mongodb://localhost/pcat-test-db');

mongoose.connect(
	`mongodb+srv://MutluPcatProject:xEyZ1oJz0WQ0UyLk@cluster0.jbseg4g.mongodb.net/test`
)
	.then(() => {
		console.log('DB Connected !');
	})
	.catch((err) => {
		console.log(err);
	});
//TEMPLATE ENGINE
app.set('view engine', 'ejs');

// //metodlar get put post patch delete
// app.get('/', (req, res) => {
// 	const photo = {
// 		id: 1,
// 		photoname: 'photoname',
// 		description: 'description',
// 	};
// 	res.send(photo);
// });

// // Kendimizin Middleware tanımlama örneği
// const mw1 = (req, res, next) => {
// 	console.log('Middle ware 1 çalıştı');
// 	next(); // mutlaka next ile bitmeli yoksa bir sonraki mw'e geçemez
// };
// // middle ware'i kullanmak için bu yazılır.
// app.use(mw1);

//statik dosyalar (html, photo, css, js vs) için kullanılan middleware
//dinamikler (api, database vs.)
//MIDDLEWARE
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));

//ROUTING
// // EJS YOK İKEN;
// app.get('/', (req, res) => {
// 	res.sendFile(path.resolve('./temp/index.html')); // index.html dosyasını göndermek
// });

//EJS VAR IKEN SENDFILE YERINE RENDER
app.get('/', photoController.getAllPhoto);
app.get('/index', photoController.getAllPhoto);
app.get('/photo/:id', photoController.getPhoto);
app.delete('/photo/:id', photoController.deletePhoto);
app.post('/photos', photoController.uploadPhoto);
app.get('/edit/:id', photoController.editPhoto);
app.put('/photos/:id', photoController.showPhoto);

app.get('/about', pageController.getAboutPage);
app.get('/addphoto', pageController.getAddPage);
