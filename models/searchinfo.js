var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imgInfo = new Schema(
    {
      imagename:{type:String},
      ext:{type:String}
    }
);

var infoSchema = new Schema(
{
    keyword:{type:String},
    images:[imgInfo]
},
{
    timestamps: true
}
); 

var Info = mongoose.model('Keyword',infoSchema);

module.exports = Info;