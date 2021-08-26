using SecurityBLL;
using SecurityEntity;
using System;
using System.Web.Mvc;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class DeclarationTypeController : Controller
    {
        //
        // GET: /AdjustmentName/
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetAllDeclarationType()
        {

            try
            {
                var list = Facade.StockDeclarationType.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DeclarationTypeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetDeclarationTypePaged(int StartRecordNo, int RowPerPage, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData = Facade.StockDeclarationType.GetPaged(StartRecordNo, RowPerPage, "", "DeclarationTypeName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DeclarationTypeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetDeclarationTypeDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.StockDeclarationType.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DeclarationTypeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public int Save(ad_StockDeclarationType stockDeclarationType)
        {
            int ret = 0;
            stockDeclarationType.CreateDate = DateTime.Now;
            stockDeclarationType.UpdateDate = DateTime.Now;
            try
            {
                if (stockDeclarationType.DeclarationTypeId == 0)
                {

                    ret = Facade.StockDeclarationType.Add(stockDeclarationType);
                }
                else
                {

                    ret = Facade.StockDeclarationType.Update(stockDeclarationType);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DeclarationTypeController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int Delete(int declarationTypeId)
        {
            int ret = 0;
            try
            {
                ret = Facade.StockDeclarationType.Delete(declarationTypeId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DeclarationTypeController";
                new ErrorLogController().CreateErrorLog(error);
            }

            return ret;
        }
	}
}