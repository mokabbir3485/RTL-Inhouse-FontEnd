using System;
using System.Web.Mvc;
using SecurityBLL;
using SecurityEntity;
using System.Text;
using DbExecutor;
using System.Net;

namespace Security.UI.Controllers
{
    public class BranchTypeController : Controller
    {
        //private ad_BranchType vs = new ad_BranchType();
        //
        // GET: /BranchTypeEntry/

       
        public ActionResult Index()
        {
            return View();
        }

        protected override JsonResult Json(object data, string contentType, System.Text.Encoding contentEncoding, JsonRequestBehavior behavior)
        {
            return new JsonResult()
            {
                Data = data,
                ContentType = contentType,
                ContentEncoding = contentEncoding,
                JsonRequestBehavior = behavior,
                MaxJsonLength = Int32.MaxValue
            };
        }

        public JsonResult GetAllBranchType()
        {
            try
            {
                var list = Facade.BranchType.GetAll();
                return Json(list, "application/json", Encoding.UTF8, JsonRequestBehavior.AllowGet);

               
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BranchTypeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
            
        }
        public JsonResult GetAllBranchTypePaged(int StartRecordNo, int RowPerPage, int rows)
        {
            try
            {
                
                var customMODEntity = new
                {
                    ListData = Facade.BranchType.GetPaged(StartRecordNo, RowPerPage, "", "BranchTypeName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);

                

            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BranchTypeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetBranchTypeDynamic(string searchCriteria, string orderBy)
        {

            try
            {
                //string orderBy = "CategoryName, SubCategoryName, ItemName";
                var list = Facade.BranchType.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BranchTypeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public int Save(ad_BranchType branchType)
        {
            
            int ret = 0;
            try
            {
                if (branchType.BranchTypeId == 0)
                {

                    ret = Facade.BranchType.Add(branchType);
                }
                else
                {
                    ret = Facade.BranchType.Update(branchType);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BranchTypeController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int Delete(int BranchTypeId)
        {
            int ret = 0;
            try
            {

                ret = Facade.BranchType.Delete(BranchTypeId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BranchTypeController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
    }
}