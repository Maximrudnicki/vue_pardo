<template>
  <div>
    <p></p>
    <router-link class="button" to="/groups/">Back</router-link>
    <div v-if="group">
      <p>
        <strong>{{ group.title }}</strong> {{ group.group_id }}
      </p>
      <h4>Students</h4>
      <ul>
        <li v-for="student in group.students">
          <div>
            <!-- {{ student }} <strong v-if="studentInfo">, {{ studentInfo.email }}, {{ studentInfo.username }}</strong> 
            <button @click="findStudent(group.group_id, student)" >Details</button> -->
            {{ student }}
            <!-- <button @click="showDetails(student), findStudent(student, group.group_id)"class="action-button">View</button> -->
            <router-link
              class="button"
              :to="'/groups/' + group.group_id + '/' + student"
              >View Details</router-link
            >
            <StudentDetails
              :show="showStudentDetails"
              :student="studentDetails"
              @cancel="cancelStudentDetails"
            />
          </div> <br>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import StudentDetails from "./modals/StudentDetails.vue";

export default {
  components: {
    StudentDetails,
  },
  data() {
    return {
      showStudentDetails: null,
      studentDetails: null,
    };
  },
  mounted() {
    const formData = {
      group_id: this.$route.params.id,
    };
    this.$store.dispatch("fetchGroup", formData);
  },
  computed: {
    group() {
      return this.$store.state.group;
    },
  },
  methods: {
    showDetails(studentId) {
      console.log(studentId);
      this.showStudentDetails = studentId;
    },
    cancelStudentDetails() {
      this.showStudentDetails = null;
    },
    findStudent(studentId, groupId) {
      const formData = {
        student_id: studentId,
        group_id: groupId,
      };
      const studentPromise = this.$store.dispatch("findStudent", formData);
      studentPromise.then((studentDetails) => {
        this.studentDetails = studentDetails;
      });
    },
  },
};
</script>

<style scoped>
.action-button {
  background-color: #fff;
  border: none;
  color: teal;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid teal;
}

.button {
  background-color: #fff;
  border: none;
  color: teal;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid teal;
  text-decoration: none;
}

.button:hover {
  background-color: #f0f0f0;
}
.action-button:hover {
  background-color: #f0f0f0;
}
</style>
