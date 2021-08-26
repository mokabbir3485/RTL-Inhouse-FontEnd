using DbExecutor;
using SecurityBLL;
using SecurityEntity;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Security.UI.Controllers
{
    public class CompanyController : Controller
    {
        //
        // GET: /Company/
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetCompanyPaged(int startRecordNo, int rowPerPage, string sortColumn, string sortOrder, string whereClause, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData = Facade.CompanyBLL.GetPaged(startRecordNo, rowPerPage, whereClause, sortColumn, sortOrder, ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CompanyController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetCompanyAddressByCompanyId(int companyId)
        {

            try
            {
                var list = Facade.CompanyAddressBLL.GetByCompanyId(companyId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CompanyController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetCompanyBillPolicyByCompanyId(int companyId)
        {

            try
            {
                var list = Facade.CompanyBillPolicyBLL.GetByCompanyId(companyId);
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

        public JsonResult GetCompanyDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.CompanyBLL.GetDynamic(searchCriteria, orderBy);
                string contentType = "application/json";

                return Json(list, contentType, Encoding.UTF8, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CompanyController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetCompanyType(string searchCriteria, string orderBy)
        {
            try
            {
              
                var list = Facade.CompanyTypeBLL.GetDynamic(searchCriteria, orderBy);
                string contentType = "application/json";
                return Json(list, contentType, Encoding.UTF8, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CompanyController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public int SaveCompany(ad_Company _ad_Company, List<ad_CompanyAddress> _ad_CompanyAddressList, List<ad_CompanyBillPolicy> ad_CompanyBillPolicyList)
        {
            int ret = 0;
            try
            {
                _ad_Company.CreateDate = DateTime.Now;
                _ad_Company.UpdateDate = DateTime.Now;
                int companyId = _ad_Company.CompanyId;
                if (String.IsNullOrEmpty(_ad_Company.Web))
                    _ad_Company.Web = "";

                if (_ad_Company.CompanyId == 0)
                {                    
                    ret = Facade.CompanyBLL.Add(_ad_Company);
                    companyId = ret;
                }
                else
                {
                 
                    ret = Facade.CompanyBLL.Update(_ad_Company);
                }

                foreach (var companyAddress in _ad_CompanyAddressList)
                {
                    if (String.IsNullOrEmpty(companyAddress.AddressCompanyName))
                        companyAddress.AddressCompanyName = "";
                    if (String.IsNullOrEmpty(companyAddress.ContactPerson))
                        companyAddress.ContactPerson = "";
                    if (String.IsNullOrEmpty(companyAddress.ContactDesignation))
                        companyAddress.ContactDesignation = "";
                    if (String.IsNullOrEmpty(companyAddress.Phone))
                        companyAddress.Phone = "";
                    if (String.IsNullOrEmpty(companyAddress.Mobile))
                        companyAddress.Mobile = "";
                    if (String.IsNullOrEmpty(companyAddress.Email))
                        companyAddress.Email = "";
                    if (String.IsNullOrEmpty(companyAddress.Fax))
                        companyAddress.Fax = "";
                    if (String.IsNullOrEmpty(companyAddress.VatRegNo))
                        companyAddress.VatRegNo = "";
                    if (String.IsNullOrEmpty(companyAddress.TIN))
                        companyAddress.TIN = "";


                    companyAddress.CompanyId = companyId;
                    Facade.CompanyAddressBLL.Add(companyAddress);
                }

                if (ad_CompanyBillPolicyList != null)
                {
                    foreach (var companyBillPolicy in ad_CompanyBillPolicyList)
                    {
                        companyBillPolicy.CompanyId = companyId;
                        if (String.IsNullOrEmpty(companyBillPolicy.PolicyDescription))
                            companyBillPolicy.PolicyDescription = "";
                        Facade.CompanyBillPolicyBLL.Add(companyBillPolicy);
                    }
                }


            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CompanyController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }


       
    }
}