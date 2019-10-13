export interface IApp {
  name: string
  port: number | string
}

export interface IDb {
  uri: string
}

const app: IApp = {
  name: 'graphql-subscription',
  port: 4000
}

const db: IDb = {
  uri: 'mongodb://localhost/graphql-subscription'
}

export default { app, db }
