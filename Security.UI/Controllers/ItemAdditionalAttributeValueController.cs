using System;
using System.Web.Mvc;
using SecurityBLL;
using SecurityEntity;
using DbExecutor;
using System.Data;
using Newtonsoft.Json;

namespace Security.UI.Controllers
{
    public class ItemAdditionalAttributeValueController : Controller
    {
        //
        // GET: /ItemAdditionalAttributeValue/
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetFromSavedType()
        {

            try
            {
                var list = SecurityBLL.Facade.AdditionalAttribute.GetFromSavedType();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemAdditionalAttributeValueController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAdditionalAttributeValuePaged(int StartRecordNo, int RowPerPage, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData = Facade.AdditionalAttributeValue.GetPaged(StartRecordNo, RowPerPage, "", "AttributeName,Value", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemAdditionalAttributeValueController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAdditionalAttributeValueDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.AdditionalAttributeValue.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "AdditionalAttributeValueController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetByAttributeId(int attributeId)
        {
            try
            {
                var list = Facade.AdditionalAttributeValue.GetByAttributeId(attributeId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "AdditionalAttributeValueController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public string GetByItemId(int itemId)
        {
            try
            {
                DataTable dt = Facade.ItemAdditionalAttributeValue.GetByItemId(itemId);
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {

                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemAdditionalAttributeValueController";
                new ErrorLogController().CreateErrorLog(error);
                return null;
            }
        }

        [HttpPost]
        public int Save(ad_AdditionalAttributeValue AdditionalAttributeValue)
        {
            AdditionalAttributeValue.CreateDate = DateTime.Now;
            AdditionalAttributeValue.UpdateDate = DateTime.Now;
            int ret = 0;
            try
            {
                if (AdditionalAttributeValue.AttributeValueId == 0)
                {

                    ret = Facade.AdditionalAttributeValue.Add(AdditionalAttributeValue);
                }
                else
                {
                    ret = Facade.AdditionalAttributeValue.Update(AdditionalAttributeValue);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemAdditionalAttributeValueController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int Delete(int AttributeValueId)
        {
            int ret = 0;
            try
            {
                ret = Facade.AdditionalAttributeValue.Delete(AttributeValueId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemAdditionalAttributeValueController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
    }
}