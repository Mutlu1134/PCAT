import mongoose from 'mongoose';

//Connect DB
mongoose.connect('mongodb://localhost/pcat-test-db');

//create schema photo ekleyeceğimiz için ismini ptohoschema yazdık.
const PhotoSchema = new mongoose.Schema({
	title: String,
	description: String,
});

// Şablonu baz alarak modeli oluşturacağız.
const Photo = mongoose.model('Photo', PhotoSchema);

// Model de DataBase'de collection ve document'i oluşturacak
// Veritabanına ilk veri(collection->document) oluşturma
// Photo.create({
// 	title: 'Photo title 1',
// 	description: 'Photo Description 1',
// });

//DB'den veri okuma
// Photo.find({}, (err, data) => {
// 	console.log(data);
// });

// //DB veri update için
// const id = '63833f42fc97791aac112537';
// Photo.findByIdAndUpdate(
// 	id,
// 	{
// 		title: 'Title 11 updated',
// 		description: 'Photo description 11 updated',
// 	},
// 	{
// 		new: true, // Şimdi güncellenen veriyi aşağıda görmek için
// 	},
// 	(err, data) => {
// 		console.log(data);
// 	}
// );

// //DB'den veri silme
// const id = '63833f42fc97791aac112537';
// Photo.findByIdAndDelete(id, (err, data) => {
// 	if (!err) console.log('Veriler silindi');
// });
