import axios from "axios";

export const API_BASE = "http://localhost/api/";

const Api = axios.create({
  baseURL: API_BASE,
  responseType: "json",
  withCredentials: true
});

/**
 * Gets an error object from an axios response.
 *
 * @param {Object} e Response of axios
 * @param {TFunction} t Translation function
 * @param {string} defaultName Default field name for uncategorised errors
 */
export function getErrorObjectFromResponse(e, t, defaultName) {
  if (e.response) {
    const {status} = e.response;
    if(status >= 400 && status < 500) {
      const out = {};
      const inp = e.response.data.errors;
      for(const err in inp) {
        out[err] = inp[err].join('\n');
      }
      return out;
    } else {
      return {[defaultName]: t('error:unknown')};
    }
  } else {
    return {[defaultName]: t('error:connection')};
  }
}

export default Api;
