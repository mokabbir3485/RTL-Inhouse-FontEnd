using System;
using System.Web.Mvc;
using SecurityBLL;
using SecurityEntity;
using DbExecutor;
using System.Data;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace Security.UI.Controllers
{
    public class ItemAdditionalAttributeController : Controller
    {
        public string ItemPriceByAttributeGetByItemId(int itemId)
        {
            try
            {
                DataTable dt = Facade.ad_ItemPriceByAttribute.GetByItemId(itemId);
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemAdditionalAttributeController";
                new ErrorLogPosController().CreateErrorLog(error);
                return null;
            }
        }
        [HttpPost]
        public int UpdateItemPriceByAttribute(List<ad_ItemPriceByAttribute> _ad_ItemPriceByAttribute, int UpdatorId)
        {
            int ret = 0;
            try
            {
                foreach (ad_ItemPriceByAttribute ad_ItemPriceByAttribute in _ad_ItemPriceByAttribute)
                {
                    ad_ItemPriceByAttribute.UpdateDate = DateTime.Now;
                    ad_ItemPriceByAttribute.UpdatorId = UpdatorId;
                    ret += Facade.ad_ItemPriceByAttribute.UpdatePrice(ad_ItemPriceByAttribute);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemAdditionalAttributeController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
        public JsonResult GetAllAdditionalAtt()
        {
            try
            {
                var list = Facade.AdditionalAttribute.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemAdditionalAttributeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAdditionalAttributePaged(int StartRecordNo, int RowPerPage, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData = Facade.AdditionalAttribute.GetPaged(StartRecordNo, RowPerPage, "", "AttributeName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemAdditionalAttributeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAdditionalAttributeDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.AdditionalAttribute.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "AdditionalAttributeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAdditionalAttributeById(int attributeId)
        {
            try
            {
                var list = Facade.AdditionalAttribute.GetAll(attributeId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "AdditionalAttributeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetItemAdditionalAttributeDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.ItemAdditionalAttribute.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemAdditionalAttributeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public int Save(ad_AdditionalAttribute AdditionalAttribute)
        {
            AdditionalAttribute.CreateDate = DateTime.Now;
            AdditionalAttribute.UpdateDate = DateTime.Now;
            int ret = 0;
            try
            {
                if (AdditionalAttribute.AttributeId == 0)
                {

                    ret = Facade.AdditionalAttribute.Add(AdditionalAttribute);
                }
                else
                {
                    ret = Facade.AdditionalAttribute.Update(AdditionalAttribute);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemAdditionalAttributeController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int Delete(int AttributeId)
        {
            int ret = 0;
            try
            {
                ret = Facade.AdditionalAttribute.Delete(AttributeId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemAdditionalAttributeController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
    }
}