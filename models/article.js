'use strict'

var mongoose= require('mongoose');
var Schema = mongoose.Schema;



var ArticleSchema = new Schema({
  title:String,
  content:String,
  data:{type:Date, default: Date.now},
  image:String
});

module.exports = mongoose.model('Article', ArticleSchema); 

//pluralizar el nombre y lo pone en minuscula osea crea una colección llamada articulos 