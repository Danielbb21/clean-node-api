import { badRequest, serverBadRequest } from '../Helpers/http-helper'
import { InvalidParamError, MissingParamError, ServerError } from '../errors/index'
import { Controller, HttpRequest, HttpResponse, emailValidator } from '../protocols/index'

export class SignUpController implements Controller {
  private readonly emailValidator: emailValidator

  constructor (emailValidator: emailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      return this.emailValidator.isValid(email) ? badRequest(new MissingParamError('field')) : badRequest(new InvalidParamError('email'))
    } catch {
      return serverBadRequest(new ServerError())
    }
  }
}
