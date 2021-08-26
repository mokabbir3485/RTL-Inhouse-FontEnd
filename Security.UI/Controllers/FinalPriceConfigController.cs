using SecurityBLL;
using SecurityEntity;
using System;
using System.Web.Mvc;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class FinalPriceConfigController : Controller
    {
        //
        // GET: /FinalPriceConfig/
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetAllConfig()
        {

            try
            {
                var list = Facade.FinalPriceConfig.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "FinalPriceConfigController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetFinalPriceConfigPaged(int StartRecordNo, int RowPerPage, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData = Facade.FinalPriceConfig.GetPaged(StartRecordNo, RowPerPage, "", "ConfigName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "FinalPriceConfigController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetFinalPriceConfigDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.FinalPriceConfig.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "FinalPriceConfigController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public int SaveFinalPriceConfig(ad_FinalPriceConfig finalPriceConfig)
        {
            int ret = 0;
            finalPriceConfig.IsActive = false;
            finalPriceConfig.ConfigCode = "001";
            
            try
            {
                if (finalPriceConfig.ConfigId == 0)
                {
                    finalPriceConfig.CreatorId = 1;
                    finalPriceConfig.CreateDate = DateTime.Now;
                    finalPriceConfig.UpdatorId = 1;
                    finalPriceConfig.UpdateDate = DateTime.Now;
                    ret = Facade.FinalPriceConfig.Add(finalPriceConfig);
                }
                else
                {
                    finalPriceConfig.UpdatorId = 1;
                    finalPriceConfig.UpdateDate = DateTime.Now;
                    ret = Facade.FinalPriceConfig.Update(finalPriceConfig);
                }
            }
            catch (Exception ex)
            {

                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "FinalPriceConfigController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int SaveFinalPriceConfigDetail(ad_FinalPriceConfigDetail finalPriceConfigDetail)
        {
            int ret = 0;
            try
            {
                ret = Facade.FinalPriceConfigDetail.Add(finalPriceConfigDetail);
            }
            catch (Exception ex)
            {

                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "FinalPriceConfigController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int SaveFinalPriceConfigDetailApplyOn(ad_FinalPriceConfigDetailApplyOn finalPriceConfigDetailApplyOn)
        {
            int ret = 0;
            try
            {
                ret = Facade.FinalPriceConfigDetailApplyOn.Add(finalPriceConfigDetailApplyOn);
            }
            catch (Exception ex)
            {

                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "FinalPriceConfigController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int Delete(int ConfigId)
        {
            int ret = 0;
            try
            {
                ret = Facade.FinalPriceConfig.Delete(ConfigId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "FinalPriceConfigController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        public JsonResult GetConfigDetailByCofigId(int configId)
        {

            try
            {
                var list = Facade.FinalPriceConfigDetail.GetByConfigId(configId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "FinalPriceConfigController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetConfigDetailApplyOnByCofigDetailId(int configDetailId)
        {

            try
            {
                var list = Facade.FinalPriceConfigDetailApplyOn.GetByConfigDetailId(configDetailId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "FinalPriceConfigController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
	}
}