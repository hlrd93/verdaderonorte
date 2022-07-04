'use strict'

const express = require('express')
const https = require('https')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')

const schema = buildSchema(`
  scalar JSON

  type Query {
    tasklist(n: Int = 3): [JSON]
  }
`)

var root = {
  tasklist: async ({ n }) => {
    const link = "https://lorem-faker.vercel.app/api?quantity=" + n
    const request = (link) => {
      return new Promise((resolve, reject) => {
        https.get(link, (resp) => {
          let data = ''
          resp.on('data', (chunk) => {
            data += chunk
          })
          resp.on('end', () => {
            resolve(data)
          })

        }).on("error", (err) => {
          reject(err)
        })
      })
    }

    try {
      const res = await request(link)
      const tasklist = JSON.parse(res).map((task, index) => {
        return { "UUID": index, "task": task }
      })

      return tasklist
    } catch (err) {

      return [{ "err": err }]
    }
  },
}

var app = express()
// Add OPTIONS request method
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  )
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

  if (req.method === "OPTIONS") {
    return res.sendStatus(200)
  }
  next()
})
// Get task with graphql
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}))
// Put task with router express
app.put('/task', function (req, res) {
  console.log("Task Done!!")
  return res.sendStatus(200)
})

app.listen(4000)

console.log('Running a GraphQL API server at http://localhost:4000/graphql')