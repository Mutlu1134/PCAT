# PCAT PROJE KAZANIMLARI
1. .gitignore dosyasını google'adan toptal sitesinden `node` yazıp aratarak aldık.
2. Önce `npm init` yapılır ardından. prettier extensionunu indirdik ve prettier modülünü indirdik. `npm install prettier`
3. git ayarlarını yaptık git init, remote vs. artık yalnızca `git add .` ve `git commit -m "açıklama"` ve `git push` ile yükleyebileceğiz.
4. express ve nodemon modüllerini ekledik. `npm install express --save`
5. `npm install --save-dev nodemon ` ile nodemon indiriyooruz. Bizim yerimize sunucuyu kapatıp save edip yeniden başlatıyor.
6. nodemon indirdikten sonra `package.json` içine scripts altına `"start" : "nodemon app.js"` ekliyoruz ve artık terminalden `npm start` yazdığımızda nodemon devrede oluyor.
7. Expess modülünde MIDDLEWARE fonksiyonlarını kullanıyoruz. statik dosyalarımızı (css,img,js,fontawesome,video vs.) `public` dosyasına atıyoruz.
8. ES modul yapısını kullanacaksak. package-json içine `"type": "module",` ifadesini ekliyoruz.
7. Basic app.js içeriği
```
import express from "express";
const app = express();
const port = 8000;

app.listen(port, () => {
	console.log(`Server has been started on ${port} port`);
});

//TEMPLATE ENGINE
app.set('view engine', 'ejs');

//MIDDLEWARE
app.use(express.static('public'));

//ROUTING
app.get('/', (req, res) => {
	res.render('../view/index.ejs'); 
});
```
7. Middleware fonksyonlarını tanıtmak için `app.use(express.static('public'));` ekliyoruz. 
8. Template engine -> var olan statik html dosyarı .ejs uzantılı yaparak "view" modeline çeviriyoruz.
9. EJS Embedded Javascript Templates modülünü indiriyoruz. `npm install ejs`
10. html dosyalarını view klasörü altına alıyoruz ve uzantılarını .ejs yapıyoruz.
11. header footer navbar gibi ortak yapıları view->partials klasörü altında `_header.ejs` , ``_footer.ejs` gibi dosyalara kopyalıyoruz.
12. ejs yazımında yardımcı olması için `EJS language support` extension'unu indirebiliriz.
12. index.esj'den kesip _header.ejs'ye kopyaladığımız kod bloğu yerine _headeri include ediyoruz. 
`<%- include("./partials/_header.ejs")  -%> `
13. ejs dosyaları index.js içinde artık `res.sendFile` şeklinde route edilmeyecek. `res.render` edilecek.
14. ejs yi import etmemiz gerek index.js'e `import ejs from 'ejs';` şeklinde ve `app.set("view engine", "ejs")` eklememiz gerekir.
15. kopyaladığımız yerlere o kopyalanan kod parçasının çalışması için 

# DATABASE İŞLEMLERİ
0. Database olarak MongoDB No-SQL indirdik. Nodejs ile sıklıkla kullanılır.
1. Mongoose modülü sayesinde mongoDB CRUD işlemlerini kolayca yapabiliriz. İndirmek için `npm install mongoose`
2. mongoose'u import etmek lazımm. `import mongoose from 'mongoose';`
3. database'e bağlanmak lazım. `mongoose.connect("mongoose://localhost/pcat-test-db")`
4. Bir şablon schema eklemek lazım. `const Schema = new mongoose.Schema();`
5. Şablona göre schema üretmek lazım. PhotoSchema isimli schema;
```
const PhotoSchema = new mongoose.Schema({
	title: String,
	description: String,
});
```
6. Şablonu(Schemayı) baz alarak model oluşturacağız. Photo isimli model;
```
const Photo = mongoose.model('Photo', PhotoSchema);
```
7. Modeli kullanrak ilk verimizi(collection->document) DB'ye yazdıracağız. SQL'de collection = table, document = ver bir satır veya sütun'a karşılık geliyor.
8. Create için
```
Photo.create({
	title: 'Photo title 1',
	description: 'Photo Description 1',
});

```
9. DB'den Okuma için
```
Photo.find({}, (err, data) => {
	console.log(data);
});
```
10. DB veri update yapmak için
```
//DB veri update için
const id = '63833f42fc97791aac112537';
Photo.findByIdAndUpdate(
	id,
	{
		title: 'Title 11 updated',
		description: 'Photo description 11 updated',
	},
	{
		new: true, // Şimdi güncellenen veriyi aşağıda görmek için
	},
	(err, data) => {
		console.log(data);
	}
);

```

11. DB'den veri silme 
```
//DB'den veri silme
const id = '63833f42fc97791aac112537';
Photo.findByIdAndDelete(id, (err, data) => {
	if (!err) console.log('Veriler silindi');
});

```

# Gerçek uygulamada Database işlemleri yapmak için
1. DB'ye post yapmak için html dosyalarında/ ejs'lerde 
`methot ="POST" action="/photos"` olması gerekir. photos yerine herhangi birşey yazılabilir. ama controller'da bu photos yakalanacak ona göre birşeyler yapılacaktır.
2. Aşağıdaki adımda post ile gönderilenleri yakalamak için 2 adet middleware yazmak gerekiyor. (Eskiden bunlar yerine bodyparser diye bir modül kullanılıyormuş.) Bu middleware'ler;
```
app.use(express.urlencoded({ extended: true })); // url'deki datayı okumaya yarar
app.use(express.json()); // url'deki datayı jsoon formatına çevirmemizi sağlar
```
3. post edilenleri yakalamak için app.js dosyasında yakalamamız gerekiyor. Örneğimizde /photos'du.
```
app.post('/photos', (req, res) => {
	console.log(req.body);
	res.redirect('/'); // req-res döngüsünü sonlandırmak için anasayfaya redirect ettik.
});
```
4. Şimdi Girilen verileri console yerine direkt database'e göndereceğiz.
5. ilk olarak kök dizine `models` klasörü açıyoruz. Altına `models/Photo.js` isimli modelimizi oluşturuyoruz. Modelimizin içine Schema oluşturma Model oluşturma ve Export etme işlemleri yapıyoruz.
```
import mongoose from 'mongoose';

//create schema photo ekleyeceğimiz için ismini ptohoschema yazdık.
const PhotoSchema = new mongoose.Schema({
	title: String,
	description: String,
	dateCreated: {
		// Veritabanına girilen zamanı default olarak tutar
		type: Date,
		default: Date.now,
	},
});

// Şablonu Schemayı baz alarak modeli oluşturacağız.
const Photo = mongoose.model('Photo', PhotoSchema);

export default = Photo;
```
6. Export edilen modeli app.js dosyamıza import ediyoruz. `import Photo from './models/Photo';`
7. DB connect işlemimizi app.js dosyamızda yapıyoruz.
```
import mongoose from 'mongoose';

//Connect DB
mongoose.connect('mongodb://localhost/pcat-test-db');
```
