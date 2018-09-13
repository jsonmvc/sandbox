module.exports = {
  args: {
    actions: '/actions/succesful',
  },
  fn: ({actions}, lib) => {

  if(actions !== undefined){
    
    const size = actions.length;
    const last = actions[size-1];

    if(last === 'documents'){
      return {
        op: 'remove',
        path: '/router/overlay',
      };
    }
  }     

  }
}
