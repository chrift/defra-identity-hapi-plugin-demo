const basicAuth = require('@hapi/basic')

const config = require('./config')

module.exports = async (server) => {
  await server.register(basicAuth)

  server.auth.scheme('basic-and-idm', (server) => ({
    authenticate: async (request, h) => {
      if (config.basicAuth.username && config.basicAuth.password) {
        try {
          await server.auth.test('basic-auth', request)
        } catch (e) {
          return h.unauthenticated(e)
        }
      }

      let idmCredentials

      try {
        idmCredentials = await server.auth.test('idm', request)
      } catch (e) {
        return h.unauthenticated(e)
      }

      // Only return the idm credentials, we don't care about any basic auth ones
      return h.authenticated({ credentials: idmCredentials })
    }
  }))

  // Register strategy that just uses the basic auth scheme
  server.auth.strategy('basic-auth', 'basic', {
    validate: (request, username, password) => ({
      isValid: username === config.basicAuth.username && password === config.basicAuth.password,
      credentials: {}
    })
  })

  // Register strategy that enforces both the basic auth and idm schemes
  server.auth.strategy('basic-and-idm', 'basic-and-idm')

  if (config.basicAuth.username && config.basicAuth.password) {
    // Set the default auth scheme to basic auth if we have basic creds set
    server.auth.default('basic-auth')
  }
}
