import { publicDecrypt } from 'crypto';
import express from 'express';
import { get } from 'http';
import { url } from 'inspector';
import path, { dirname } from 'path';
import ejs from 'ejs';
import mongoose from 'mongoose';
//Models
import Photo from './models/Photo.js';

const app = express();
const port = 8000;

app.listen(port, () => {
	console.log(`Server has been started on ${port} port`);
});

//Connect DB
mongoose.connect('mongodb://localhost/pcat-test-db');

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

//ROUTING
// // EJS YOK İKEN;
// app.get('/', (req, res) => {
// 	res.sendFile(path.resolve('./temp/index.html')); // index.html dosyasını göndermek
// });
//EJS VAR IKEN SENDFILE YERINE RENDER
app.get('/', (req, res) => {
	res.render('../view/index.ejs'); // index.ejs dosyasını göndermek
});
app.get('/index', (req, res) => {
	res.render('../view/index.ejs'); // index.ejs dosyasını göndermek
});
app.get('/about', (req, res) => {
	res.render('../view/about.ejs'); // about.ejs dosyasını göndermek
});
app.get('/addphoto', (req, res) => {
	res.render('../view/addphoto.ejs'); // contact.ejs dosyasını göndermek
});
app.get('/editphoto', (req, res) => {
	res.render('../view/editphoto.ejs'); // contact.ejs dosyasını göndermek
});

app.post('/photos', (req, res) => {
	console.log(req.body);
	res.redirect('/'); // req-res döngüsünü sonlandırmak için anasayfaya redirect ettik.
});
