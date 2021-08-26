using System;
using System.IO;
using System.Web.Mvc;
using SecurityBLL;
using SecurityEntity;
using DbExecutor;
using System.Net;

namespace Security.UI.Controllers
{
    public class BranchController : Controller
    {

        public bool CheckInternet()
        {
            try
            {
                using (var client = new WebClient())
                {
                    using (var stream = client.OpenRead("http://www.google.com"))
                    {
                        return true;
                    }
                }
            }
            catch (Exception ex)
            {

                return false;
            }
        }
        public JsonResult GetAllBranchGroup()
        {
            try
            {
                var list = Facade.BranchGroup.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BranchController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAllBranch()
        {
            try
            {
                var list = Facade.Branch.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BranchController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetAllBranchByUserID(int userId)
        {

            try
            {
                var list = Facade.Branch.GetByUserId(userId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BranchController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetBranchPaged(int StartRecordNo, int RowPerPage, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData = Facade.Branch.GetPaged(StartRecordNo, RowPerPage, "", "BranchName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BranchController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetDynamic(string searchCriteria, string orderBy)
        {

            try
            {
                var list = Facade.Branch.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BranchController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public int SaveTypeWiseBranch(ad_TypeWiseBranch ad_TypeWiseBranch)
        {
            int ret = 0;
            try
            {
                ret = Facade.TypeWiseBranch.Add(ad_TypeWiseBranch);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BranchController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
        
        [HttpPost]
        public int Save(ad_Branch ad_Branch)
        {
            if (ad_Branch.Address == null) { ad_Branch.Address = ""; }
            if (ad_Branch.ContactNo == null) { ad_Branch.ContactNo = ""; }
            if (ad_Branch.Fax == null) { ad_Branch.Fax = ""; }
            if (ad_Branch.Email == null) { ad_Branch.Email = ""; }
            if (ad_Branch.Web == null) { ad_Branch.Web = ""; }
            if (ad_Branch.Logo == null) { ad_Branch.Logo = ""; }
            if (ad_Branch.TIN == null) { ad_Branch.TIN = ""; }
            if (ad_Branch.VatRegNo == null) { ad_Branch.VatRegNo = ""; }
            if (ad_Branch.ManagerName == null) { ad_Branch.ManagerName = ""; }
            if (ad_Branch.TermsAndConditions == null) { ad_Branch.TermsAndConditions = ""; }
            if (ad_Branch.PromotionalNotes == null) { ad_Branch.PromotionalNotes = ""; }

            int ret = 0;
            try
            {
                using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
                {
                    if (ad_Branch.BranchId == 0)
                    {
                        ret = Facade.Branch.Add(ad_Branch);

                        ad_Customer aCust = new ad_Customer();
                        aCust.Title = string.IsNullOrEmpty(aCust.Title) ? "" : aCust.Title;
                        aCust.FirstName = "General";
                        aCust.MiddleName = string.IsNullOrEmpty(aCust.MiddleName) ? "" : aCust.MiddleName;
                        aCust.LastName = string.IsNullOrEmpty(aCust.LastName) ? "" : aCust.LastName;
                        aCust.BranchId = ret;
                        aCust.CustomerTypeId = 0;
                        aCust.DateOfBirth = System.DateTime.Now;
                        aCust.Gender = "Male";
                        aCust.CustomerCode = aCust.Web = aCust.TradingAs = string.Empty;
                        aCust.IsActive = true;
                        aCust.IsPayable = false;
                        aCust.ManualCustomerCode = "";
                        aCust.CreatorId = aCust.UpdatorId = 1;
                        aCust.CreateDate = aCust.UpdateDate = System.DateTime.Now;
                        string nonRegCusCode = SecurityBLL.Facade.Customer.Add(aCust);
                        if (nonRegCusCode != null && nonRegCusCode != string.Empty)
                        {
                            ad_CustomerAddress cusAddress = new ad_CustomerAddress();
                            cusAddress.CustomerCode = nonRegCusCode;
                            cusAddress.AddressType = "Mailing";
                            cusAddress.Mobile = "0";
                            cusAddress.Address = cusAddress.ContactPerson = cusAddress.ContactDesignation = cusAddress.Phone = cusAddress.Email = cusAddress.Fax = string.Empty;
                            cusAddress.IsDefault = true;
                            cusAddress.CreatorId = cusAddress.UpdatorId = 1;
                            cusAddress.CreateDate = cusAddress.UpdateDate = System.DateTime.Now;
                            SecurityBLL.Facade.CustomerAddress.Add(cusAddress);
                        }
                    }
                    else
                    {
                        // DeletePysicalFiles(ad_Branch.Logo);
                        ret = Facade.Branch.Update(ad_Branch);
                    }

                    ts.Complete();
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BranchController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
        [HttpPost]
        public int Delete(int BranchId, string oldUrl)
        {
            int ret = 0;
            try
            {
                ret = Facade.Branch.Delete(BranchId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BranchController";
                new ErrorLogController().CreateErrorLog(error);
            }
            if (oldUrl != "")
            {
                DeletePysicalFiles(oldUrl);
            }
           
            return ret;
        }
        [HttpPost]
        public JsonResult SaveFiles(string odlUrl)
        {
            if (!odlUrl.Equals("undefined"))
            {
                DeletePysicalFiles(odlUrl);
            }
            string Message, fileName, actualFileName;
            Message = fileName = actualFileName = string.Empty;
            bool flag = false;
            if (Request.Files.Count != 0)
            {
                var file = Request.Files[0];
                actualFileName = file.FileName;
                fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                int size = file.ContentLength;
                try
                {
                    file.SaveAs(Path.Combine(Server.MapPath("~/UploadedFiles"), actualFileName));
                }
                catch (Exception)
                {
                    Message = "File upload failed! Please try again";
                }
            }
            return new JsonResult { Data = new { Message = Message, Status = flag } };
        }
        public void DeletePysicalFiles(string fileName)
        {
            try
            {
                System.IO.File.Delete(Request.PhysicalApplicationPath + fileName);
            }
            catch (Exception)
            {
              
            }
        }
	}
}