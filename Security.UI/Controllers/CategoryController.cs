using DbExecutor;
using SecurityBLL;
using SecurityEntity;
using System;
using System.Web.Mvc;

namespace Security.UI.Controllers
{
    public class CategoryController : Controller
    {
        public JsonResult GetAllCategory()
        {
           
            try
            {
                var list = Facade.ItemCategory.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CategoryController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetCategoryPaged(int StartRecordNo, int RowPerPage, int rows,string SearchCr)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData = Facade.ItemCategory.GetPaged(StartRecordNo, RowPerPage, SearchCr, "CategoryName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CategoryController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetCategoryDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.ItemCategory.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CategoryController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public int Save(ad_ItemCategory category)
        {
            int ret = 0;
            category.CreateDate = DateTime.Now;
            category.UpdateDate = DateTime.Now;
            if (category.ShortName == null)
                category.ShortName = "";
            try
            {
                if (category.CategoryId == 0)
                {
                    ret = Facade.ItemCategory.Add(category);
                }
                else
                {
                    ret = Facade.ItemCategory.Update(category);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CategoryController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int Delete(int CategoryId)
        {
            int ret = 0;
            try
            {
                ret = Facade.ItemCategory.Delete(CategoryId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorSide = "Server";
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CategoryController";
                error.IpAddress = Session["IP"].ToString();
                error.UserId = Convert.ToInt32(Session["UserId"]);
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
	}
}