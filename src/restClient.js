// This file contains utility methods to interact with REST services.

import axios from 'axios'

/**
 * This method will be responsible for submitting REST request and getting back the response/error.
 * @param {*} methodType  e.g POST,PUT,DELETE,GET
 * @param {*} endpointURL e.g : https://hew.id.com/v1
 * @param {*} headers     e.g {'Content-Type':'application/json'}
 * @param {*} body        data to send along with request
 * @param {*} authorizationParams  credentials if any
 * @returns {} response object
 */
export default async function submitAPIRequest (methodType, endpointURL, headers, body) {
  let response
  const requiredParams = {
    method: methodType,
    url: endpointURL,
    headers: headers,
    data: body
  }

  console.log('Required params for the API: ', JSON.stringify(requiredParams, null, '\t'))

  try {
    response = await axios(requiredParams)
  } catch (err) {
    if (JSON.stringify(err).includes('ETIMEDOUT')) {
      throw err
    }
    response = err.response
  }

  return response
}

