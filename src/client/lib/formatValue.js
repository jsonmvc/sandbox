import moneyFormat from 'lib/moneyFormat'
import { remove as diacritics } from 'diacritics'
import moment from 'moment'

module.exports = function formatValue(format, value) {
  if (format === 'money') {
    value = moneyFormat(value)
  } else if (format === 'vat') {
    value = Math.round(value * 100) + '%'
  } else if (format === 'date') {
    value = moment(value).format('MM/DD/YYYY')
  } else if (typeof value === 'string') {
    value = diacritics(value)
  }
  return value
}
