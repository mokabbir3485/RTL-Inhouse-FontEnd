using InventoryEntity;
using System;
using System.Web.Mvc;
using DbExecutor;
using InventoryBLL;
namespace Security.UI.Controllers
{
    public class StockValuationController : Controller
    {
        public JsonResult GetByItemAndUnitAndDepartment(Int32 itemId, Int32 unitId, Int32? departmentId = null)
        {
            try
            {
                var list = Facade.StockValuation.GetByItemAndUnitAndDepartment(itemId, unitId, departmentId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "StockValuationController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetByDepartmentAndItemAddAttId(Int32 departmentId, string itemAddAttId)
        {
            try
            {
                var list = InventoryBLL.Facade.StockValuationAttribute.GetByDepartmentAndItemAddAttId(departmentId, itemAddAttId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "StockValuationAttributeController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpGet]
        public JsonResult GetAll_CurrentStock()
        {

            try
            {
                var list = InventoryBLL.Facade.StockValuation.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "StockValuationAttributeController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpGet]
        public JsonResult CurrentStockGetById(Int32 ItemId)
        {

            try
            {

                var itemVatList = Facade.StockValuation.GetByItemId(ItemId);
                return Json(itemVatList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                //throw;
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemController";
                return Json(null, JsonRequestBehavior.AllowGet);
            }

        }

       
    }
}