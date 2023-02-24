const local = {
  host: 'mongodb://localhost/fns',
  connectionName: 'fns'
}

const prod = {
  host: 'mongodb://localhost/fns',
  connectionName: 'fns'
}

export default process.env.NODE_ENV === 'production' ? prod : local
