using JSWithWebForms.Models;
using System;
using System.Web.Mvc;
using System.Web.Services;
using System.Web.UI;

namespace JSWithWebForms
{
    public partial class LoginFormWithWebMethods : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        [HttpPost]
        [System.Web.Script.Services.ScriptMethod(UseHttpGet = false, ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public static object ValidateUser(LoginModel loginModel)
        {
            return  new { Data = new { Success = loginModel.UserName == "admin" && loginModel.Password == "admin" } };
        }
    }
}