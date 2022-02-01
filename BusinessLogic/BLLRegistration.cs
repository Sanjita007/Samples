using JSWithWebForms.Models;
using System.Collections.Generic;
using System.Linq;

namespace JSWithWebForms.BusinessLogic
{
    public class BLLRegistration
    {
        public static List<RegistrationModel> registrations = new List<RegistrationModel>()
        {
            new RegistrationModel()
            {
                Name="Joey Tribiani",
                Address="New York",
                Email="joey@gmail.com",
                Phone="01000000",
                Remarks="test"
            },
        new RegistrationModel()
            {
                Name="Jane Doe",
                Address="New Jersey",
                Email="jane@gmail.com",
                Phone="01110000",
                Remarks="test 1"
            }};
        
        public static bool Register(RegistrationModel model)
        {
            registrations.Add(model);
            return true;
        }

        public static List<RegistrationModel> GetRegistrations() => registrations;
        public static RegistrationModel GetRegistrationsByName(string name) => registrations.Where(r=> r.Name == name).FirstOrDefault();
        public static bool DeleteRegistration(string name) => registrations.Remove(registrations.Where(r => r.Name == name).FirstOrDefault());
    }
}