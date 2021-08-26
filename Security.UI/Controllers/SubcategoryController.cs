using SecurityBLL;
using SecurityEntity;
using System;
using System.Web.Mvc;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class SubcategoryController : Controller
    {
        public JsonResult GetAllSubategory()
        {            
            try
            {
                var list = Facade.ItemSubCategory.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SubcategoryController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetSubcategoryPaged(int StartRecordNo, int RowPerPage,string SearchCr, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData = Facade.ItemSubCategory.GetPaged(StartRecordNo, RowPerPage, SearchCr, "SubCategoryName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SubcategoryController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetSubcategoryDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.ItemSubCategory.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SubcategoryController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public int Save(ad_ItemSubCategory subCategory)
        {
            int ret = 0;
            subCategory.CreateDate = DateTime.Now;
            subCategory.UpdateDate = DateTime.Now;
            subCategory.SubCategoryTypeId =4;
            subCategory.SubShortName = string.IsNullOrEmpty(subCategory.SubShortName) ? "" : subCategory.SubShortName;

            try
            {
                if (subCategory.SubCategoryId == 0)
                {
                    ret = Facade.ItemSubCategory.Add(subCategory);
                }
                else
                {
                    ret = Facade.ItemSubCategory.Update(subCategory);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SubcategoryController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int Delete(int SubCategoryId)
        {
            int ret = 0;
            try
            {
                ret = Facade.ItemSubCategory.Delete(SubCategoryId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SubcategoryController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        public JsonResult GetAllAssetNature()
        {
            try
            {
                var list = Facade.AssetNature.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SubcategoryController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAllSubCategoryType()
        {
            try
            {
                var list = Facade.ItemSubCategoryType.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SubcategoryController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
	}
}