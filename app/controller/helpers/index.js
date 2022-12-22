const path = require('path');
const fs = require('fs');
function getImageAsBase64(fileName){
   const file = path.join('./app',fileName.replace(/^(\/static)/,"/public"));
   return fs.readFileSync(file).toString('base64');
}
module.exports =  { getImageAsBase64 };