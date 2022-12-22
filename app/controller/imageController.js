const uploadFile = require('../../upload');
const path = require('path');
const fs = require('fs');
const { Stream } = require('stream');

exports.addImage = async (req, res) => {
    try {
        await uploadFile(req, res);
        if (req.file == undefined) {
          return res.status(400).send({ message: "Please upload a file!" });
        }
        res.status(200).send({
          message: req.file.originalname
        });
      } catch (err) {
        res.status(500).send({
          message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
      }
};

exports.downloadImage =  (req, res) => {
  console.log(req.query);
  const { file } = req.query; 
  let readStream = fs.ReadStream;
  try {
  readStream = fs.createReadStream(path.join('./app', file.replace(/^(\/static)/,"/public")));
  }
  catch(error) {
  if (error.code === 'ENOENT') {
    // подгружаем заглушку
    readStream = fs.createReadStream(path.join('./app/public/uploads', 'not_found.jpg'));
  } else {
    throw error;
  }
}
  readStream.on('open', function () {
    // This just pipes the read stream to the response object (which goes to the client)
    readStream.pipe(res);
  });
};