using Security.UI.Controllers;
using SecurityBLL;
using SecurityEntity;
using System;
using System.Web.Mvc;
using DbExecutor;

namespace Security.UI
{
    public class ChargeTypeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetAllChargeType()
        {

            try
            {
                var list = Facade.ChargeType.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ChargeTypeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetChargeTypePaged(int StartRecordNo, int RowPerPage, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData = Facade.ChargeType.GetPaged(StartRecordNo, RowPerPage, "", "ChargeTypeName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ChargeTypeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetChargeTypeDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.ChargeType.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ChargeTypeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAllChargeTypeWithProductPrice()
        {

            try
            {
                var list = Facade.ChargeType.GetAllWithProductPrice();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ChargeTypeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public int Save(ad_ChargeType ChargeType)
        {
            int ret = 0;
            try
            {

                
                ChargeType.CreateDate = DateTime.Now;
                ChargeType.UpdateDate = DateTime.Now;

                if (ChargeType.ChargeTypeId == 0)
                {

                    ret = Facade.ChargeType.Add(ChargeType);
                }
                else
                {
                    ret = Facade.ChargeType.Update(ChargeType);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ChargeTypeController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int Delete(int ChargeTypeId)
        {
            int ret = 0;
            try
            {

                ret = Facade.ChargeType.Delete(ChargeTypeId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ChargeTypeController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
    }
}