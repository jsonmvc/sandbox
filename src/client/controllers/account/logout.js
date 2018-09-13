
module.exports = {
  args: {
    init: '/session/logout'
  },
  fn: ({ init }) => {

    if (!init) {
      return []
    }

    FIREBASE.auth().signOut()

    sessionStorage.removeItem('signedin')

    // @TODO: Create a signing out Please wait screen
    return [{
      op: 'remove',
      path: '/user'
    }, {
      op: 'remove',
      path: '/users/list'
    }, {
      op: 'remove',
      path: '/invoices/list'
    }, {
      op: 'remove',
      path: '/session/logout'
    }, { 
      op: 'remove',
      path: '/products/list'
    }, {
      op: 'add',
      path: '/router/location',
      value: 'visitor-home'
    }]
  }
}
