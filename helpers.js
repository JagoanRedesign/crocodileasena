const debug = (obj = {}) => {
    return JSON.stringify(obj,null,4)
}

const wait = async (time) => {
    return new Promise((resolve) => {
      setTimeout(resolve, time)
    })
  }
  

module.exports = {debug,wait}