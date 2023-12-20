const express = require('express')
const app = express()
app.use(express.json())

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

let db
const dbPath = path.join(__dirname, 'todoApplication.db')
const initializeDBserver = async () => {
  try {
    db = await open({filename: dbPath, driver: sqlite3.Database})
    app.listen(3000, () => {
      console.log('Running')
    })
  } catch (err) {
    console.log(`error:${err.message}`)
    process.exit(1)
  }
}

function hasAllThree(ques) {
  return (
    ques.status !== undefined &&
    ques.priority !== undefined &&
    ques.category !== undefined
  )
}
function hasStatusAndPriority(ques) {
  return ques.status !== undefined && ques.priority !== undefined
}
function hasStatusAndCategory(ques) {
  return ques.status !== undefined && ques.category !== undefined
}
function hasPriorityAndCategory(ques) {
  return ques.priority !== undefined && ques.category !== undefined
}
function hasPriorityOnly(ques) {
  return ques.priority !== undefined
}
function hasStatusOnly(ques) {
  return ques.status !== undefined
}
function hasCategoryOnly(ques) {
  return ques.category !== undefined
}

app.get('/todos/', async (request, response) => {
  let getQuery = ''
  const ques = request.query
  const {status, priority, category, search_q = ''} = ques
  switch (true) {
    case hasAllThree(ques):
      if (
        (status === 'TO DO' || status === 'IN PROGRESS' || status === 'DONE') &&
        (priority === 'HIGH' || priority === 'MEDIUM' || priority === 'LOW') &&
        (category === 'WORK' || category === 'HOME' || category === 'LEARNING')
      ) {
        getQuery = `SELECT id as id, todo as todo,priority as priority,status as status, category as category, due_date as dueDate FROM todo
            WHERE status='${status}' AND priority='${priority}' AND todo LIKE '%${search_q}%' AND category ='${category}'`
        const getList = await db.all(getQuery)
        response.send(getList)
      } else if (
        status !== 'TO DO' &&
        status !== 'IN PROGRESS' &&
        status !== 'DONE'
      ) {
        response.status(400)
        response.send('Invalid Todo Status')
      } else if (
        priority !== 'HIGH' &&
        priority !== 'MEDIUM' &&
        priority !== 'LOW'
      ) {
        response.status(400)
        response.send('Invalid Todo Priority')
      } else if (
        category !== 'WORK' &&
        category !== 'HOME' &&
        category !== 'LEARNING'
      ) {
        response.status(400)
        response.send('Invalid Todo Category')
      }
      break

    case hasStatusAndPriority(ques):
      if (
        (status === 'TODO' || status === 'IN PROGRESS' || status === 'DONE') &&
        (priority === 'HIGH' || priority === 'MEDIUM' || priority === 'LOW')
      ) {
        getQuery = `SELECT id as id, todo as todo,priority as priority,status as status, category as category, due_date as dueDate FROM todo
            WHERE status='${status}' AND priority='${priority}' AND todo LIKE '%${search_q}%'`
        const getList = await db.all(getQuery)
        response.send(getList)
      } else if (
        status !== 'TO DO' &&
        status !== 'IN PROGRESS' &&
        status !== 'DONE'
      ) {
        response.status(400)
        response.send('Invalid Todo Status')
      } else if (
        priority !== 'HIGH' &&
        priority !== 'MEDIUM' &&
        priority !== 'LOW'
      ) {
        response.status(400)
        response.send('Invalid Todo Priority')
      }
      break

    case hasStatusAndCategory(ques):
      if (
        (status === 'TO DO' || status === 'IN PROGRESS' || status === 'DONE') &&
        (category === 'WORK' || category === 'HOME' || category === 'LEARNING')
      ) {
        getQuery = `SELECT id as id, todo as todo,priority as priority,status as status, category as category, due_date as dueDate FROM todo
            WHERE status='${status}' AND todo LIKE '%${search_q}%' AND category ='${category}'`
        const getList = await db.all(getQuery)
        response.send(getList)
      } else if (
        status !== 'TO DO' &&
        status !== 'IN PROGRESS' &&
        status !== 'DONE'
      ) {
        response.status(400)
        response.send('Invalid Todo Status')
      } else if (
        category !== 'WORK' &&
        category !== 'HOME' &&
        category !== 'LEARNING'
      ) {
        response.status(400)
        response.send('Invalid Todo Category')
      }
      break

    case hasPriorityAndCategory(ques):
      if (
        (priority === 'HIGH' || priority === 'MEDIUM' || priority === 'LOW') &&
        (category === 'WORK' || category === 'HOME' || category === 'LEARNING')
      ) {
        getQuery = `SELECT id as id, todo as todo,priority as priority,status as status, category as category, due_date as dueDate FROM todo
            WHERE priority='${priority}' AND todo LIKE '%${search_q}%' AND category ='${category}'`
        const getList = await db.all(getQuery)
        response.send(getList)
      } else if (
        priority !== 'HIGH' &&
        priority !== 'MEDIUM' &&
        priority !== 'LOW'
      ) {
        response.status(400)
        response.send('Invalid Todo Priority')
      } else if (
        category !== 'WORK' &&
        category !== 'HOME' &&
        category !== 'LEARNING'
      ) {
        response.status(400)
        response.send('Invalid Todo Category')
      }
      break

    case hasPriorityOnly(ques):
      if (priority === 'HIGH' || priority === 'MEDIUM' || priority === 'LOW') {
        getQuery = `SELECT id as id, todo as todo,priority as priority,status as status, category as category, due_date as dueDate FROM todo
            WHERE priority='${priority}' AND todo LIKE '%${search_q}%'`
        const getList = await db.all(getQuery)
        response.send(getList)
      } else {
        response.status(400)
        response.send('Invalid Todo Priority')
      }
      break

    case hasStatusOnly(ques):
      if (status === 'TO DO' || status === 'IN PROGRESS' || status === 'DONE') {
        getQuery = `SELECT id as id, todo as todo,priority as priority,status as status, category as category, due_date as dueDate FROM todo
            WHERE status='${status}' AND todo LIKE '%${search_q}%'`
        const getList = await db.all(getQuery)
        response.send(getList)
      } else {
        response.status(400)
        response.send('Invalid Todo Status')
      }
      break

    case hasCategoryOnly(ques):
      if (
        category === 'WORK' ||
        category === 'HOME' ||
        category === 'LEARNING'
      ) {
        getQuery = `SELECT id as id, todo as todo,priority as priority,status as status, category as category, due_date as dueDate FROM todo
            WHERE category='${category}' AND todo LIKE '%${search_q}%'`
        const getList = await db.all(getQuery)
        response.send(getList)
      } else {
        response.status(400)
        response.send('Invalid Todo Category')
      }
      break

    default:
      getQuery = `SELECT id as id, todo as todo,priority as priority,status as status, category as category, due_date as dueDate FROM todo
            WHERE todo LIKE '%${search_q}%'`
      const getList = await db.all(getQuery)
      response.send(getList)
      break
  }
})

app.get('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const getSpecificTodo = `SELECT id as id, todo as todo,priority as priority,status as status, category as category, due_date as dueDate FROM todo
            WHERE id=${todoId}`
  const spTodo = await db.get(getSpecificTodo)
  response.send(spTodo)
})

app.get('/agenda/', async (request, response) => {
  const {date} = request.query
  const dateQuery = `SELECT id as id, todo as todo,priority as priority,status as status, category as category, due_date as dueDate FROM todo
            WHERE due_date='${date}'`
  const spTodos = await db.all(dateQuery)
  response.send(spTodos)
})

app.post('/todos/', async (request, response) => {
  const {id, todo, priority, status, category, dueDate} = request.body
  const postQuery = `INSERT INTO todo(id , todo , priority,status, category, due_date)
                    VALUES(${id}, '${todo}', '${priority}', '${status}', '${category}', '${dueDate}')`
  await db.run(postQuery)
  response.send('Todo Successfully Added')
})

app.put('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const getThatTodoQue = `SELECT * from todo WHERE id=${todoId}`
  const prevTodo = await db.get(getThatTodoQue)

  let column
  switch (true) {
    case request.body.status !== undefined:
      column = 'Status'
      break
    case request.body.todo !== undefined:
      column = 'Todo'
      break
    case request.body.priority !== undefined:
      column = 'Priority'
      break
    case request.body.category !== undefined:
      column = 'Category'
      break
    case request.body.due_date !== undefined:
      column = 'Due Date'
      break
  }

  const {
    status = prevTodo.status,
    priority = prevTodo.priority,
    todo = prevTodo.todo,
    category = prevTodo.category,
    dueDate = prevTodo.due_date,
  } = request.body
  const updateQuery = `UPDATE todo
                      SET status='${status}',
                      priority='${priority}',
                      todo='${todo}',
                      category='${category}',
                      due_date='${dueDate}'
                      WHERE id=${todoId}`
  await db.run(updateQuery)
  response.send(`${column} Updated`)
})

app.delete('/todos/:todoId', async (request, response) => {
  const {todoId} = request.params
  const deleteQuery = `DELETE FROM todo
                      WHERE id=${todoId}`
  await db.run(deleteQuery)
  response.send('Todo Deleted')
})

initializeDBserver()
module.exports = app
