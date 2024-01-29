module.exports = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).send(error.message);
    req.body = value;
    next();
  };
};
