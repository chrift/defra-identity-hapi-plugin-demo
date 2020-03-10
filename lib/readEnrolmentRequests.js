/**
 *
 * @param {String} serviceId
 * @param {String} contactId
 * @param {Boolean} onlyUnspent
 * @param {Object} server
 * @return {Promise<EnrolmentRequest[]>}
 */
const readEnrolmentRequests = async (serviceId, contactId, onlyUnspent = true, server) => {
  const request = await readEnrolmentRequests.buildRequest(serviceId, contactId, onlyUnspent, server)

  const response = await server.methods.idm.getInternals().dynamics.requestPromise(request)

  return readEnrolmentRequests.parseResponse(response, server)
}

readEnrolmentRequests.buildRequest = async (serviceId, contactId, onlyUnspent, server) => {
  const { dynamics } = server.methods.idm.getInternals()

  const filter = [
    `_defra_serviceuser_value eq ${contactId}`
  ]

  if (serviceId) {
    filter.push(`_defra_service_value eq ${serviceId}`)
  }

  if (onlyUnspent) {
    filter.push('statuscode eq 1')
  }

  const params = {
    $filter: filter.join(' and ')
  }

  const headers = await dynamics.buildHeaders()
  const url = dynamics.buildUrl('/defra_lobserviceuserlinkrequests', params)

  return {
    method: 'GET',
    url,
    headers
  }
}

readEnrolmentRequests.parseResponse = (response, server) => {
  const { dynamics } = server.methods.idm.getInternals()
  const models = server.methods.idm.getModels()

  const data = dynamics.decodeResponse(response)

  if (!Array.isArray(data.value)) {
    throw new Error('readEnrolmentRequests response has unrecognised JSON')
  }

  if (!data || !data.value) {
    return []
  }

  return data.value.map(enrolmentRequest => models.EnrolmentRequest.fromPlainObject({
    enrolmentRequestId: enrolmentRequest.defra_lobserviceuserlinkrequestid,
    serviceId: enrolmentRequest._defra_service_value,
    accountId: enrolmentRequest._defra_organisation_value,
    contactId: enrolmentRequest._defra_serviceuser_value,
    connectionDetailsId: enrolmentRequest._defra_connectiondetail_value,
    status: enrolmentRequest.statuscode,
    state: enrolmentRequest.statecode
  }))
}

module.exports = readEnrolmentRequests
