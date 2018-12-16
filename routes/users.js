const router = require('koa-router')()
const Redis = require('koa-redis')

const Person = require('../dbs/models/person')

const Store = new Redis().client

router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

// curl http://localhost:3000/users/fix
router.get('/fix', async function (ctx) {
  const st = await Store.hset('fix', 'name', Math.random())
  ctx.body = {
    code: 0
  }
})

// 命令行模拟post 
// curl -d 'name=xiaoming&age=27' http://localhost:3000/users/addPerson
router.post('/addPerson', async function (ctx) {
  const person = new Person({
    name: ctx.request.body.name,
    age: ctx.request.body.age
  })
  let code
  try {
    await person.save()
    code = 0
  } catch (error) {
    console.log(error)
    code = -1
  }
  ctx.body = {
    code: code
  }
})

// curl -d 'name=lisi' http://localhost:3000/users/getPerson
router.post('/getPerson', async function (ctx) {
  let code
  try {
    const result = await Person.findOne({name: ctx.request.body.name})
    const results = await Person.find({name: ctx.request.body.name})
    code = 0
    ctx.body = {
      code: code,
      result,
      results
    }
  } catch (error) {
    console.log(error)
    code = -1
    ctx.body = {
      code: code
    }
  }
})

// curl -d 'name=zhangsan&age=20' http://localhost:3000/users/updatePerson
router.post('/updatePerson', async function (ctx) {
  let code
  try {
    const results = await Person.where({
      name: ctx.request.body.name
    }).update({
      age: ctx.request.body.age
    })
    code = 0
  } catch (error) {
    code = -1
  }
  ctx.body = {
    code: code
  }
})

// curl -d 'name=delete' http://localhost:3000/users/removePerson
router.post('/removePerson', async function (ctx) {
  let code
  try {
    const results = await Person.where({
      name: ctx.request.body.name
    }).remove()
    code = 0
  } catch (error) {
    code = -1
  }
  ctx.body = {
    code: code
  }
})

module.exports = router
