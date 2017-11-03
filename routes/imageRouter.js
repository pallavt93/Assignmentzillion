var express = require('express');
var bodyParser = require('body-parser');

var keyword = '';
var path = require('path');
var fs = require('fs');
var jimp = require('jimp');
//download images
var download = require('image-downloader');


var sync = require('synchronize');
var fiber = sync.fiber;
var await = sync.await;
var defer = sync.defer;

var mongoose = require('mongoose');
var Info = require('../models/searchinfo');

var imageRouter  = express.Router();

//scrapper code
var Scraper = require ('images-scraper');
var google = new Scraper.Google();


var data;
var file = '';
var ext = '';
var imagedata = [];

function scrape(req,res,key)
{
 console.log("inside scrape key = " + key);   
 google.list({
    keyword:  req.body.keyword,
    num: 15,
    detail: true,
    // google specific
	rlimit: '100',			// number of requests to Google p second, default: unlimited
	timeout: 100,			// timeout when things go wrong, default: 10000
    nightmare: {
        show: true
    }
})
.then(function (resp) {
   data =  resp;
   scrapeImage(req,res,key); 
          
     
}).catch(function(err) {
    console.log('err', err);
}); 
  
}

function scrapeImage(req,res,key)
{
  

    
// Download to a directory and save with the original filename
if (fs.existsSync("./public")) {
    // Do something
}   
else
{    
fs.mkdirSync("./public"); 
}    

// Download to a directory and save with the original filename
if (fs.existsSync("./public/images")) {
    // Do something
}   
else
{    
fs.mkdirSync("./public/images"); 
}                  
     
// Download to a directory and save with the original filename
if (fs.existsSync("./public/images/" + req.body.keyword)) {
    // Do something
}   
else
{    
fs.mkdirSync("./public/images/" + req.body.keyword); 
}
for(var i = 0;i<15;i++)
{   
  
    
if(data != null)
{
    var extarr = data[i]['url'].split("/");
    for(var j = 0;j<extarr.length;j++)
        {
            if  (0 == 1)
                {}
            else if(extarr[j].indexOf('.jpg') !== -1)
                {
                    ext = ".jpg";
                }
            else if(extarr[j].indexOf('.png') !== -1)
                {
                    ext = ".png";
                }
            else if(extarr[j].indexOf('.svg') !== -1)
                {
                    ext = ".svg";
                }
            else if(extarr[j].indexOf('.jpeg') !== -1)
                {
                    ext = ".jpeg";
                }
            else if(extarr[j].indexOf('.gif') !== -1)
                {
                    ext = ".gif";
                }
            
            
            
            
        }
    var img = {name:'img'+i,ext:ext}
            imagedata.push(img);
    
const op = {
  url: data[i]['url'],
  dest:  './public/images/'+ req.body.keyword + "/img" + i + ext               
};
 
      ext  = path.extname(op.dest);
     file = './public/images/'+ req.body.keyword + '/img' + i + ext;
    

    
download.image(op)
  .then(({ filename, image }) => {
    
    imageCompress(filename);
    
  }).catch((err) => {
    throw err
  });  
}

    
  
}

    

    
    if(imagedata.length != 0)
         {
            
            for(var i = 0;i<imagedata.length;i++)
                 {
                    key.images.push({imagename:imagedata[i].name,
                                     ext :imagedata[i].ext});
                  }
             key.save();
         }

}


function imageCompress(file)
{
      if(file != '')
      {
        
          try {
           fiber(function() {
          
               var obj = await(imgload(null,file)); 

             });
            } catch(err) {
                          console.log(err);
                            }
          
          
          
          
          function imgload(err,file)
          {
    
              await(jimp.read(file,function(err,image){
                  if(err == null)
                  image.greyscale().write(file);
              }));
          }
          
          
     
      }
}



imageRouter.route('/')
.post(function(req,res){
    console.log(req.body);
    Info.findOne(req.body,function(err,key)
                {
                   if(err) console.log(err);
                   else if(key == null)
                    {
                      Info.create(req.body,function(err,keyword)
                      {
                       if (err) console.log(err);
                       var id = keyword._id;
                       console.log('Added the keyword with id: ' + id + ' and keyword ' + keyword);
                       scrape(req,res,keyword);
                         
                          
                       });    
                       
                       
                     
                      }
                   else
                     {
                        res.redirect('/scrape/searches'); 
                      }
        
                return {}
         });  
            
});

imageRouter.route('/searches')
.get(function(req,res){
    
    Info.find({},function(err,keywords)
                {
                   if(err) console.log(err);
                   else
                     {
                         
                        res.setHeader("Content-Type", "text/html");
                         res.render('searches',{data:keywords});
                     }
         }); 
    
    
    
})
.delete(function(req,res){
    Info.remove({},function(err)
               {
           res.send("removed");
    });
});


imageRouter.route('/display')
.get(function(req,res){
    var imgdata;
    Info.findOne({keyword:req.query.key},function(err,data){
        if (err) console.log(err);
        else
            {
               imgdata = data;
            }
        res.setHeader("Content-Type", "text/html");
        res.render('display',{data:imgdata});
    });
    
});


 

module.exports = imageRouter;


