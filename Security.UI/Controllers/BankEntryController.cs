using System;
using System.Web.Mvc;
using SecurityBLL;
using SecurityEntity;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class BankEntryController : Controller
    {
        //
        // GET: /BankEntry/
        public ActionResult Index()
        {
           
            return View();
        }

        public JsonResult GetBankPaged(int StartRecordNo, int RowPerPage, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData =Facade.ad_Bank.GetPaged(StartRecordNo, RowPerPage, "", "BankName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BankEntryController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetBankDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.ad_Bank.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BankEntryController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public int Save(ad_Bank _ad_Bank)
        {
            if (_ad_Bank.Description == null)
                _ad_Bank.Description = "";
            _ad_Bank.CreateDate = DateTime.Now;
            _ad_Bank.UpdateDate = DateTime.Now;
            int ret = 0;
            try
            {
                if (_ad_Bank.BankId == 0)
                {
                    ret = Facade.ad_Bank.Add(_ad_Bank);
                }
                else
                {
                    ret = Facade.ad_Bank.Update(_ad_Bank);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BankEntryController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
        [HttpPost]
        public int Delete(int bankId)
        {
            int ret = 0;
            try
            {
                ret = Facade.ad_Bank.Delete(bankId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BankEntryController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
	}
}