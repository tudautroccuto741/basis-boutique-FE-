const express = require('express')
const path = require('path')
const morgan = require('morgan')
const methodOverride = require('method-override')
const handlebars = require('express-handlebars')
const app = express()
const port = 3000

//const rout = require('./routes')

const route = require('./routes')
const db = require('./config/db')

//connect db
db.connect();

app.use(express.static(path.join(__dirname, 'public')))

//HTTP logger
app.use(morgan('combined'))

//Template engine
app.engine(
  'html', 
  handlebars({
    extname: '.html',
    helpers: {
      sum: (a, b) => a+b,
    }
  }),
);
app.set('view engine', 'html')
app.set('views', path.join(__dirname, 'resources', 'views'))

//midleware
app.use(express.urlencoded())
app.use(express.json())

app.use(methodOverride('_method'))

//routes init
route(app)


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})