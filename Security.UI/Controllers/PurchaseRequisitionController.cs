using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Security.UI.Controllers;
using SecurityEntity;
using System.Web.Mvc;
using DbExecutor;
using InventoryBLL;
using InventoryEntity;
using InventoryDAL;


namespace Security.UI.Controllers
{
    public class PurchaseRequisitionController : Controller
    {      
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetAllPurchseRequisition()
        {
            try
            {

                var rolList = Facade.inv_PurchaseRequisitionBLL.GetAll();
                return Json(rolList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseRequisitionController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetPerchaseRequisitionPaged(int StartRecordNo, int RowPerPage, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData = Facade.inv_PurchaseRequisitionBLL.GetPaged(StartRecordNo, RowPerPage, " ", "PurchaseRequisitionNo", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseRequisitionController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetPurchaseRequisitionCheck(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.inv_PurchaseRequisitionBLL.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseRequisitionController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public int Save(inv_PurchaseRequisition inv_PurchaseRequisition)
        {
            int ret = 0;
            try
            {
                inv_PurchaseRequisition.CreateDate = DateTime.Now;
                inv_PurchaseRequisition.UpdateDate = DateTime.Now;
                if (inv_PurchaseRequisition.PurchaseRequisitionId == 0)
                {
                    ret = Facade.inv_PurchaseRequisitionBLL.Add(inv_PurchaseRequisition);
                }
                else
                {
                    ret = Facade.inv_PurchaseRequisitionBLL.Update(inv_PurchaseRequisition);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseRequisitionController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
        [HttpPost]
        public int Delete(int PurchaseRequisitionId)
        {
            int ret = 0;
            try
            {
                ret = Facade.inv_PurchaseRequisitionBLL.Delete(PurchaseRequisitionId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseRequisitionController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
	}
}