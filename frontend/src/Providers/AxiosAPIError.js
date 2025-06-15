class AxiosAPIError extends Error {  
    constructor (message, error_array) {
      super(message)
  
      this.name = this.constructor.name
  
      // capturing the stack trace keeps the reference to your error class
      Error.captureStackTrace(this, this.constructor);
  
      // you may also assign additional properties to your error
      this.error_array = error_array
    }
}

export default AxiosAPIError;
