const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folderName = file.fieldname;
        let uplodPath = path.join('public', folderName)

        fs.mkdir(uplodPath, { recursive: true }, function (err) {
            if (err) {
                return cb(err)
            }
            cb(null, uplodPath)
        });
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

const upload = multer({ storage: storage });

module.exports = upload

