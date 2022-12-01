// import mongoose from 'mongoose';
const mongoose = require('mongoose');

//create schema photo ekleyeceğimiz için ismini ptohoschema yazdık.
const PhotoSchema = new mongoose.Schema({
	title: String,
	description: String,
	image: String,
	dateCreated: {
		// Veritabanına girilen zamanı default olarak tutar
		type: Date,
		default: Date.now,
	},
});

// Şablonu Schemayı baz alarak modeli oluşturacağız.
const Photo = mongoose.model('Photo', PhotoSchema);

module.exports = Photo; //CommonJS
// exports.Photo; // ES6
