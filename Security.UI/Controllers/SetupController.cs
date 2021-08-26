using InventoryBLL;
using InventoryEntity;
using Security.UI.Controllers;
using System;
using System.Web.Mvc;
using DbExecutor;

namespace Security.UI
{
    public class SetupController : Controller
    {
        public JsonResult GetAllSetup()
        {
            try
            {
                var myVar = System.Configuration.ConfigurationManager.AppSettings["IsFinancialCycleAuto"].ToString(); 
                return Json(myVar, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SetupController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetNextValuationType()
        {

            try
            {
                var list = Facade.StockValuationSetup.GetNext();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SetupController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetCurrentValuationSetup()
        {

            try
            {
                var list = Facade.StockValuationSetup.GetCurrent();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SetupController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpPost]
        public int Save(inv_StockValuationSetup setup)
        {
            int ret = 0;
            try
            {

                setup.CreatorId = 1;
                setup.CreateDate = DateTime.Now;
                setup.UpdatorId = 1;
                setup.UpdateDate = DateTime.Now;
                ret = Facade.StockValuationSetup.Add(setup);
                    //retr = Facade.Role.Add(role);
              
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SetupController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int Update(inv_StockValuationSetup setup)
        {
            int ret = 0;
            try
            {
                setup.UpdatorId = 1;
                setup.UpdateDate = DateTime.Now;
                ret = Facade.StockValuationSetup.Update(setup);
               
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SetupController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int Delete(int setupId)
        {
            int ret = 0;
            try
            {

                ret = Facade.StockValuationSetup.Delete(setupId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SetupController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }

        public JsonResult GetHasReceivable()
        {
            try
            {
                var HasReceivable = System.Configuration.ConfigurationManager.AppSettings["HasReceivable"].ToString();
                return Json(HasReceivable, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SetupController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        //SignalR Test

        public JsonResult GetCurrentQty()
        {

            try
            {
                var list = Facade.StockValuation.GetByItemAndDepartment(1, 6);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SetupController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public int AddQty(inv_StockValuation stkVal)
        {
            int ret = 0;
            try
            {
                ret = Facade.StockValuation.UpdateAdd(stkVal);

            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SetupController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                
            }
            return ret;
        }
        [HttpPost]
        public int DeductQty(inv_StockValuation stkVal)
        {
            int ret = 0;
            try
            {
                ret = Facade.StockValuation.UpdateDeduct(stkVal);

            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SetupController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }

        public JsonResult GetAllAttendancePolicy()
        {
            try
            {
                var list = HrAndPayrollBLL.Facade.hr_AttendancePolicy.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SetupController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
    }
}