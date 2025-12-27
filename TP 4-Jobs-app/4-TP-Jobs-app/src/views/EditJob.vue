<template>
  <div class="edit-job">
    <div class="form-header">
      <h2>Modifier l'Emploi</h2>
      <button @click="$router.push('/')" class="btn-back">← Retour</button>
    </div>

    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <form v-else @submit.prevent="updateJob" class="job-form">
      <div class="form-group">
        <label for="title">Titre *</label>
        <input 
          type="text" 
          id="title" 
          v-model="formData.title" 
          required
          placeholder="Ex: Développeur Full Stack"
        />
      </div>

      <div class="form-group">
        <label for="description">Description *</label>
        <textarea 
          id="description" 
          v-model="formData.description" 
          required
          rows="5"
          placeholder="Décrivez le poste, les responsabilités, etc."
        ></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="salary">Salaire (€) *</label>
          <input 
            type="number" 
            id="salary" 
            v-model.number="formData.salary" 
            required
            min="0"
            placeholder="50000"
          />
        </div>

        <div class="form-group">
          <label for="yearsOfExperience">Années d'expérience *</label>
          <input 
            type="number" 
            id="yearsOfExperience" 
            v-model.number="formData.yearsOfExperience" 
            required
            min="0"
            placeholder="3"
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="company">Entreprise *</label>
          <input 
            type="text" 
            id="company" 
            v-model="formData.company" 
            required
            placeholder="Nom de l'entreprise"
          />
        </div>

        <div class="form-group">
          <label for="location">Localisation *</label>
          <input 
            type="text" 
            id="location" 
            v-model="formData.location" 
            required
            placeholder="Ex: Paris, Lyon"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="createdAt">Date de création *</label>
        <input 
          type="date" 
          id="createdAt" 
          v-model="formData.createdAt" 
          required
        />
      </div>

      <div v-if="updateError" class="error-message">{{ updateError }}</div>

      <div class="form-actions">
        <button type="button" @click="$router.push('/')" class="btn btn-cancel">
          Annuler
        </button>
        <button type="submit" class="btn btn-submit" :disabled="updating">
          {{ updating ? 'Modification en cours...' : 'Enregistrer les modifications' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
const API_URL = 'http://localhost:3000/jobs'

export default {
  name: 'EditJob',
  data() {
    return {
      formData: {
        title: '',
        description: '',
        salary: null,
        yearsOfExperience: null,
        company: '',
        location: '',
        createdAt: ''
      },
      loading: true,
      updating: false,
      error: null,
      updateError: null
    }
  },
  computed: {
    jobId() {
      return this.$route.params.id
    }
  },
  mounted() {
    this.fetchJob()
  },
  methods: {
    fetchJob() {
      this.loading = true
      this.error = null
      fetch(`${API_URL}/${this.jobId}`)
        .then(response => response.json())
        .then(data => {
          this.formData = {
            title: data.title,
            description: data.description,
            salary: data.salary,
            yearsOfExperience: data.yearsOfExperience,
            company: data.company,
            location: data.location,
            createdAt: data.createdAt
          }
          this.loading = false
        })
        .catch(err => {
          this.error = err.message
          console.error(err)
          this.loading = false
        })
    },
    updateJob() {
      this.updating = true
      this.updateError = null

      fetch(`${API_URL}/${this.jobId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.formData)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Erreur lors de la modification de l\'emploi')
          }
          this.updating = false
          this.$router.push('/')
        })
        .catch(err => {
          this.updateError = err.message
          console.error(err)
          this.updating = false
        })
    }
  }
}
</script>

<style scoped>
.edit-job {
  padding: 2rem 0;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.form-header h2 {
  color: #333;
  font-size: 2rem;
}

.job-form {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 800px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 600;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 5px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.error-message {
  background: #fee;
  color: #e74c3c;
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  background: #95a5a6;
  color: white;
}

.btn-cancel:hover {
  background: #7f8c8d;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
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

.loading, .error {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
}

.error {
  color: #e74c3c;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>

