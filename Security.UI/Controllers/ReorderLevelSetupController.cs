using System;
using System.Collections.Generic;
using System.Web.Mvc;
using InventoryEntity;
using SecurityBLL;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class ReorderLevelSetupController : Controller
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
                error.FileName = "ReorderLevelSetupController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult SearchReorderlevel(int depId, int? categoryId, int? subcategoryId, int? itemId)
        {
            try
            {
                var searchResultList = InventoryBLL.Facade.StoreWiseItemReorderLevel.Search(depId, categoryId, subcategoryId, itemId);
                return Json(searchResultList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReorderLevelSetupController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult SearchReorderlevelForDashboard(int depId)
        {
            try
            {
                var searchResultList = InventoryBLL.Facade.StoreWiseItemReorderLevel.SearchForDashboard(depId);
                return Json(searchResultList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReorderLevelSetupController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

      /*
        //Update
        [HttpPost]
        public int UpdateReorderLevel(List<inv_StoreWiseItemReorderLevel> UpdateReorderLevellist)
        {
            int ret = 0;
            try
            {
                foreach (inv_StoreWiseItemReorderLevel aStoreWiseItemReorderLevel in UpdateReorderLevellist)
                {
                    ret = InventoryBLL.Facade.StoreWiseItemReorderLevel.Update(aStoreWiseItemReorderLevel);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReorderLevelSetupController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                
            }
            return ret;
        }
       * */



        //Save
        [HttpPost]
        public int SaveReorderLevel(List<inv_StoreWiseItemReorderLevel> SaveReorderLevellist)
        {
            int ret = 0;
            try
            {
                if (SaveReorderLevellist != null && SaveReorderLevellist.Count > 0)
                {
                    foreach (inv_StoreWiseItemReorderLevel aStoreWiseItemReorderLevel in SaveReorderLevellist)
                    {
                        ret = InventoryBLL.Facade.StoreWiseItemReorderLevel.Add(aStoreWiseItemReorderLevel);
                    }
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReorderLevelSetupController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }

	}
}