import { ServerError } from './../errors/server-error'
import { InvalidParamError } from './../errors/invalid-param-error'
import { HttpRequest, HttpResponse } from './../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest, serverBadRequest } from '../Helpers/http-helper'
import { Controller } from '../protocols/controller'
import { emailValidator } from '../protocols/email-validator'

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
      return this.emailValidator.isValid(httpRequest.body.email) ? badRequest(new MissingParamError('field')) : badRequest(new InvalidParamError('email'))
    } catch {
      return serverBadRequest(new ServerError())
    }
  }
}
