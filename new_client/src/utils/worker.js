const baseURL = 'http://192.168.2.231:3000'
let timer = null
const now1 = performance.now()
let count = 0

const interval = () => {
  timer = setInterval(() => {
    count++
    const now2 = performance.now()
    postMessage(count)
    console.log('误差值：', now2 - now1 - 1000 * count)
  }, 1000)
}

// 添加用户文件api
const adduserfolderapi = (userid, folderid, name) => {
  fetch(`${baseURL}/drive/addUserFolder`, {
    method: 'post',
    body: JSON.stringify({
		userid,
		folderid,
		name,
	  },)
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res)
    })
}

onmessage = function (event) {
  const { data } = event

  console.log(data)

  if (data['func'] === 'adduserfolderapi') {
    adduserfolderapi(data['userid'], data['folderid'], data['name'])
  }

  //   if (data === "start") {
  //     interval()
  //   }
  //   if (data === "stop") {
  //     clearInterval(timer)
  //     this.postMessage("ended")
  //   }
  //   console.log(event.data)
}
