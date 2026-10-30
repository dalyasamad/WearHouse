function errorHandler(
  error,
  req,
  res,
  next
) {
  console.error(error);

  const status =
    error.status || 500;

  const message =
    status >= 500
      ? "Internal server error."
      : error.message ||
        "Request failed.";

  return res
    .status(status)
    .json({
      message,
    });
}

module.exports =
  errorHandler;