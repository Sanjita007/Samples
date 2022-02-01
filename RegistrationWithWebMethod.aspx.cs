using JSWithWebForms.BusinessLogic;
using JSWithWebForms.Models;
using System;
using System.Web.Mvc;
using System.Web.Services;
using System.Web.UI;

namespace JSWithWebForms
{
    public partial class RegistrationWithWebMethod :Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        [HttpPost]
        [System.Web.Script.Services.ScriptMethod(UseHttpGet = false, ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public static object Register(RegistrationModel entity)
        {
            return BLLRegistration.Register(entity);
        }

        [WebMethod]
        [HttpGet]
        [System.Web.Script.Services.ScriptMethod(UseHttpGet = true, ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public static object GetAll()
        {
            return BLLRegistration.GetRegistrations();
        }
    }
}