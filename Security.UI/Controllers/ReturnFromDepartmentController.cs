using InventoryBLL;
using InventoryEntity;
using System;
using System.Collections.Generic;
using System.Web.Mvc;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class ReturnFromDepartmentController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public Int64 SaveReturnFromDepartment(inv_ReturnFromDepartment _inv_ReturnFromDepartment, List<inv_ReturnFromDepartmentDetail> returnFromDepartmentDetailLst)
        {
            using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
            {
                _inv_ReturnFromDepartment.CreateDate = DateTime.Now;
                _inv_ReturnFromDepartment.UpdateDate = DateTime.Now;
                Int64 ret = 0;

                try
                {
                    ret = InventoryBLL.Facade.ReturnFromDepartment.Add(_inv_ReturnFromDepartment);

                    if (ret > 0)
                    {
                        foreach (inv_ReturnFromDepartmentDetail _inv_ReturnFromDepartmentDetail in returnFromDepartmentDetailLst)
                        {
                            if (_inv_ReturnFromDepartmentDetail.ReturnQuantity > 0)
                            {
                                _inv_ReturnFromDepartmentDetail.ReturnId = ret;
                                InventoryBLL.Facade.ReturnFromDepartmentDetail.Add(_inv_ReturnFromDepartmentDetail);
                            }
                        }
                    }

                    ts.Complete();
                }
                catch (Exception ex)
                {
                    error_Log error = new error_Log();
                    error.ErrorMessage = ex.Message;
                    error.ErrorType = ex.GetType().ToString();
                    error.FileName = "ReturnFromDepartmentController";
                    new ErrorLogInventoryController().CreateErrorLog(error);
                }
                return ret;
            }
        }

        [HttpPost]
        public Int64 SaveReturnFromDepartmentDetail(inv_ReturnFromDepartmentDetail _inv_ReturnFromDepartmentDetail)
        {
            Int64 ret = 0;
            try
            {
                ret = InventoryBLL.Facade.ReturnFromDepartmentDetail.Add(_inv_ReturnFromDepartmentDetail);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReturnFromDepartmentController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }

        public JsonResult GetIssueByIssueId(Int64 issueId)
        {
            try
            {
                var list = InventoryBLL.Facade.StockIssue.GetById(issueId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReturnFromDepartmentController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }        
        }

        /*
        public JsonResult GetIssueDetailByIssueId(Int64 issueId)
        {
            try
            {
                var list = InventoryBLL.Facade.StockIssueDetail.GetByIssueId(issueId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReturnFromDepartment";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        */
        
        public JsonResult GetReturnFromDepartmentById(Int64 returnId)
        {
            try
            {
                var list = InventoryBLL.Facade.ReturnFromDepartment.GetAll(returnId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReturnFromDepartmentController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }

        }

        public JsonResult GetReturnFromDepartmentDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.ReturnFromDepartment.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReturnFromDepartmentController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetReturnFromDepartmentDetailByReturnId(Int64 returnId)
        {
            try
            {
                var list = InventoryBLL.Facade.ReturnFromDepartmentDetail.GetByReturnId(returnId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReturnFromDepartmentController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetReturnFromDepartmentDetailAddAttByDetailId(Int64 detailId)
        {
            try
            {
                var list = InventoryBLL.Facade.ReturnFromDepartmentDetailAdAttribute.GetByReturnDetailId(detailId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReturnFromDepartmentController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
                
            }
        }

        public  JsonResult GetReturnFromDepartmentDetailAddAttDetailByAddAttId(Int64 addAttributeId)
        {
            try
            {
                var list = InventoryBLL.Facade.ReturnFromDepartmentDetailAdAttributeDetail.GetByReturnDetailAdAttId(addAttributeId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {                
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReturnFromDepartmentController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
    }
}