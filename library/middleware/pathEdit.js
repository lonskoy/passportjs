const pathEdit = (req, res, next) => {

    if(req.file) {
        req.body.pathTemp = req.file.path
        req.file.path = req.file.path.replace('public', '');
        req.file.path = req.file.path.replace(/\\/g, '/')
    }
    next()

  };
  
  module.exports = pathEdit;