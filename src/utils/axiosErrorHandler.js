const axiosErrorHandler = (err) => {
  if (err.response) {
    // The request was made and the server responded with a status code
    const { data, status } = err.response;

    return {
      message: `status:\t${data.status}\nmessage:\t${data.message}\nexecution time:\t${data.execution_time}\nstatus:\t${status}`,
      error: { data, status },
    };
  } else if (err.request) {
    // The request was made but no response was received
    const { method, url, headers, data } = err.request;

    return {
      message: `request:\t${JSON.stringify(err.request)}`,
      error: { method, url, headers, data },
    };
  } else {
    // Something happened in setting up the request that triggered an Error

    return { message: err.message, error: err.message };
  }
};

module.exports = {
  axiosErrorHandler,
};
