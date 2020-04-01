import apiService from './api.service';

class ProjectsService extends apiService {

   constructor() {
      super();
   }

    getProjects(company_id) {
       //return promise to be executed by Dashboard.
      return this.$http.get('/api/projects?company_id='+company_id)
          .then((response) => {
              console.log('projects data before interceptor', response  )
              return response.data.body;
          })
          .catch((error) => {
              console.log('get projects error', error)
              return error
          })
   }
}

export default ProjectsService;
