<template>
  <div class="home">
    <div v-if="!selectedJobId" class="home-content">
      <div class="header">
        <h2>Liste des Emplois</h2>
        <router-link to="/add" class="btn btn-primary">
          <span>+</span> Ajouter un Emploi
        </router-link>
      </div>

      <FilterNav 
        :filter="currentFilter" 
        @filter-change="updateFilter"
      />

      <div v-if="loading" class="loading">Chargement...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else class="jobs-grid">
        <div 
          v-for="job in filteredJobs" 
          :key="job.id" 
          class="job-card"
          @click="viewJobDetail(job.id)"
        >
          <div class="job-header">
            <h3>{{ job.title }}</h3>
            <span class="salary">{{ formatSalary(job.salary) }}</span>
          </div>
          <p class="company">{{ job.company }} - {{ job.location }}</p>
          <p class="description">{{ truncateDescription(job.description) }}</p>
          <div class="job-footer">
            <span class="experience">{{ job.yearsOfExperience }} ans d'expérience</span>
            <span class="date">{{ formatDate(job.createdAt) }}</span>
          </div>
        </div>
      </div>

      <div v-if="!loading && filteredJobs.length === 0" class="no-jobs">
        <p>Aucun emploi trouvé.</p>
      </div>
    </div>

    <JobDetail 
      v-else
      :job-id="selectedJobId"
      @close="closeJobDetail"
      @deleted="handleJobDeleted"
    />
  </div>
</template>

<script>
import FilterNav from '../components/FilterNav.vue'
import JobDetail from './JobDetail.vue'

const API_URL = 'http://localhost:3000/jobs'

export default {
  name: 'Home',
  components: {
    FilterNav,
    JobDetail
  },
  data() {
    return {
      jobs: [],
      loading: true,
      error: null,
      currentFilter: 'all',
      selectedJobId: null
    }
  },
  computed: {
    filteredJobs() {
      if (this.currentFilter === 'all') {
        return this.jobs
      }
      return this.jobs.filter(job => {
        if (this.currentFilter === 'recent') {
          const jobDate = new Date(job.createdAt)
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          return jobDate >= weekAgo
        }
        if (this.currentFilter === 'high-salary') {
          return job.salary >= 50000
        }
        return true
      })
    }
  },
  mounted() {
    this.fetchJobs()
  },
  activated() {
    // Recharger les jobs si on revient sur cette page
    this.fetchJobs()
  },
  methods: {
    fetchJobs() {
      this.loading = true
      this.error = null
      fetch(API_URL)
        .then(response => response.json())
        .then(data => {
          this.jobs = data
          this.loading = false
        })
        .catch(err => {
          this.error = err.message
          console.error(err)
          this.loading = false
        })
    },
    updateFilter(filter) {
      this.currentFilter = filter
    },
    viewJobDetail(id) {
      this.selectedJobId = id
    },
    closeJobDetail() {
      this.selectedJobId = null
    },
    handleJobDeleted(jobId) {
      this.jobs = this.jobs.filter(job => job.id !== jobId)
      this.selectedJobId = null
    },
    formatSalary(salary) {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(salary)
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    truncateDescription(description) {
      return description.length > 100 
        ? description.substring(0, 100) + '...' 
        : description
    }
  }
}
</script>

<style scoped>
.home {
  padding: 2rem 0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h2 {
  color: #333;
  font-size: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #e74c3c;
}

.jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.job-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.job-header h3 {
  color: #333;
  font-size: 1.3rem;
  flex: 1;
}

.salary {
  color: #27ae60;
  font-weight: bold;
  font-size: 1.1rem;
}

.company {
  color: #667eea;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.job-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  font-size: 0.9rem;
  color: #888;
}

.experience {
  background: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
}

.no-jobs {
  text-align: center;
  padding: 3rem;
  color: #888;
  font-size: 1.2rem;
}

.home-content {
  width: 100%;
}
</style>

