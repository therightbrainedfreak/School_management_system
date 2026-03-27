const jsonHandler = ((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      status: 400,
      error: {
        code: "INVALID_JSON_PAYLOAD",
        message: "Provided json data is malformed."
      },
      metadata: {
        server_time: Date.now(),
        version: "v1.0.0"
      }
    });
  }
  next();
});

export default jsonHandler;