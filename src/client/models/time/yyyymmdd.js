import moment from 'moment'

module.exports = {
  args: {
    today: '/time/midnight'
  },
  fn: ({ today }) => {
    if (!today) {
      return
    }
    return moment(today).format('YYYY-MM-DD')
  }
}
