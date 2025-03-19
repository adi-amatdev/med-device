const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require('multer')
const app = express();
app.use(express.json());

// Middleware to handle raw binary file upload
const upload = multer({
    limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
    storage: multer.diskStorage({
        destination: path.join(__dirname, 'uploads'),
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    })
});

app.post('/upload-file-direct', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded or file size exceeds limit." });
    }

    return res.status(200).json({ message: "File uploaded successfully", filename: req.file.originalname });
});

app.post('/upload', (req, res) => {
    const uploadDir = path.join(__dirname, 'uploads');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

    const filePath = path.join(uploadDir, `${Date.now()}-uploaded-file`);
    const writeStream = fs.createWriteStream(filePath);

    req.on('data', (chunk) => {
        writeStream.write(chunk);
    });

    req.on('end', () => {
        writeStream.end();
        res.status(200).json({ message: "File uploaded successfully", filePath });
    });

    req.on('error', (error) => {
        console.error("File upload error:", error);
        res.status(500).json({ message: "File upload failed" });
    });

    writeStream.on('error', (error) => {
        console.error("Write stream error:", error);
        res.status(500).json({ message: "File write failed" });
    });
});

app.get('/hello', (req, res) => {
    return res.status(200).json({ message: "hello-world" });
});

app.listen(3000, () => {
    console.log(`Server listening on 3000`);
});
