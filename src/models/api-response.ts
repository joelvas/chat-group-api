class ApiResponse {
  success: boolean
  message: string
  constructor(success: boolean, message: string) {
    this.success = success
    this.message = message
  }

  setSuccess(success: boolean) {
    this.success = success
  }

  getSuccess() {
    return this.success
  }

  setMessage(message: string) {
    this.message = message
  }

  getMessage() {
    return this.message
  }
}

export default ApiResponse
