import express, { Application } from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import { ApolloServer } from 'apollo-server-express'
import { createServer } from 'http'

import { app as config } from './config'
import schema from './schema'

const app: Application = express()
const server = createServer(app)
const PORT: string | number = config.app.port
const dbUri: string = config.db.uri

// database connection
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(console.log)

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// apollo server
const GraphQLServer = new ApolloServer({ schema })
GraphQLServer.applyMiddleware({ app, path: '/graphql' })
GraphQLServer.installSubscriptionHandlers(server)

server.listen(PORT, () => console.log('Server running on port', PORT))
