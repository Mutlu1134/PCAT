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
3. database'e bağlanmak lazım. `mongoose.connect("mongodb://localhost/pcat-test-db")`
4. BU ADIMA GEREK YOK Bir şablon schema eklemek lazım. Aşağıda photoschema ? new mongoose.schema yazdığımı için bu satırı yazmasak olur. `const Schema = new mongoose.Schema();`
5. Şablona göre schema üretmek lazım. PhotoSchema isimli schema;
```
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
8. post edileni yakalayıp database'e göndermek için app.post metodu şu şekilde olmalı ;
```
app.post('/photos', async (req, res) => {
	// asenkron yapmak için async await yapmamız lazım
	// console.log(req.body); // yalnızca konsole yazmak için
	await Photo.create(req.body); // post edilen formdaki title ve description ve diğer img vs. veritabanına ekleniyor.
	res.redirect('/'); // req-res döngüsünü sonlandırmak için anasayfaya redirect ettik.
});

```
9. Şimdi Database'deki verileri ejs dosyalarına ekleyip dinamik şekilde görünmesini sağlayacağız.
10. Bunun için app.js dosyasında index.ejs dosyasına photos database'imizi göndermemiz gerekiyor. index(/) çağırldığında photos'ta index.ejs'e gitmesi için
```
app.get('/', (req, res) => {
	const photos = Photo.find({});
	res.render('../view/index.ejs', {
		photos,
	}); // index.ejs dosyasını göndermek
});
```

11. index.ejs dosyasında istenilen bloğu for döngüsüne almak için include' yazarken <%- include .... -%>
```
  <% for( let index = 0; index < photos.length; index++ ) { %>

	<% } %>
```
12. index.ejs 'de tekrar photos'u import etmeye gerek yok zaten üst aşamada göndermiştik.
13. index.ejs içinde statik yazılar yerine dB'den alınan dinami yazıları eklemek için `<%= photos[index].title %>` ejs komutu kullanılır.
14. Şimdi Her bir fotoğrafa tıklanınca ilgili sayfayı açmayı sağlayacağız.
15. index.ejs üzerinde fotoğrafa tıklanın gönderilen href'e açılacak sayfa ve gönderilecek fotoğraf database id'sini gönderiyoruz. Bunun için :  `href="./editphoto/<%= photos[index]._id %>"` yazıyoruz.
16. Şimdi app.js'de gönderilen bu url'i yakalamamız, alınan id'ye ait photo bilgisini de edit photo sayfasına yönlendirmemiz lazım bunun için
```
app.get('/editphoto/:id', async (req, res) => {
	//console.log(req.params.id); // id'yi console yazmak için deneme
	const clickedphoto = await Photo.findById(req.params.id);
	res.render('../view/editphoto.ejs', {
		clickedphoto,
	}); // editphoto.ejs template'ine clickedphoto'yu de göndermek
});
```
17. Editphoto sayfasını css'leri yüklenmemiş olabilir. Düzeltmek için _header'da ve ilgili image'lerde script ve css url başına / ekliyoruz. Zaten başlangıcı public oluyor ekstra public eklemeye gerek yok
18. Editphoto sayfasında tekrar clickedphoto'yu import etmeye gerek yok zaten yukarda gönderdik. Şimdi statik olan verileri dinamiğe çevirebiliriz. Bunun için yine aşağıdaki ejs yazımını kullanabilirz.
```
<%= clickedphoto.title %>
<%= clickedphoto.description %>

```
19. Şimdi projemize görsel de yükleyeceğiz bunun için en çok kullanılan modül `multer` ve `express-fileupload` modülleri bu projede 2.si kullanılacak bunun için;
`npm i express-fileupload`
20. Fileupload modülünü import etmemiz lazım.
`import fileupload from 'express-fileupload';`
21. Middleware'i kaydetmemiz lazım. bunun için;
`app.use(fileUpload());`
22. POST request ile bir formdan multimedya (foto vs) göndermek için formumuza enctype eklememiz lazım bunun için;
`encType="multipart/form-data">` ibaresini forma şu şekilde ekliyoruz. `<form id="contact-form" action="/photos" method="POST" class="tm-contact-form" encType="multipart/form-data"></form>>`
23. Şimdi app.js dosyasında post metodunu yakalamaya geliyoruz. Önce yüklenen resim için bir dosyayolu ve resimi alıyoruz. Daha sonra bir dosyaya move edip database'e gönderiyoruz. Upload klasörü yoksa oluşturulması için fs modülünu kullanıyoruz onu da import etmemiz lazım şu şekilde
`import fs from 'fs';`
```
app.post('/photos', async (req, res) => {
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
			...req.body,
			image: '/uploads/' + uploadedImage.name,
		});
	});

	//aşağıdaki Photo.create(req.body) ile image'i birleştirip bu şekilde yapıyoruz.

	// asenkron yapmak için async await yapmamız lazım
	// console.log(req.body); // yalnızca konsole yazmak için
	//await Photo.create(req.body); // post edilen formdaki title ve description ve diğer img vs. veritabanına ekleniyor.
	res.redirect('/'); // req-res döngüsünü sonlandırmak için anasayfaya redirect ettik.
});
```
24. Daha sonra statik resim olan ejs templatelerini dinamik olacak şekilde değiştiriyoruz.
`<%= clickedphoto.image %> ` 
`<%= photos[index].image %>`
25. app.js'te index.ejs get yakalamada, en son yüklenen görselin ilk gösterilmesi için database'den seçeker dateCreated (zaman) değişkenine göre azalan şekilde sıralıyoruz.
```
app.get('/', async (req, res) => {
	const photos = await Photo.find({}).sort('-dateCreated'); // zamana göre sıralama
	res.render('../view/index.ejs', {
		photos,
	}); // index.ejs dosyasına photos collection'ı de göndermek
});
```
# Yüklediğimiz fotoğrafları güncelleme işlemi
1. Öncelikle photos sayfasında edit butonuna basıldığında edit.ejs template'ine tıklanan resmin db verileriyle birlikte route yapmak lazım. Edit butonunu a (link) yapıp edit template'ine o fotonun id'siyle gönderiyoruz.
 `href="/edit/<%= clickedphoto._id %> `
2. app.js 'te bu get requesti yakalayıp edit sayfasına id ve tüm verileriyle route edeceğiz.
```
app.get('/edit/:id', async (req, res) => {
	const editedphoto = await Photo.findById(req.params.id);
	res.render('../view/edit.ejs', {
		editedphoto,
	}); // edit.ejs template'ine editedphoto'yu de göndermek
});

```
3. edit.ejs templatinde ilgili statik yerlere dinamik verileri eklemek gerek. value ve gerçek değer olarak ;
```
 <div class="form-group">
	<input type="text" name="title" value="<%= editedphoto.title %> " class="form-control rounded-0" placeholder="Photo Title" required/>
	</div>
	<div class="form-group">
	<textarea rows="8" name="description"    class="form-control rounded-0" placeholder="Photo Decription"
				required><%= editedphoto.description %></textarea>
</div>
```
4. edit sayfasında submit edildiğinde yeni girilen verilerin güncellenmesi yani put edilmesi lazım ama  tarayıcılar post ve get'i tanıyor bunun için post metoduyla put requesti simüle yapacağız. Bunu yapmak için `method-override` modülünü indirmek lazım. Bu modül put ve delete işlemi yapmak için kullanılır.
`npm install method-override`
5. method-override, app.js sayfasına import edilir. 
`import methodOverride from 'method-override';`
6. Middleware olarka kullanacağımız için use yapmamız gerek.
`app.use(methodOverride('_method'));``
7. edit.ejs template'inde submit ettikten sonra tekrar photos template'ine gitmemiz uygun olur bu yüzden form'un action'nuna photos/id'yi yazmalıyız. aynı zamanda methodu put'muş gibi göndermeliyiz. ?_method=PUT
```
<form id="contact-form" action="/photos/ <%= editedphoto._id %>?_method=PUT " method="POST" class="tm-contact-form" encType="multipart/form-data">
```
8. Şimdi edit template'inden gelen yalancı PUT requestini app.js'de yakalamamız lazım. yakaladıktan sonra Db'deki photo'nun title ve desc 'ini güncelliyoruz. Daha sonra /photo/id'ye redirect ediyoruz. Zaten /photo/id'yi daha önce yapmıştık direkt verilen id'ye göre db'den sergiliyor.
```
app.put('/photos/:id', async (req, res) => {
	const photo = await Photo.findById(req.params.id); //DB'den photo'yu çek
	photo.title = req.body.title; // req.body.title ile yeni alınan başlık yap
	photo.description = req.body.description; // yeni alınaın descriptionu ayarla
	photo.save();
	res.redirect(`/photo/${req.params.id}`); // tekrar photos sayfasına redirect ediyoruz. ama gelen id'ile birlikte
});
```
9. Şimdi photo sayfasında silme butonuna basılan görseli database'den ve serverden sileceğiz. bunun için ilk önce Delete photo butonunu link haline getireceğiz ve confirmation için onclick fonksiyonu ekleyeceğiz ve DELETE methodu olarak gönderiyoruz.
```
<a class="btn btn-danger p-0 tm-btn-animate tm-btn-download tm-icon-download" onclick="confirm('Do you want to delete photo?')" href="./photo/<%=clickedphoto._id%>?_method=DELETE" ><span>Delete Photo</span></a>	

```
10. şimdi app.js 'de delete metodunu yakalayıp, server'den ve database'den ilgili resmi silmemiz lazım ardından anasayfaya redirect etmemiz lazım.
Ancak app.js'de get metodu üstüne bindirilmiş delete metodunu yakalayabilmek için middleware' use 'ı şu şekilde güncellemek lazım.
`app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));`

11.	Şimdi app.js'de delete methodunu yakalayıp önce serverden sonra dbden resmi siliyoruz.
```
app.delete('/photo/:id', async (req, res) => {
	//console.log(req.params.id); // id'yi console yazmak için deneme
	const selectedphoto = await Photo.findById(req.params.id); // db'den ilgili fotoyu bul
	fs.unlinkSync('./public' + selectedphoto.image); // fotoyu serverdan sil
	await Photo.findByIdAndRemove(req.params.id); // fotoyu db'den sil.
	res.redirect('/'); // anasayfaya git.
});

```
12. Son olarak projemizi MVC yapısına geçireceğiz Yani Controllers klasörü altında photosControllers vs. ekleyeceğiz. Aslında projenin en başından beri bu şekilde ilerlememiz gerekirdi ama app.js'in ne kadar karışacağını görmemizi istemiş eğitmen.

13. İlk olarak kök dizinimize controllers klasörü açıyoruz ve içine ilgili işlemleri bir arada tutacak controllers dosyaları açıyoruzç Örneğin photoController, pageController vs. Controller'a ilgili model'i ve ilgili modüller import etmemiz lazım. Daha sonra kontrollerdan export edilen fonksiyonları da app.js'te import etmemiz lazım. Gerekli controller'a importlar require'lar yapmak gerekebilir. express fs vs.
14. ES modülüyle import exportlarda sorun yaşadım. bundan dolayı common js 'e geri döndüm örnek bir export ;
Controller/pageController.js'den
```
exports.getAddPage = (req, res) => {
	res.render('../view/addphoto.ejs'); // contact.ejs dosyasını göndermek
};
```
app.js'te import edilişi ve kullanılışı ;

```
const pageController = require('./controllers/pageController.js');
app.get('/addphoto', pageController.getAddPage);

```

# PAGINATION - SAYFALAMA
1. Şimdi aşağıdaki sayfaları ayarlayacağız.
bunun için get index yakalama kısmında(getAllPhotos) şunu yapıyoruz ;
```
exports.getAllPhoto = async (req, res) => {
	// zamana göre sıralama son girilen en başta olması için sort ifadesi
	const totalPhotos = await Photo.find({}).countDocuments();
	let page = req.query.page || 1;
	console.log(page);
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
```
2. index.ejs kısmında ise şunları yaplaıyız.
```
<ul class="nav tm-paging-links">
	<% for( let index = 1; index <= totalPages; index++ ) { %>
		<% if (page=index) { %>
		<li class="nav-item active"><a href="/?page=<%=page%>" class="nav-link tm-paging-link"><%= page %> </a></li>
		<% } else { %>
		<li class="nav-item"><a href="/?page=<%=index%> " class="nav-link tm-paging-link"><%= index %> </a></li>
		<!-- <li class="nav-item"><a href="/?page=3" class="nav-link tm-paging-link">></a></li> -->
		<% } %>
	<% } %>
</ul>
```

# HOSTING VE UZAK DATABASE İLE SİTEYİ CANLIYA ALMA.
1. Uzak database için mongodb atlas uygulaması üzerinden new cluster açıp connect via vscode seçip linki kopyalıyoruz. ve mongoose.connect'e yapıştırıyoruz. mongoose.connect bize promise dönüyor bunları .then ve .catch ile yakalıyoruz bağlandıysa Db connected yazdırıyoruz.
```
mongoose.connect(
	'mongodb+srv://Mutlusprojects:992500@cluster0.nwclhox.mongodb.net/test'
)
	.then(() => {
		console.log('DB Connected !');
	})
	.catch((err) => {
		console.log(err);
	});
``` 
2. Hosting hizmeti için heroku ücretli olduğundan render.com üzerinden uygulama açtık ve new static site'ı seçtik ve github'ı bağladık. Uygulamamızı github'a yükleyeceğiz.
3. Hosting açmadan önce port numaramızı şu şekilde ayarlalamız gerekiyor. Böylece hosting sağlayıcı müsait olan port numarasını verebilecek veya 8000 'i verecek
`const port = process.env.PORT || 8000;`
4. package.json dosyasındaki aşağıdaki test script'ini siliyoruz.
`    "test": "echo \"Error: no test specified\" && exit 1",`
bi altındaki start'ı daaşağıdaki şekilde güncelliyooruz. nodemon yerine node oluyor.
`"start": "node app.js"`
5. render.com'a deploy başarısız oluyor açılmıyor.
`npm install`, `npm start` yazdım.
