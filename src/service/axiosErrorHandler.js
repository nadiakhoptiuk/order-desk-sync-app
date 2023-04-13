const axiosErrorHandler = (err) => {
  if (err.response) {
    // The request was made and the server responded with a status code
    const { data, status } = err.response;

    return { data, status };
  } else if (err.request) {
    // The request was made but no response was received

    return { request: err.request };
  } else {
    // Something happened in setting up the request that triggered an Error

    return { message: err.message };
  }
};

module.exports = {
  axiosErrorHandler,
};
