// 引入express
const express = require('express')
const db = require('./db')



// 创建应用对象
const app = express();
// app.use(express.urlencoded())
app.use(express.json())

app.get('/', async function(req, res){
  try {
    let back = await db.getDb()
    res.send(back)
  } catch (err) {
    res.status(500).json({err})
  }
})

app.post('/', async (req, res) => {
  // console.log(req.headers)
  // console.log(req.body)

  let body = req.body
  if (!body) {
    res.status(403).json({
      err: '缺少用户信息'
    })
  }
  let back = await db.getDb()
  const jsonObj = back
  // 给输入的用户信息添加个id
  body.id = jsonObj.users[jsonObj.users.length-1].id + 1
  jsonObj.users.push(body)
  // 写入文件
  try{
    let w = await db.serveDb(jsonObj)
    if(!w){
      res.status(200).send({
        msg: '添加成功'
      })
    }
  } catch(err){
    res.status(500).json({err})
  }
})

app.put('/:id', async (req, res) => {
  // console.log(req.params.id) // 传进来的数据
  // console.log(req.body)
  try{
    let userInfo = await db.getDb()
    let userId = Number(req.params.id)
    let user = userInfo.users.find(item => item.id === userId)
    if (!user){
      res.status(403).send({
        msg: '用户不存在'
      })
    }
    const body = req.body
    user.username = body.username ? body.username : user.username
    user.age = body.age ? body.age : user.age
    userInfo.users[userId - 1] = user
    let w = await db.serveDb(userInfo)
    if (!w) {
      res.status(201).send({
        msg: '修改成功'
      })
    }
  } catch(err){
    res.status(500).json({err})
  }
})
 
// 监听服务
app.listen(4000, () => {
  console.log('run http://127.0.0.1:4000');
})