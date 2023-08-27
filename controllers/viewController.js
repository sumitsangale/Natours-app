const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  //get all tours
  const tours = await Tour.find();

  //create templete
  res.status(200).render('overview.pug', {
    title: 'All tours',
    tours
  });
});

exports.getTour = (req, res) => {
  res.status(200).render('tour.pug', {
    title: 'The Forest Hiker'
  });
};
