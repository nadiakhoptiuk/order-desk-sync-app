const cutData = (data) => {
  // find index of the last report for reduce data
  const indexOfCurrentReport = data.lastIndexOf("REPORT TIME");
  const indexOfLastReport = data.lastIndexOf(
    "REPORT TIME",
    indexOfCurrentReport - 1
  );

  if (indexOfLastReport === -1) return data;
  return data.slice(indexOfLastReport);
};

module.exports = {
  cutData,
};
