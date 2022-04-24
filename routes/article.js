'use strict'

var express = require('express');

var ArticleController = require('../controllers/article')

var router = express.Router();
const multer = require('multer');
var multipart= require('connect-multiparty'); // se configura el multiiparty
var md_upload = multipart({uploadDir:'./upload/articles'})// se configura el multiiparty


/* const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/articles/')
    },
    filename: function (req, file, cb) {
        cb(null, "articles" + Date.now() + file.originalname);
    }
  });
  const upload = multer({ storage: storage }); */


//rutas de priebas 
router.get('/test-de-controlador',ArticleController.test);
router.post('/datos-curso',ArticleController.datosCurso);

//rutas reales
router.post('/save',ArticleController.save);
router.get('/articles/:last?',ArticleController.getArticles);
router.put('/article/:id',ArticleController.update);
router.get('/article/:id',ArticleController.getArticle);
router.delete('/article/:id',ArticleController.delete);
//router.post('/upload-image/:id',md_upload,ArticleController.upload);//la ruta procesa los archivos que le quiero pasar
 router.post('/upload-image/:id',md_upload, ArticleController.upload);
 router.get('/get-image/:image', ArticleController.getImage); 
 router.get(' ', ArticleController.search); 
module.exports = router;