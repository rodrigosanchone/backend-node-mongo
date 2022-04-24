'use strict'


var validator  = require('validator') //llamo al validator
//const { update } = require('../models/article')
const article = require('../models/article');
var Article= require('../models/article');
var fs= require('fs');
var path= require('path');
const { geoSearch } = require('../models/article');


var controller ={

    datosCurso:(req,res)=>{
        var hola= req.query.hola
          return res.status(200).send(
            {
                curso:'Master en Framework Js',
                autor:'Rodrigo Sancho',
                hola
              
            }
            
           );
        
        },

        test:(req,res)=>{
          return res.status(200).send({
                  message:'Soy la acción test de mi controlador'
          })
        },

        save:(req,res)=>{  
            /*   return res.status(200).send({
            message:'Soy la acción test de mi controlador'
            }) */

            //Regoger parametros por post
            var params= req.body
            
            //validar datos
            try{
              var validate_title= !validator.isEmpty(params.title)
              var validate_content= !validator.isEmpty(params.content)
            }catch(err){
              return res.status(200).send({
                status: 'error',
                message:'Faltan datos a enviar'
                })
            }
            if(validate_title && validate_content){
              
                    //crear el objeto a guardar
                    var article = new Article()      
                    //asignar valores 
                    article.title = params.title
                    article.content= params.content
                    article.image= null
                    //guardar el articulo
                    article.save((err,articleStored)=>{
                       if(err || !articleStored){
                        return res.status(404).send({
                          status:'error',
                          message:'No se logro guardar el articulo'
                        });
                       }
                       //devolver una respuesta

                    return res.status(200).send({
                      status:'succes',
                      article: articleStored
                    })
                    })
                    
            }else{
              return res.status(200).send({
                status: 'error',
                message:'Los datos no son validos'
                })
            }
          },
        //trar todos los artciulos
        getArticles:(req,res)=>{
          var query= Article.find({});
          var last= req.params.last
          console.log(last)
          if(last || last !=undefined){
              query.limit(5);
          }
          query.sort('_id').exec((err,articles)=>{
                 if(err){
                    return res.status(500).send({
                      status: 'error',
                      message: 'Error al devolver los datos'
                    })
                 }

                 if(!article){
                  return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos en la base de datos'
                  })
               }

                 return res.status(200).send({
                  status: 'succes',
                  message: 'Los articulos son:',
                  articles
                })
          })
        },

        getArticle:(req,res)=>{
          //revoger el id de la url 
            var articleId = req.params.id
          //comprobar si es diferente a null
           if(!articleId || article==null){
            return res.status(404).send({
              status: 'error',
              message:'No hay articulos para mostrar'
              })
           }
          //buscar el artículo 
          Article.findById(articleId,(err,article)=>{
               if(err|| !article){
                return res.status(500).send({
                  status: 'error',
                  message:'No existe el articulo'
                  })
               }
              

                //devolverlo en json
                return res.status(200).send({
                  status: 'succes',
                  message:'El articulo es',
                  article
                  })

          })

         
        },

        update:(req,res)=>{

          //recoger el id del artítulo por la url
          var articlId= req.params.id;
          //recoger los datos que llegan por put
          var params = req.body;
          //validar los datos
          try{
            var validate_title =!validator.isEmpty(params.title)
            var validate_content =!validator.isEmpty(params.content)
          }catch(err){
            return res.status(200).send({
              status: 'error',
              message:'faltan datos'
              })
          }
          if(validate_title && validate_content){
             // find and update
             Article.findOneAndUpdate({_id:articlId},params,{new:true},(err,artcileUpdate)=>{
               if(err){
                return res.status(500).send({
                  status: 'error',
                  message:'error al actualizar'
                  })
               }

               if(!artcileUpdate){
                return res.status(404).send({
                  status: 'error',
                  message:'no existe el articulo'
                  })
               }

               return res.status(404).send({
                status: 'succes',
                message:'Artículo actualizado',
                article: artcileUpdate
                })
             });
          }else{
            return res.status(200).send({
              status: 'error',
              message:'algo salio mal'
              })
          }
         
        
        },

        delete:(req,res)=>{
          //Recoger el id de la url
          var articleId= req.params.id;

          //Encontrarl y borrar
            Article.findOneAndDelete({_id:articleId},(err, articleReomeved)=>{
              if(err){
                return res.status(500).send({
                  status: 'Error',
                  message:'Error al borrar'
                  });
              }

              if(!articleReomeved){
                return res.status(404).send({
                  status: 'Error',
                  message:'No se ha borrado el articulo, no existe'
                  })
              }

              
                return res.status(200).send({
                  status: 'Succes',
                  article: articleReomeved
                  })
              
            })
        
        },

        upload: (req, res)=>{
          //Configur el módulo connect multyparty router/article.js se hace el archivo de routes
          //Recoger el archivo de la petción
          var file_name= 'Imagen no subida'
          
          if(!req.files){
          return res.status(404).send({
            status: 'Error',
            message:'file_name dont upload'
            })
         }  
          //Conseguir  el nombre  y la extesión del archivo
      
          var file_path = req.files.file0.path
          var file_split= file_path.split('\\');         
        
         
         /**Advertencia  
            
          En linux o mac 

          en dado caso cuando se sube a servidor real
           
           var file_split= file_path.split('/'); 
        
         **/
    
           
           //Nombre del archivo
           var file_name= file_split[2]

           //Extesión del fichero
           var extesion_split= file_name.split('\.');
           //var originalname_split= originalname.split('\.')
           var file_ext= extesion_split[1];
          
   
         
          //Comprobar la extesión, qué sea solo de imagenes y si es valida borra el arhivo
           if(file_ext!= 'png' && file_ext !='jpg' && file_ext !='jpeg' && file_ext !='gif'){
              //borrar el archivo subido
            
              fs.unlink(file_path,(err)=>{
                return res.status(200).send({
                    status:'error',
                     message:'La extesión de la imagen no es valida',
                    file_ext
                  })
              })
              
           }else{  //Si es valido
              var articleId= req.params.id
              //Buscar el articlo , asignarle el nombre la imagen y actaulizar

              Article.findOneAndUpdate({_id: articleId},
                {
                  image:file_name
                },
                 {
                   new:true
                 },
                 (err, articleUpdate)=>{
                   if(err || !articleUpdate){
                    return res.status(200).send({
                      status: 'error',
                      message:'Error al guardar la img del articulo!!!'
                      });
                   }
                  return res.status(404).send({
                    article: articleUpdate
                    });
                 }
                );
           
           }
 
         
        }, //end upload

        getImage:(req, res)=>{
          var file= req.params.image;
          var path_file='./upload/articles/'+file; 

          fs.exists(path_file, (exists)=>{
            console.log(exists)
            if(exists){
              
              return res.sendFile(path.resolve(path_file))
           
            }else{
              return res.status(200).send({
                status:'succes',
                message:'La img no existe'
              })
            }
          })
         
        },//end upload

      search:(req,res)=>{
        //sacara el string a buscar 
        var searchString= req.params.search;
          //find or
          Article.find({
            "$or":[
              {"title":{"$regex":searchString, "$options":"i"}},//si el searhString esta dentro de title  me  va sacar los articulos con eso 
              {"content":{"$regex":searchString, "$options":"i"}}//si el searhString esta dentro de content  me saca los articulos
            ]
          })
          .sort([['date','descending']])
          .exec((err,articles)=>{
            if(err){
              return res.status(500).send({
                status:'error',
                message:'No se logro encontrar los articulos'
              });
            }
            if(!articles){
              return res.status(404).send({
                status:'error',
                message:'No hay articulos que mostrar'
              });
            }
            return res.status(200).send({
              status:'succes',
              articles
            });
          })
       
      }
} //end controller

     

module.exports = controller;
