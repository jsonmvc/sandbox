
module.exports = {
  args: {
    anchor: '/router/anchor'
  },
  fn: ({ anchor }) => {
    if (!anchor) {
      return
    }
    setTimeout(function(){
      window.location.hash = anchor
    }, 300);
    
    return {
      op: 'remove',
      path: '/router/anchor'
    }
  }
}
