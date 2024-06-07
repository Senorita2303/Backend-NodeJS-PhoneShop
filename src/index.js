const path = require("path");
const express = require("express");
const morgan = require("morgan");
// const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload"); // used for image and other files
const configCORS = require("~/config/cors");

const initRoutes = require("~/routes");
const connectDB = require("~/config/connectDB")
const cloudinary = require("cloudinary");

import { env } from '~/config/environment';

connectDB();
// conncet with cloudinary

cloudinary.config({
    cloud_name: env.CLOUDINARY_NAME,
    api_key: env.API_KEY,
    api_secret: env.API_SECRET,
});
require('./passport')

const app = express();
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
configCORS(app);
app.use(helmet());
if (env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
}
// const limiter = rateLimit({
//     max: 100,
//     windowMS: 60 * 60 * 1000,
//     message: 'Too many requests from this IP. Please try again in hour ',
// });
// app.use('/api', limiter);
//BODY PARSER,READING DATA FROM BODY INTO REQ.BODY
//DATA SANITIZATION AGAINST NO SQL QUERY INJECTION
app.use(mongoSanitize());
//DATA SANITIZATION AGAINST XSS
app.use(xss());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(fileUpload());
initRoutes(app);

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${env.PORT}`);
});
