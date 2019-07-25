<template>
<div class="todo-container">
  <p>
    <label for="new-task">Add Item</label>
    <input id="new-task" type="text" v-model="newTodo"><button @click="addTodoBtnClicked">Add</button>
  </p>

  <h3>Things to do</h3>
  <ul id="incomplete-tasks">
    <li v-for="(todo, index) in todos">
      <input type="checkbox" @change="completedCheckboxClicked(todo.id)" v-model="todo.completed">
      <label v-if="!todo.edited">{{ todo.text }}</label>
      <input type="text" v-if="todo.edited" v-model="todo.newTodoName">
      <button class="edit" @click="editTodoBtnClicked(todo.id)">Edit</button>
      <button class="delete" @click="deleteTodoBtnClicked(todo.id)">Delete</button>
    </li>
  </ul>

  <h3>Completed</h3>
  <ul id="completed-tasks">
    <li v-for="(todo, index) in completedTodos">
      <input type="checkbox" v-model="todo.completed">
      <label v-if="!todo.edited">{{ todo.text }}</label>
      <input type="text" v-if="todo.edited" v-model="todo.newTodoName">
      <button class="edit" @click="editTodoBtnClicked(todo.id)">Edit</button>
      <button class="delete">Delete</button>
    </li>
  </ul>
</div>
</template>

<script>
export default {
  props: ['projects', 'currentIndex'],
  data: function() {
    return {
      newTodo: ''
    }
  },
  methods: {
    completedCheckboxClicked: function(id) {
      this.$emit('completed-checkbox-clicked', id);
    },
    addTodoBtnClicked: function() {
      var todoName = this.newTodo.trim();
      if (todoName) {
        this.$emit('add-todo-btn-clicked', todoName);
        this.newTodo = '';
      } else {
        alert('must not be empty');
      }
    },
    editTodoBtnClicked: function(id) {
      this.$emit('edit-todo-btn-clicked', id);
    },
    deleteTodoBtnClicked: function(id) {
      this.$emit('delete-todo-btn-clicked', id);
    }
  },
  computed: {
    todos: function() {
      if (this.projects && this.projects[this.currentIndex] && this.projects[this.currentIndex].todos) {
        return this.projects[this.currentIndex].todos.filter(e => {
          return !e.completed;
        });
      } else {
        return null;
      }
    },
    completedTodos: function() {
      if (this.projects && this.projects[this.currentIndex] && this.projects[this.currentIndex].todos) {
        return this.projects[this.currentIndex].todos.filter(e => {
          return e.completed;
        });
      } else {
        return null;
      }
    }
  }
}
</script>
