module.exports = {
  Message: {
    channel(obj, args) {
      console.log(obj, args);
      return {_id: '777', name: 'hellow-world'}
    }
  }
};
