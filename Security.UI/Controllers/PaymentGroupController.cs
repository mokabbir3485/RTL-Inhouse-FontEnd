using SecurityBLL;
using SecurityEntity;
using System;
using System.Web.Mvc;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class PaymentGroupController : Controller
    {
        //
        // GET: /PaymentGroup/
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
        public JsonResult GetAllActivePaymentGroup()
        {
            try
            {
                var list = Facade.ad_PaymentGroup.GetAllActive();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PaymentGroupController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        
        public JsonResult GetAllPaymentGroupPaged(int StartRecordNo, int RowPerPage, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData = Facade.ad_PaymentGroup.GetPaged(StartRecordNo, RowPerPage, "", "PaymentGroupName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PaymentGroupController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetPaymentGroupDynamic(string searchCriteria, string orderBy)
        {

            try
            {
                //string orderBy = "CategoryName, SubCategoryName, ItemName";
                var list = Facade.ad_PaymentGroup.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PaymentGroupController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public int Save(ad_PaymentGroup paymentGroup)
        {

            int ret = 0;
            paymentGroup.CreateDate = DateTime.Now;
            paymentGroup.UpdateDate = DateTime.Now;
            try
            {
                if (paymentGroup.PaymentGroupId == 0)
                {

                    ret = Facade.ad_PaymentGroup.Add(paymentGroup);
                }
                else
                {
                    ret = Facade.ad_PaymentGroup.Update(paymentGroup);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PaymentGroupController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int Delete(int paymentGroupId)
        {
            int ret = 0;
            try
            {
                ret = Facade.ad_PaymentGroup.Delete(paymentGroupId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PaymentGroupController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
	}
}