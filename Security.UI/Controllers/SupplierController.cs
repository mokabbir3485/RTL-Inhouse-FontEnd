using SecurityBLL;
using SecurityEntity;
using System;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class SupplierController : Controller
    {
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
        [HttpGet]
        public JsonResult GetAllSupplerAddress()
        {
            try
            {
                var list = Facade.SupplierAddress.GetAll();
                return Json(list, "application/json", Encoding.UTF8, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SupplierController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetAllSuppler()
        {
            try
            {
                var list = Facade.Supplier.GetAll();
                return Json(list, "application/json", Encoding.UTF8, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SupplierController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }


        public JsonResult GetAllSupplerType()
        {
            try
            {
                var list = Facade.SupplierType.GetAll();
                return Json(list, "application/json", Encoding.UTF8, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SupplierController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetSupplierPaged(int StartRecordNo, int RowPerPage, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData = Facade.Supplier.GetPaged(StartRecordNo, RowPerPage, "", "SupplierName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SupplierController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
      

        [HttpPost]
        public int SaveSupplier(ad_Supplier supplier)
        {
            int ret = 0;
            supplier.CreateDate = DateTime.Now;
            supplier.UpdateDate = DateTime.Now;
            if (supplier.Web == null)
                supplier.Web = "";
            try
            {
              ret = Facade.Supplier.Add(supplier);
               
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SupplierController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        public JsonResult GetSupplierById(int supplierId)
        {
            try
            {
                var list = Facade.Supplier.GetById(supplierId).FirstOrDefault();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SupplierController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public int UpdateSupplier(ad_Supplier supplier)
        {
            int ret = 0;
            supplier.UpdatorId = 1;
            supplier.UpdateDate = DateTime.Now;
            if (supplier.Web == null)
                supplier.Web = "";
            try
            {
                ret = Facade.Supplier.Update(supplier);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SupplierController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int DeleteSupplier(int supplierId)
        {
            int ret = 0;
            try
            {

                ret = Facade.Supplier.Delete(supplierId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SupplierController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }


        public JsonResult GetAllSupplerAddress(int supplierId)
        {
            try
            {
                var list = Facade.SupplierAddress.GetBySupplierId(supplierId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SupplierController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public int SaveSupplerAddress(ad_SupplierAddress supplierAddress)
        {
            int ret = 0;
            supplierAddress.Fax = "";
            supplierAddress.CreatorId = 1;
            supplierAddress.CreateDate = DateTime.Now;
            supplierAddress.UpdatorId = 1;
            supplierAddress.UpdateDate = DateTime.Now;
            if (supplierAddress.ContactPerson == null)
                supplierAddress.ContactPerson = "";
            if (supplierAddress.ContactDesignation == null)
                supplierAddress.ContactDesignation = "";
            if (supplierAddress.Phone == null)
                supplierAddress.Phone = "";
            if (supplierAddress.Mobile == null)
                supplierAddress.Mobile = "";
            if (supplierAddress.Email == null)
                supplierAddress.Email = "";
            try
            {
                if (supplierAddress.AddressId == 0)
                {

                    ret = Facade.SupplierAddress.Add(supplierAddress);
                }
               
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SupplierController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        public JsonResult GetAllSupplerBillPolicy(int supplierId)
        {
            try
            {
                var list = Facade.SupplierBillPolicy.GetBySupplierId(supplierId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SupplierController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public int SaveSupplerBillPolicy(ad_SupplierBillPolicy supplierBillPolicy)
        {
            int ret = 0;
            try
            {
                if (supplierBillPolicy.PolicyId == 0)
                {

                    ret = Facade.SupplierBillPolicy.Add(supplierBillPolicy);
                }
               
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SupplierController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        public JsonResult GetDynamic(string searchCriteria)
       {
            try
            {
                var list = Facade.Supplier.GetDynamic(searchCriteria, "SupplierName");
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SupplierController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
    }
}