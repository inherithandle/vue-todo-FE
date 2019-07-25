import projects from './projects.json'

export default {
  getProjects: function() {
    return projects
  },
  deleteTodo: function(todoObj) {
    return axios.delete('/rest/todo', {
      data: todoObj
    })
  },
  modifyTodo: function(todoObj) {
    return axios.put('/rest/todo', todo)
  },
  addTodo: function(todoObj) {
    return axios.post('/rest/todo', todoObj)
  },
  addProject: function(projectObj) {
    return axios.post('/rest/project', {
      data: projectObj
    })
  },
  deleteProject: function(projectObj) {
    return axios.delete('/rest/project', {
      data: projectObj
    })
  },
  modifyProject: function(projectObj) {
    return axios.put('/rest/project', projectObj)
  }
}
