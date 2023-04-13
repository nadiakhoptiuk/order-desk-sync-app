const axiosErrorHandler = (err) => {
  if (err.response) {
    // The request was made and the server responded with a status code
    const { data, status } = err.response;

    return `status:\t${data.status}\nmessage:\t${data.message}\nexecution time:\t${data.execution_time}\nstatus:${status}`;
  } else if (err.request) {
    // The request was made but no response was received

    return `request:\t${JSON.stringify(err.request)}`;
  } else {
    // Something happened in setting up the request that triggered an Error

    return err.message;
  }
};

module.exports = {
  axiosErrorHandler,
};
