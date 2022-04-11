const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash')
const session = require('express-session')

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');


const app = express();
app.use(cookieParser());
app.use(function (req, res, next) {
  res.setHeader(
    "Content-Security-Policy",
    "default-src * self  blob: data: gap://ready; style-src * self 'unsafe-inline' blob: data: gap:; script-src * 'self' 'unsafe-eval' 'unsafe-inline' blob: data: gap:; object-src * 'self' blob: data: gap:; img-src * self 'unsafe-inline' https://code.jquery.com/jquery-3.6.0.min.js blob: data: gap:; connect-src self * 'unsafe-inline' blob: data: gap:; frame-src * self blob: data: gap:;"
  );
  next();
});
// app.use(helmet({
//   contentSecurityPolicy:
//   {
//     useDefaults: true,
//     directives: 
//     {
//       'script-src': ["'self' 'unsafe-eval' 'unsafe-inline'" ,"https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js", "https://code.jquery.com/jquery-3.6.0.min.js"], 
//       "img-src": ["'self'", "https: data:"]
//     }
//   }
// }))

//ejs is a template engine

app.set('view engine','ejs');
app.set('views',path.join(__dirname, './views'));


// 1) GLOBAL MIDDLEWARES
// Serving static files
//app.use(express.static(`${__dirname}/public`));
app.use(express.static('public'));

// Set security HTTP headers
app.use(helmet());


// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(
  session({
    secret: "coinProject",
    resave: false,
    saveUninitialized: true,
    cookie: {
      path: "/",
      httpOnly: false,
      secure: false,
      maxAge: 315360000000000,
    },
  })
);
app.use(flash())

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Serving static files
app.use('/css',express.static(__dirname + 'public/css'))
app.use('/img',express.static(__dirname + 'public/img'))
//app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});



// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);


app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
