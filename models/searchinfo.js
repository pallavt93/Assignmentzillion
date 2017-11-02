var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imgInfo = new Schema(
    {
      imagename:{type:String,unique:true},
      ext:{type:String}
    }
);

var infoSchema = new Schema(
{
    keyword:{type:String,unique:true},
    images:[imgInfo]
},
{
    timestamps: true
}
); 

var Info = mongoose.model('Keyword',infoSchema);

module.exports = Info;