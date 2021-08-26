using System;
using System.Collections.Generic;
using System.Web.Mvc;
using InventoryEntity;
using SecurityBLL;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class OpeningQtyController : Controller
    {
        //
        // GET: /ReorderLevelSetup/
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetAllStore()
        {
            try
            {
                var storeList = Facade.Department.GetAllStore();
                return Json(storeList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "OpeningQtyController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult SearchOpeningQuantity(int depId, int? categoryId, int? subcategoryId, int? itemId)
        {
            try
            {               
                var searchResultList = InventoryBLL.Facade.OpeningQuantity.Search(depId,categoryId,subcategoryId,itemId);
                return Json(searchResultList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "OpeningQtyController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public int UpdateOpeningQty(List<inv_OpeningQuantity> UpdateOpeningQtylist)
        {
            int ret = 0;
            try
            {
                foreach (inv_OpeningQuantity aStoreWiseItemOpeningQuantity in UpdateOpeningQtylist)
                {
                    ret = InventoryBLL.Facade.OpeningQuantity.Update(aStoreWiseItemOpeningQuantity);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "OpeningQtyController";
                new ErrorLogInventoryController().CreateErrorLog(error);

            }
            return ret;
        }
        //Save
        [HttpPost]
        public int SaveOpeningQty(List<inv_OpeningQuantity> SaveOpeningQtylist)
        {
            int ret = 0;
            var wer = DateTime.Now;
            foreach (inv_OpeningQuantity opeq in SaveOpeningQtylist)
            {
                if (opeq.OpeningContainerName == null)
                    opeq.OpeningContainerName = "";
                if (opeq.OpeningPackageName == null)
                    opeq.OpeningPackageName = "";
            }
            try
            {
                foreach (inv_OpeningQuantity aStoreWiseItemOpeningQuantity in SaveOpeningQtylist)
                {
                    ret = InventoryBLL.Facade.OpeningQuantity.Add(aStoreWiseItemOpeningQuantity);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "OpeningQtyController.0";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }

    }
}