using DbExecutor;
using ExportBLL;
using ExportEntity;
using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace Security.UI.Controllers
{
    public class ExpApprovalController : Controller
    {
        public JsonResult GetAllApproval()
        {
            try
            {
                var approvalList = Facade.exp_Approval.GetAll();
                return Json(approvalList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log
                {
                    ErrorMessage = ex.Message,
                    ErrorType = ex.GetType().ToString(),
                    FileName = "ExpApprovalController"
                };
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetApprovalDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.exp_Approval.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log
                {
                    ErrorMessage = ex.Message,
                    ErrorType = ex.GetType().ToString(),
                    FileName = "ExpApprovalController"
                };
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetApprovalPaged(int startRecordNo, int rowPerPage, int rows)
        {
            try
            {
                var getApprovalPaged = new
                {
                    ListData = Facade.exp_Approval.GetPaged(startRecordNo, rowPerPage, "[IsApproved]=0", "[ApprovedDate]", "DESC", ref rows),
                    TotalRecord = rows
                };
                return Json(getApprovalPaged, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log
                {
                    ErrorMessage = ex.Message,
                    ErrorType = ex.GetType().ToString(),
                    FileName = "ExpApprovalController"
                };
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public Int64 Save(exp_Approval expApproval)
        {
            Int64 ret = 0;
            try
            {
                expApproval.UpdateDate = DateTime.Now;
                ret = expApproval.ApprovalId == 0 ? Facade.exp_Approval.Add(expApproval) : Facade.exp_Approval.Update(expApproval);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log
                {
                    ErrorMessage = ex.Message,
                    ErrorType = ex.GetType().ToString(),
                    FileName = "ExpApprovalController"
                };
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public Int64 UpdateApproval(List<exp_Approval> expApproval)
        {
            Int64 ret = 0;
            try
            {
                foreach (exp_Approval approval in expApproval)
                {
                    approval.ApprovedDate = DateTime.Now;
                    approval.UpdateDate = DateTime.Now;
                    if (approval.ApprovalPassword == null) approval.ApprovalPassword = "";
                    ret = Facade.exp_Approval.Update(approval);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log
                {
                    ErrorMessage = ex.Message,
                    ErrorType = ex.GetType().ToString(),
                    FileName = "ExpApprovalController"
                };
                new ErrorLogController().CreateErrorLog(error);
            }

            return ret;
        }

        public int Delete(int approvalId)
        {
            int ret = 0;
            try
            {
                ret = Facade.exp_Approval.Delete(approvalId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log
                {
                    ErrorMessage = ex.Message,
                    ErrorType = ex.GetType().ToString(),
                    FileName = "ExpApprovalController"
                };
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
        public JsonResult GetCommercialInvoice(string approvalType)
        {
            try
            {
                var commercialInvoice = Facade.exp_Approval.GetCommercialInvoice(approvalType);
                return Json(commercialInvoice, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log
                {
                    ErrorMessage = ex.Message,
                    ErrorType = ex.GetType().ToString(),
                    FileName = "ExpApprovalController"
                };
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetExpGenerate(string approvalType)
        {
            try
            {
                var expGenerate = Facade.exp_Approval.GetExpGenerate(approvalType);
                return Json(expGenerate, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log
                {
                    ErrorMessage = ex.Message,
                    ErrorType = ex.GetType().ToString(),
                    FileName = "ExpApprovalController"
                };
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetProformaInvoice(string approvalType)
        {
            try
            {
                var proformaInvoice = Facade.exp_Approval.GetProformaInvoice(approvalType);
                return Json(proformaInvoice, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log
                {
                    ErrorMessage = ex.Message,
                    ErrorType = ex.GetType().ToString(),
                    FileName = "ExpApprovalController"
                };
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetSalesOrder(string approvalType)
        {
            try
            {
                var salesOrder = Facade.exp_Approval.GetSalesOrder(approvalType);
                return Json(salesOrder, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log
                {
                    ErrorMessage = ex.Message,
                    ErrorType = ex.GetType().ToString(),
                    FileName = "ExpApprovalController"
                };
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult CheckDuplicate(string approvalType, string approvalPassword)
        {
            try
            {
                var duplicateList = Facade.exp_Approval.DuplicateCheck(approvalType, approvalPassword);
                return Json(duplicateList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log
                {
                    ErrorMessage = ex.Message,
                    ErrorType = ex.GetType().ToString(),
                    FileName = "ExpApprovalController"
                };
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult exp_ExpAmendment_GetForEdit(string approvalType, string approvalPassword)
        {
            try
            {
                var expExpAmendmentList = Facade.exp_Approval.exp_ExpAmendment_GetForEdit(approvalType, approvalPassword);
                return Json(expExpAmendmentList, JsonRequestBehavior.AllowGet); 
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log
                {
                    ErrorMessage = ex.Message,
                    ErrorType = ex.GetType().ToString(),
                    FileName = "ExpApprovalController"
                };
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult exp_PiAmendment_GetForEdit(string approvalType, string approvalPassword)
        {
            try
            {
                var expPiAmendmentList = Facade.exp_Approval.exp_PiAmendment_GetForEdit(approvalType, approvalPassword);
                return Json(expPiAmendmentList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log
                {
                    ErrorMessage = ex.Message,
                    ErrorType = ex.GetType().ToString(),
                    FileName = "ExpApprovalController"
                };
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult exp_CiAmendment_GetForEdit(string approvalType, string approvalPassword)
        {
            try
            {
                var expCiAmendmenList = Facade.exp_Approval.exp_CiAmendment_GetForEdit(approvalType, approvalPassword);
                return Json(expCiAmendmenList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log
                {
                    ErrorMessage = ex.Message,
                    ErrorType = ex.GetType().ToString(),
                    FileName = "ExpApprovalController"
                };
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
    }
}