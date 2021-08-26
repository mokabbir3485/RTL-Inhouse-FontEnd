using DbExecutor;
using Newtonsoft.Json;
using SecurityBLL;
using SecurityEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web.Mvc;

namespace Security.UI.Controllers
{
    public class ItemHsCodeController : Controller
    {

        public JsonResult Get()
        {
            try
            {
                var list = Facade.ItemHsCode.Get();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        
    }
}