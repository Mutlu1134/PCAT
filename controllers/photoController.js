const mongoose = require('mongoose');
//import models
// import Photo from '../models/Photo.js';
// const Photo = require('../models/Photo.js');
const Photo = require('../models/Photo.js');
const fs = require('fs');
// function getPhoto() {
// 	console.log('asd');
// }

exports.getPhoto = async (req, res) => {
	//console.log(req.params.id); // id'yi console yazmak için deneme
	const clickedphoto = await Photo.findById(req.params.id);
	res.render('../view/photo.ejs', {
		clickedphoto,
	}); // photo.ejs template'ine clickedphoto'yu de göndermek
};

exports.getAllPhoto = async (req, res) => {
	// zamana göre sıralama son girilen en başta olması için sort ifadesi
	const totalPhotos = await Photo.find({}).countDocuments();
	let page = req.query.page || 1;

	let photoEachPage = 3;
	let totalPages = Math.ceil(totalPhotos / photoEachPage);
	const photos = await Photo.find({})
		.sort('-dateCreated')
		.skip((page - 1) * photoEachPage)
		.limit(photoEachPage);

	res.render('../view/index.ejs', {
		photos: photos,
		totalPhotos: totalPhotos,
		photoEachPage: photoEachPage,
		totalPages: totalPages,
		page: page,
	}); // index.ejs dosyasına photos collection'ı de göndermek
};

exports.deletePhoto = async (req, res) => {
	//console.log(req.params.id); // id'yi console yazmak için deneme
	const selectedphoto = await Photo.findById(req.params.id); // db'den ilgili fotoyu bul
	fs.unlinkSync('./public' + selectedphoto.image); // fotoyu serverdan sil
	await Photo.findByIdAndRemove(req.params.id); // fotoyu db'den sil.
	res.redirect('/'); // anasayfaya git.
};

exports.uploadPhoto = async (req, res) => {
	//console.log(req.files.image); // Alınan görseli kontrol etmek için. formda file name="image" olduğu için .image yazdık.
	//express-uploadfile örneğinden alınan kod;

	// formda dosyanın name="image" olduğu için req.files.image olarak yakaladık.
	let uploadedImage = req.files.image;
	// nereye kaydedileceğini seçiyoruz.
	let uploadPath = './public/uploads/' + uploadedImage.name;

	//Eğer upload klasörü yoksa oluştur;
	let UploadDir = './public/uploads';
	if (!fs.existsSync(UploadDir)) fs.mkdirSync(UploadDir);

	// fotoğraf gerçekten yüklenmiş mi kontrolü
	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send('No files were uploaded.');
	}

	// görseri serverimizdeki uploadpath'e yüklüyoruz ve görsel yolunu veri tabanına yüklüyoruz.
	uploadedImage.mv(uploadPath, async () => {
		await Photo.create({
			...req.body, // girilen title ve body'ide db'ye yüklüyoru
			image: '/uploads/' + uploadedImage.name,
		});
	});

	//aşağıdaki Photo.create(req.body) ile image'i birleştirip bu şekilde yapıyoruz.

	// asenkron yapmak için async await yapmamız lazım
	// console.log(req.body); // yalnızca konsole yazmak için
	//await Photo.create(req.body); // post edilen formdaki title ve description ve diğer img vs. veritabanına ekleniyor.
	res.redirect('/'); // req-res döngüsünü sonlandırmak için anasayfaya redirect ettik.
};

exports.showPhoto = async (req, res) => {
	const photo = await Photo.findById(req.params.id); //DB'den photo'yu çek
	photo.title = req.body.title; // req.body.title ile yeni alınan başlık yap
	photo.description = req.body.description; // yeni alınaın descriptionu ayarla
	photo.save();
	res.redirect(`/photo/${req.params.id}`); // tekrar photos sayfasına redirect ediyoruz. ama gelen id'ile birlikte
};

exports.editPhoto = async (req, res) => {
	const editedphoto = await Photo.findById(req.params.id);
	res.render('../view/edit.ejs', {
		editedphoto,
	}); // edit.ejs template'ine clickedphoto'yu de göndermek
};
