const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).send({
    error: {
      status: err.status || 500,
      message: err.message || "Internal Server Error",
    },
  });
};

module.exports = errorHandler;
