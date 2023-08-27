const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const path = require('path');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

//setting pug template
app.set('veiw engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GOBAL MIDDLEWARES
//serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

// Set security headers
app.use(helmet());
// app.use(helmet({ contentSecurityPolicy: false }));

// Set the Content Security Policy header
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' https://cdnjs.cloudflare.com/ https://fonts.googleapis.com; script-src 'self' https://cdnjs.cloudflare.com/ https://fonts.googleapis.com; style-src 'self' https://cdnjs.cloudflare.com/ https://fonts.googleapis.com; img-src 'self' https://cdnjs.cloudflare.com/;"
  );
  next();
});

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//limit request from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'To many request from this IP, Please try again in hour!'
});
app.use('/api', limiter);

//body parser to read from request body
app.use(express.json());
app.use(cookieParser());

//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
