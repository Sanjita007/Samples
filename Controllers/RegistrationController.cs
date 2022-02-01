using JSWithWebForms.BusinessLogic;
using JSWithWebForms.Models;
using System.Collections.Generic;
using System.Web.Http;

namespace JSWithWebForms.Controllers
{
    public class RegistrationController : ApiController
    {
        [Route("api/Registration/Register")]
        [AcceptVerbs("POST")]

        public object Register(RegistrationModel entity)
        {
            return BLLRegistration.Register(entity);
        }

        [Route("api/Registration/GetAll")]
        [AcceptVerbs("GET")]
        public List<RegistrationModel> GetAll()
        {
            return BLLRegistration.GetRegistrations();
        }

        [Route("api/Registration/GetByName")]
        [AcceptVerbs("GET")]
        public RegistrationModel GetAll(string name)
        {
            return BLLRegistration.GetRegistrationsByName(name);
        }
    }
}