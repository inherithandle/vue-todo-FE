<template>
<div class="project-container">
  <p>
    <label for="new-task">Add Project</label>
    <input type="text" v-model="newProjectName"><button @click="addProjectBtnClicked">Add</button>
  </p>
  <h3>Project</h3>
  <ul id="projects">
    <li v-for="(project, index) in projects" v-bind:class="{'selected' : project.selected}" @click="liClicked(index, $event)">
      <label v-if="!project.edited">{{project.projectName}}</label>
      <input type="text" v-if="project.edited" v-model="project.newProjectName">
      <button class="edit" @click="editBtnClicked(index)">Edit</button>
      <button class="delete" @click="deleteBtnClicked(index)">Delete</button>
    </li>
  </ul>
</div>
</template>

<script>
export default {
  props: ['projects'],
  data: function() {
    return {
      newProjectName: ''
    }
  },
  methods: {
    addBtnClicked: function() {
      var newTodo;
      newTodo = this.newTodo.trim();

      if (newTodo === '') {
        alert("todo name is required");
      } else {
        axios
          .post('/rest/projects')
          .then(response => {
            var a = response;
          });
      }
    },
    liClicked: function(index, event) {
      this.$emit('project-selected', index);
    },
    editBtnClicked: function(index) {
      this.$emit('edit-btn-clicked', index);
    },
    deleteBtnClicked: function(index) {
      this.$emit('delete-btn-clicked', index);
    },
    addProjectBtnClicked: function() {
      this.$emit('add-project-btn-clicked', this.newProjectName);
    }
  }
}
</script>
