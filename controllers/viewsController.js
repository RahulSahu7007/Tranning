
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  const currentUser = res.locals.user
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template
  // 3) Render that template using tour data from 1)
  console.log(res.cookie)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
    currentUser
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const currentUser= res.locals.user
  // 1) Get the data, for the requested tour (including reviews and guides)
  // const tour = await Tour.findOne({ slug: req.params.slug }).populate({
  //   path: 'reviews',
  //   fields: 'review rating user'
  // });
  const slugName = req.params.slug
  const tour = await Tour.aggregate([
    {
      $match:{
        slug: slugName
      }
    }
  ])
  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
    currentUser
  });
});

exports.getLoginForm = (req, res) => {
  let message = req.flash('error')
            if(message.length > 0){
                message = message[0]
            } else{
                message = null
            }
            let successMessage = req.flash('success')
            if(successMessage.length > 0 ){
                successMessage = successMessage[0]
            }else{
                successMessage = null
            }
  res.status(200).render('login', {
    title: 'Log into your account',
    error:message, success: successMessage
  });
};
exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Log into your account'
  });
};

exports.getAccount = (req, res) => {
  const currentUser= res.locals.user
  console.log(req.headers.cookie)
  res.status(200).render('account', {
    title: 'Your account',
    currentUser
    
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
   
  });
  res.redirect('/login')
});
exports.profile = async(req, res)=>{
  try{
    const currentUser = req.user
    console.log(req.headers.authorization)
    console.log(currentUser)
    return res.json(currentUser)
  }catch(err){
    throw err
  }
}
