using SecurityBLL;
using SecurityEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class TerminalController : Controller
    {
        public JsonResult GetclintPcName()
        {                       
            return Json(System.Environment.MachineName, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetPcInfo()
        {
            try
            {
                List<ad_Terminal> list = Facade.Terminal.GetAll();
                ad_Terminal aad_Terminal = list.Where(t => t.IpAddress == (System.Web.HttpContext.Current.Session["IP"]).ToString()).FirstOrDefault();
                return Json(aad_Terminal, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json("", JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetCurrentPcIp()
        {
            return Json(System.Web.HttpContext.Current.Session["IP"].ToString(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAllTerminal()
        {
            try
            {
                var list = Facade.Terminal.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "TerminalController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetTerminalPaged(int StartRecordNo, int RowPerPage, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData = Facade.Terminal.GetPaged(StartRecordNo, RowPerPage, "", "TerminalName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "TerminalController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetTerminalDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.Terminal.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "TerminalController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public int Save(ad_Terminal terminal)
        {
            terminal.CreatorId = 1;
            terminal.CreateDate = DateTime.Now;
            terminal.UpdatorId = 1;
            terminal.UpdateDate = DateTime.Now;
            int ret = 0;
            try
            {
                if (terminal.TerminalId == 0)
                {

                    ret = Facade.Terminal.Add(terminal);
                }
                else
                {
                    ret = Facade.Terminal.Update(terminal);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "TerminalController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int Delete(int TerminalId)
        {
            int ret = 0;
            try
            {
                ret = Facade.Terminal.Delete(TerminalId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "TerminalController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
    }
}