using SecurityBLL;
using SecurityEntity;
using System;
using System.Web.Mvc;
using DbExecutor;
using System.Collections.Generic;

namespace Security.UI.Controllers
{
    public class PaymentTypeController : Controller
    {
        //
        // GET: /PaymentType/
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
        public JsonResult GetAllActivePaymentType()
        {
            try
            {
                var list = Facade.ad_PaymentType.GetAllActive();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PaymentTypeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAllActivePaymentTypeModuleWise(string moduleName)
        {
            try
            {
                List<ad_PaymentType> lstPayType = Facade.ad_PaymentType.GetAllActive();
                List<ad_PaymentType> lstPayTypeM = new List<ad_PaymentType>();
                foreach (ad_PaymentType item in lstPayType)
                {
                    if (item.ModuleName == "Common" || item.ModuleName == moduleName)
                        lstPayTypeM.Add(item);
                }

                var list = lstPayTypeM;
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PaymentTypeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        
        public JsonResult GetAllPaymentTypePaged(int StartRecordNo, int RowPerPage, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData = Facade.ad_PaymentType.GetPaged(StartRecordNo, RowPerPage, "", "PaymentTypeName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PaymentTypeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetPaymentTypeDynamic(string searchCriteria, string orderBy)
        {

            try
            {
                //string orderBy = "CategoryName, SubCategoryName, ItemName";
                var list = Facade.ad_PaymentType.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PaymentTypeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public int Save(ad_PaymentType paymentType)
        {

            int ret = 0;
            paymentType.CreateDate = DateTime.Now;
            paymentType.UpdateDate = DateTime.Now;
            try
            {
                if (paymentType.PaymentTypeId == 0)
                {

                    ret = Facade.ad_PaymentType.Add(paymentType);
                }
                else
                {
                    ret = Facade.ad_PaymentType.Update(paymentType);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PaymentTypeController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int Delete(int paymentTypeId)
        {
            int ret = 0;
            try
            {
                ret = Facade.ad_PaymentType.Delete(paymentTypeId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PaymentTypeController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
	}
}