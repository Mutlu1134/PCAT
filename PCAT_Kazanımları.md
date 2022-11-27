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