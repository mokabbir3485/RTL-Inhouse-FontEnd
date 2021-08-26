using SecurityBLL;
using SecurityEntity;
using System;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class CustomerEntryController : Controller
    {
        //
        // GET: /CustomerEntry/
        protected override JsonResult Json(object data, string contentType, System.Text.Encoding contentEncoding, JsonRequestBehavior behavior)
        {
            return new JsonResult()
            {
                Data = data,
                ContentType = contentType,
                ContentEncoding = contentEncoding,
                JsonRequestBehavior = behavior,
                MaxJsonLength = Int32.MaxValue
            };
        }
        
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetAllCustomertype()
        {

            try
            {
                var list = Facade.ad_CustomerType.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CustomerEntryController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAllCustomer()
        {
            try
            {
                var list = Facade.Customer.GetAll();
                string contentType = "application/json";

                return Json(list, contentType, Encoding.UTF8, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CustomerEntryController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAllCustomerNonRegistered()
        {
            try
            {
                var list = Facade.Customer.GetAllNonRegistered();
                string contentType = "application/json";

                return Json(list, contentType, Encoding.UTF8, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CustomerEntryController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAllCustomerDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.Customer.GetDynamic(searchCriteria,orderBy);
                string contentType = "application/json";

                return Json(list, contentType, Encoding.UTF8, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CustomerEntryController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetCustomerPaged(int StartRecordNo, int RowPerPage, string whClause, int rows, int userId)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData = Facade.Customer.GetPaged(StartRecordNo, RowPerPage, whClause+ " AND C.BranchId IN (SELECT BranchId FROM ad_Department D INNER JOIN s_UserDepartment UD ON UD.DepartmentId=D.DepartmentId AND UD.UserId=" + userId + ")", "FirstName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CustomerEntryController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
     
        [HttpPost]
        public string SaveCustomer(ad_Customer customer)
        {
            string ret = string.Empty;
            ad_Customer savedCus = new ad_Customer();
            customer.CreateDate = DateTime.Now;
            customer.UpdateDate = DateTime.Now;
            if (customer.Web == null)
                customer.Web = "";
            if (customer.TradingAs == null)
                customer.TradingAs = "";
            if (customer.MiddleName == null)
                customer.MiddleName = "";
            if (customer.LastName == null)
                customer.LastName = "";
            if (customer.Title == null)
                customer.Title = "";
            if (customer.DateOfBirth == null)
                customer.DateOfBirth = DateTime.Now;
            customer.ManualCustomerCode = string.IsNullOrEmpty(customer.ManualCustomerCode) ? "" : customer.ManualCustomerCode;
            try
            {
                if (customer.CustomerId == 0)
                {
                    ret = Facade.Customer.Add(customer);
                }
                else
                {
                    ret = Convert.ToString(Facade.Customer.Update(customer));
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CustomerEntryController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        public JsonResult GetCustomerById(int customerId)
        {

            try
            {
                var list = Facade.Customer.GetById(customerId).FirstOrDefault();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CustomerEntryController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        /*
        public int UpdateCustomer(ad_Customer customer)
        {
            int ret = 0;
            customer.UpdatorId = 1;
            customer.UpdateDate = DateTime.Now;
            if (customer.MiddleName == null)
                customer.MiddleName = "";
            if (customer.LastName == null)
                customer.LastName = "";
            if (customer.Web == null)
                customer.Web = "";
            if (customer.TradingAs == null)
                customer.TradingAs = "";
            if (customer.Title == null)
                customer.Title = "";
            if (customer.DateOfBirth == null)
                customer.DateOfBirth = DateTime.Now;
            try
            {
                ret = Facade.Customer.Update(customer);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CustomerEntryController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
        */
        [HttpPost]
        public int DeleteCustomer(int customerId)
        {
            int ret = 0;
            try
            {

                ret = Facade.Customer.Delete(customerId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CustomerEntryController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        public JsonResult GetAllCustomerAddress(string customerCode)
        {

            try
            {
                var list = Facade.CustomerAddress.GetByCustomerCode(customerCode);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CustomerEntryController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public int SaveCustomerAddress(ad_CustomerAddress customerAddress)
        {
            int ret = 0;
            customerAddress.Fax = "";
            customerAddress.CreatorId = 1;
            customerAddress.CreateDate = DateTime.Now;
            customerAddress.UpdatorId = 1;
            customerAddress.UpdateDate = DateTime.Now;
            if (customerAddress.ContactPerson == null)
                customerAddress.ContactPerson = "";
            if (customerAddress.ContactDesignation == null)
                customerAddress.ContactDesignation = "";
            if (customerAddress.Phone == null)
                customerAddress.Phone = "";
            //if (customerAddress.Mobile == null)
            //    customerAddress.Mobile = "";
            if (customerAddress.Email == null)
                customerAddress.Email = "";
            if (customerAddress.Address == null)
                customerAddress.Address = "";

            try
            {
                if (customerAddress.AddressId == 0)
                {
                    ret = Facade.CustomerAddress.Add(customerAddress);
                }

            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CustomerEntryController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        public JsonResult GetAllCustomerBillPolicy(string customerCode)
        {

            try
            {
                var list = Facade.CustomerBillPolicy.GetByCustomerCode(customerCode);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CustomerEntryController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public int SaveCustomerBillPolicy(ad_CustomerBillPolicy customerBillPolicy)
        {
            int ret = 0;
            try
            {
                if (customerBillPolicy.PolicyId == 0)
                {

                    ret = Facade.CustomerBillPolicy.Add(customerBillPolicy);
                }

            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CustomerEntryController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        public JsonResult GetCustomerAddressDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.CustomerAddress.GetDynamic(searchCriteria, orderBy);
                string contentType = "application/json";

                return Json(list, contentType, Encoding.UTF8, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CustomerEntryController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public string GetCustomerCodeById(int customerId)
        {

            try
            {
                return Facade.Customer.GetById(customerId).FirstOrDefault().CustomerCode;
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CustomerEntryController";
                new ErrorLogController().CreateErrorLog(error);
                return null;
            }
        }
    }
}