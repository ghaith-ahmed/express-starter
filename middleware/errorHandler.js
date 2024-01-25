module.exports = (error, req, res, next) => {
  console.log(error);
  return res.status(400).send(error.message);
};
