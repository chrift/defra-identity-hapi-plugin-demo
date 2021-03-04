const { version } = require('../package.json')
const serviceLookup = require('../lib/services')

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: async function (request, h) {
      const { idm } = request.server.methods

      return h.view('index', {
        title: 'home',
        user: null,
        idm,
        journey: 'chemicals',
        serviceLookup,
        claims: await idm.getClaims(request)
      })
    }
  },
  {
    method: 'GET',
    path: '/auth/outbound',
    handler: async (request, h) => {
      const { query, server } = request

      try {
        // We might have had a state or nonce manually passed through in our url
        const { state, nonce, scope, serviceId, stubScp, prompt, _ga, backToPath } = query
        request.query._ga = `&_ga=${_ga}-${backToPath.split('/')[2]}-${new Date().getTime()}` // make a service based demo _ga value

        let outboundUrl = await server.methods.idm.generateOutboundRedirectUrl(request, request.query, {
          state,
          nonce,
          scope,
          serviceId,
          prompt
        })

        if (stubScp === 'true') {
          outboundUrl += '&stubScp=true'
        }

        return h.redirect(outboundUrl)
      } catch (e) {
        console.error({ e })

        return server.methods.idm.getConfig().callbacks.onError(e, request, h)
      }
    }
  },
  {
    method: 'GET',
    path: '/version',
    handler: (request, h) => {
      return h.response(version).type('text/plain')
    }
  }
]
