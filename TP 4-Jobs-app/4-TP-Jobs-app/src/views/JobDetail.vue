<template>
  <div class="job-detail">
    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="job" class="detail-container">
      <div class="detail-header">
        <button @click="closeDetail" class="btn-back">← Retour à la liste</button>
        <div class="actions">
          <router-link :to="`/Jobs/${job.id}`" class="btn btn-edit">Modifier</router-link>
          <button @click="confirmDelete" class="btn btn-delete">Supprimer</button>
        </div>
      </div>

      <div class="detail-card">
        <div class="detail-title-section">
          <h1>{{ job.title }}</h1>
          <span class="salary-large">{{ formatSalary(job.salary) }}</span>
        </div>

        <div class="detail-info">
          <div class="info-item">
            <span class="label">Entreprise:</span>
            <span class="value">{{ job.company }}</span>
          </div>
          <div class="info-item">
            <span class="label">Localisation:</span>
            <span class="value">{{ job.location }}</span>
          </div>
          <div class="info-item">
            <span class="label">Expérience requise:</span>
            <span class="value">{{ job.yearsOfExperience }} ans</span>
          </div>
          <div class="info-item">
            <span class="label">Date de publication:</span>
            <span class="value">{{ formatDate(job.createdAt) }}</span>
          </div>
        </div>

        <div class="description-section">
          <h2>Description</h2>
          <p>{{ job.description }}</p>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
      <div class="modal" @click.stop>
        <h3>Confirmer la suppression</h3>
        <p>Êtes-vous sûr de vouloir supprimer l'emploi "{{ job?.title }}" ?</p>
        <p class="warning">Cette action est irréversible.</p>
        <div class="modal-actions">
          <button @click="cancelDelete" class="btn btn-cancel">Annuler</button>
          <button @click="deleteJob" class="btn btn-confirm-delete">Supprimer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const API_URL = 'http://localhost:3000/jobs'

export default {
  name: 'JobDetail',
  props: {
    jobId: {
      type: [String, Number],
      required: true
    }
  },
  emits: ['close', 'deleted'],
  data() {
    return {
      job: null,
      loading: true,
      error: null,
      showDeleteModal: false
    }
  },
  watch: {
    jobId: {
      immediate: true,
      handler() {
        if (this.jobId) {
          this.fetchJob()
        }
      }
    }
  },
  methods: {
    fetchJob() {
      this.loading = true
      this.error = null
      fetch(`${API_URL}/${this.jobId}`)
        .then(response => response.json())
        .then(data => {
          this.job = data
          this.loading = false
        })
        .catch(err => {
          this.error = err.message
          console.error(err)
          this.loading = false
        })
    },
    closeDetail() {
      this.$emit('close')
    },
    confirmDelete() {
      this.showDeleteModal = true
    },
    cancelDelete() {
      this.showDeleteModal = false
    },
    deleteJob() {
      fetch(`${API_URL}/${this.job.id}`, {
        method: 'DELETE'
      })
        .then(() => {
          this.showDeleteModal = false
          this.$emit('deleted', this.job.id)
          this.$emit('close')
        })
        .catch(err => {
          this.error = err.message
          console.error(err)
          this.showDeleteModal = false
        })
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
    }
  }
}
</script>

<style scoped>
.job-detail {
  padding: 2rem 0;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.btn-back {
  padding: 0.5rem 1rem;
  background: #f0f0f0;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.btn-back:hover {
  background: #e0e0e0;
}

.actions {
  display: flex;
  gap: 1rem;
}

.detail-card {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.detail-title-section {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.detail-title-section h1 {
  color: #333;
  font-size: 2rem;
  flex: 1;
}

.salary-large {
  color: #27ae60;
  font-weight: bold;
  font-size: 1.5rem;
}

.detail-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-weight: 600;
  color: #666;
  font-size: 0.9rem;
}

.value {
  color: #333;
  font-size: 1.1rem;
}

.description-section {
  margin-top: 2rem;
}

.description-section h2 {
  color: #333;
  margin-bottom: 1rem;
}

.description-section p {
  color: #666;
  line-height: 1.8;
  font-size: 1.1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  font-size: 1rem;
  transition: all 0.3s;
}

.btn-edit {
  background: #3498db;
  color: white;
}

.btn-edit:hover {
  background: #2980b9;
}

.btn-delete {
  background: #e74c3c;
  color: white;
}

.btn-delete:hover {
  background: #c0392b;
}

.loading, .error {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
}

.error {
  color: #e74c3c;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal h3 {
  margin-bottom: 1rem;
  color: #333;
}

.modal p {
  margin-bottom: 0.5rem;
  color: #666;
}

.warning {
  color: #e74c3c;
  font-weight: 600;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
}

.btn-cancel {
  background: #95a5a6;
  color: white;
}

.btn-cancel:hover {
  background: #7f8c8d;
}

.btn-confirm-delete {
  background: #e74c3c;
  color: white;
}

.btn-confirm-delete:hover {
  background: #c0392b;
}
</style>

