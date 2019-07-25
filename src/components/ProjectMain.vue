<template>
<div class="root-container" id="root-container">
  <h1>TODO LIST powered by SpringBoot</h1>
  <h2>username : default</h2>
  <h2><a href="#" @click="logoutBtnClicked">logout</a></h2>
  <Project v-on:project-selected="projectSelected" v-bind:projects="projects" v-on:edit-btn-clicked="editBtnClicked" v-on:delete-btn-clicked="deleteBtnClicked" v-on:add-project-btn-clicked="addProjectBtnClicked"></Project>
  <Todo v-bind:current-index="currentIndex" v-bind:projects="projects" v-on:completed-checkbox-clicked="completedCheckboxClicked" v-on:edit-todo-btn-clicked="editTodoBtnClicked" v-on:add-todo-btn-clicked="addTodoBtnClicked"
    v-on:delete-todo-btn-clicked="deleteTodoBtnClicked"></Todo>
</div>
</template>

<script>
import Project from './Project.vue'
import Todo from './Todo.vue'
import api from '../js/api.js'

export default {
  data: function() {
    return {
      projects: [],
      currentIndex: 0,
    }
  },
  components: {
    Project,
    Todo
  },
  methods: {
    addItem: function() { // to be removed...
      return null;
    },

    projectSelected: function(index) {
      console.log('project selected');
      var selectedProject = this.projects.find(e => {
        return e.selected;
      });

      selectedProject.selected = false;
      this.projects[index].selected = true;
      this.currentIndex = index;
    },
    editBtnClicked: function(index) {
      // project should be selected first, before clicking on edit.
      if (!this.projects[index].selected) {
        return;
      }

      var promise = null;
      if (this.projects[this.currentIndex].edited == true) {
        if (this.projects[this.currentIndex].projectName !== this.projects[this.currentIndex].newProjectName) {
          this.projects[this.currentIndex].projectName = this.projects[this.currentIndex].newProjectName;
          promise = api.modifyProject(this.projects[this.currentIndex])
        }
      }

      // TODO : refactor
      if (promise != null) {
        const self = this;
        console.log('not null');
        promise.then(response => {
          this.projects[this.currentIndex].edited = !(this.projects[this.currentIndex].edited);
          console.log(self.projects[self.currentIndex].edited);
        }).catch(e => {
          console.log(e.response);
          alert('internet connection cut off or something wrong with backend server.');
          location.reload();
        });
      } else {
        this.projects[this.currentIndex].edited = !(this.projects[this.currentIndex].edited);
      }
    },
    deleteBtnClicked: async function(index) {
      // project should be selected first, before clicking on edit.
      if (!this.projects[index].selected) {
        return;
      }

      if (this.projects.length == 1) {
        alert("at least 1 project must exist.");
        return;
      }
      await api.deleteProject(this.projects[this.currentIndex]).catch(e => {
        console.log(e.response);
        alert('internet connection cut off or something wrong with backend server.');
        location.reload();
      });

      this.projects.splice(this.currentIndex, 1);
      this.currentIndex = 0;
      this.projects[0].selected = true;
    },
    addProjectBtnClicked: async function(newProjectName) {
      var project = {};
      project.projectName = newProjectName;
      project.projectNo = 0;
      project.todos = [];
      project.edited = false;
      project.selected = true;
      project.newProjectName = newProjectName;

      await api.addProject(project).catch(e => {
        console.log(e.response);
        alert('internet connection cut off or something wrong with backend server.');
        location.reload();
      });
      project.projectNo = response.data.projectNo;
      this.projects[this.currentIndex].selected = false;
      this.projects.push(project);
      this.currentIndex = this.projects.length - 1;
    },
    completedCheckboxClicked: function(id) {

      // axios put, db update. completed true.
    },
    addTodoBtnClicked: async function(todoName) {
      var todo = {};
      todo.id = 0;
      todo.text = todoName;
      todo.completed = false;
      todo.edited = false;
      todo.projectNo = this.projects[this.currentIndex].projectNo;
      todo.newTodoName = todoName;

      await api.addTodo(todoObj).catch(e => {
        console.log(e.response);
        alert('internet connection cut off or something wrong with backend server.');
        location.reload();
      });
      console.log(this.projects[this.currentIndex].todos.length);
      todo.id = response.data.id;
      var length = this.projects[this.currentIndex].todos.length;
      this.projects[this.currentIndex].todos.splice(length, 0, todo);
    },
    editTodoBtnClicked: async function(id) {
      var todo = this.projects[this.currentIndex].todos.find(e => {
        return e.id == id;
      });

      if (todo.edited && todo.text !== todo.newTodoName) {
        todo.text = todo.newTodoName;
        await api.modifyTodo(todo).catch(e => {
          console.log(e.response);
          alert('internet connection cut off or something wrong with backend server.');
          location.reload();
        });
      } else {
        console.log('expected');
        this.$set(todo, 'edited', !todo.edited);
      }
    },
    deleteTodoBtnClicked: async function(id) {
      var index = this.projects[this.currentIndex].todos.findIndex(e => {
        return e.id == id;
      });

      await api.deleteTodo(this.projects[this.currentIndex].todos[index]).catch(e => {
        console.log(e.response)
        alert('internet connection cut off or something wrong with backend server.')
        location.reload()
      })
    },
    logoutBtnClicked: function() {
      location.href = '/logout'
    }
  },
  mounted: async function() {
    let projects = await api.getProjects()
    console.log(projects)
    this.projects = projects
    for (var i in this.projects) {
      this.$set(this.projects[i], 'newProjectName', this.projects[i].projectName);

      for (var j in this.projects[i].todos) {
        this.$set(this.projects[i].todos[j], 'newTodoName', this.projects[i].todos[j].text);
      }
    }
  }
}
</script>

<style lang="scss">
body {
  background: #fff;
  color: #333;
  font-family: Lato, sans-serif;
}

#root-container {
  width: 1000px;
  margin: 10px auto 10px auto;
}

.project-container {
  float: left;
  display: block;
  width: 400px;
  margin: 10px;
}
.todo-container {;
  float: left;
  width: 400px;
  margin: 10px;
}
ul {
  margin: 0;
  padding: 0;
}
li * {
  float: left;
}
li, h3 {
  clear:both;
  list-style:none;
}

li.selected {
  background-color: blue;
}

input, button {
  outline: none;
}
button {
  background: none;
  border: 0px;
  color: #888;
  font-size: 15px;
  width: 60px;
  margin: 10px 0 0;
  font-family: Lato, sans-serif;
  cursor: pointer;
}
button:hover {
  color: #333;
}
/* Heading */
h3,
label[for='new-task'] {
  color: #333;
  font-weight: 700;
  font-size: 15px;
  border-bottom: 2px solid #333;
  padding: 30px 0 10px;
  margin: 0;
  text-transform: uppercase;
}
input[type="text"] {
  margin: 0;
  font-size: 18px;
  line-height: 18px;
  height: 18px;
  padding: 10px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 6px;
  font-family: Lato, sans-serif;
  color: #888;
}
input[type="text"]:focus {
  color: #333;
}

/* New Task */
label[for='new-task'] {
  display: block;
  margin: 0 0 20px;
}
input#new-task {
  float: left;
  width: 318px;
}
p > button:hover {
  color: #0FC57C;
}

/* Task list */
li {
  overflow: hidden;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}
li > input[type="checkbox"] {
  margin: 0 10px;
  position: relative;
  top: 15px;
}
li > label {
  font-size: 18px;
  line-height: 40px;
  width: 237px;
  padding: 0 0 0 11px;
}
li >  input[type="text"] {
  width: 226px;
}
li > .delete:hover {
  color: #CF2323;
}

/* Completed */
#completed-tasks label {
  text-decoration: line-through;
  color: #888;
}
</style>
