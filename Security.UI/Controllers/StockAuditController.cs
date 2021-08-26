using InventoryEntity;
using System;
using System.Web.Mvc;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class StockAuditController : Controller
    {
        public JsonResult GetAllStockAuditGroup()
        {
            try
            {
                var list = SecurityBLL.Facade.StockAuditGroup.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "StockAuditController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetAllStockAuditType()
        {
            try
            {
                var list = SecurityBLL.Facade.StockAuditType.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "StockAuditController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public int SaveStockAudit(inv_StockAudit inv_StockAudit)
        {
            int ret = 0;
            inv_StockAudit.CreateDate = DateTime.Now;
            inv_StockAudit.UpdateDate = DateTime.Now;
            inv_StockAudit.CreatorId = 1;
            inv_StockAudit.UpdatorId = 1;
            inv_StockAudit.IsSettled = true;
            inv_StockAudit.SettledWithId = 1;
            inv_StockAudit.SettledWith = "";
            if (inv_StockAudit.Remarks == null)
                inv_StockAudit.Remarks = "";
            try
            {
                //ret = 1;
                ret = InventoryBLL.Facade.StockAudit.Add(inv_StockAudit);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "StockAuditController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }
        [HttpPost]
        public int SaveStockAuditDetail(inv_StockAuditDetail inv_StockAuditDetail, int AuditId)
        {
            int ret = 0;
            try
            {
                //if (inv_PurchaseBillDetail == null)
                //    stockReceiveDetail.FreeUnitName = "";
                inv_StockAuditDetail.AuditId = AuditId;
                //ret = 14;
                ret = InventoryBLL.Facade.StockAuditDetail.Add(inv_StockAuditDetail);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "StockAuditController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }
	}
}