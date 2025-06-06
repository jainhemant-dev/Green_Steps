import logger from '##/server/lib/logger.js';

/*
 * TODO:
 * 1. Add more error handling
 * */
function handleError(res, error) {
  logger.error(error.stack || error.message);

  maybeSendError({
    message: 'Unexpected error occurred. Please try again later.',
    statusCode: 500,
  });

  function maybeSendError({ statusCode, message }) {
    // If the HTTP headers were already sent, do nothing, because any attempt
    // to set the status code or additional headers will fail. Also, since the
    // body may already be partially written, do not write anything extra to
    // the body to not corrupt the already-sent response.
    if (!res.headersSent) {
      res.status(statusCode).json({ message });
    }
  }
}

/**
 * Wraps an Express route handler to catch both synchronous and asynchronous errors.
 *
 * In Express 4.x, async route handlers that throw errors or return rejected promises
 * do not automatically pass the error to the error-handling middleware. This wrapper
 * catches any errors thrown by the handler and passes them to a custom error handling
 * function, `handleError`, ensuring that the request does not hang due to unhandled promise rejections.
 *
 * NOTE: With Express 5.x and later, native async error handling is supported, so this wrapper
 * may become unnecessary.
 *
 * @param {Function} handler - An Express route handler that may be asynchronous.
 * @returns {Function} A new handler that catches errors and forwards them to the custom error handler.
 */

function withAsyncErrorHandling(handler) {
  async function wrapped(req, res, ...rest) {
    try {
      // As a bonus, this catches both synchronous and asynchronous errors, as
      // it is a no-op to `await` a non-awaitable value.
      await handler(req, res, ...rest);
    } catch (error) {
      logger.error(error);
      handleError(res, error);
    }
  }
  return wrapped;
}

export { handleError, withAsyncErrorHandling };
