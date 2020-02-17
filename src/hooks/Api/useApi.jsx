import { useState } from "react"
import axios from "axios"

const useApi = (options = { trigger: false }) => {
  const { trigger } = options
  const [requestState, setRequestState] = useState(
    trigger ? "loading" : "completed"
  )
  const [payload, setPayload] = useState(null)
  const [error, setError] = useState(null)

  const responseHandler = res => {
    if (res.data) setPayload(res.data)
    setRequestState("completed")

    return res
  }

  const errorHandler = resError => {
    if (resError.response) {
      switch (resError.response.status) {
        case 400:
          return setError("400 - Contenu inexistant")
        case 403:
          return setError(
            "403 - Votre authentification a expirée ou vous n'êtes pas authorisé à accéder à ce contenu"
          )
        case 412:
          return setError("412 - Le format attendu n'est pas correct")
        case 500:
          return setError("500 - Erreur réseau")
        default:
          return setError("000 - Une erreur est survenue")
      }
    }
    setRequestState("error")
    return resError
  }

  const request = (
    method,
    url,
    data,
    reqOptions = { silentLoad: false, axiosOptions: {} }
  ) => {
    setError(null)
    if (!reqOptions.silentLoad) setRequestState("loading")

    return axios({
      ...reqOptions.axiosOptions,
      url,
      method,
      data,
    })
      .then(responseHandler)
      .catch(errorHandler)
  }

  return [requestState, payload, error, request]
}

export default useApi
