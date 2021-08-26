using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using DbExecutor;
using ExportBLL;
using ExportEntity;
namespace Security.UI.Controllers
{
    [EnableCors(origins: "http://localhost:4200,http://43.224.119.250:8888,http://43.224.119.250:88,http://192.168.4.9:8090", headers: "*", methods: "*")]
    public class PITestController : ApiController
    {

        [Route("Exp/GetAllApproval")]
        [HttpGet]
        public IHttpActionResult GetAllApproval()
        {
            try
            {
                var hsCode = Facade.exp_Approval.GetAll();
                return Ok(hsCode);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log
                {
                    ErrorMessage = ex.Message,
                    ErrorType = ex.GetType().ToString(),
                    FileName = "ExpApprovalController"
                };
                new ErrorLogController().CreateErrorLog(error);
                return Ok();
            }
            

        }

        [Route("Exp/GetApprovalDynamic")]
        [HttpGet]
        public IHttpActionResult GetApprovalDynamic(string searchCriteria, string orderBy)
        {
           
            try
            {
                var expSearch = Facade.exp_Approval.GetDynamic("", "");
                return Ok(expSearch);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log
                {
                    ErrorMessage = ex.Message,
                    ErrorType = ex.GetType().ToString(),
                    FileName = "ExpApprovalController"
                };
                new ErrorLogController().CreateErrorLog(error);
                return Ok();
            }
        }

        [Route("Exp/GetProformaInvoice")]
        [HttpGet]
        public IHttpActionResult GetProformaInvoice(string approvalType="PiAmendment")
        {
            try
            {
                var proformaInvoice = Facade.exp_Approval.GetProformaInvoice(approvalType);
                return Ok(proformaInvoice);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log
                {
                    ErrorMessage = ex.Message,
                    ErrorType = ex.GetType().ToString(),
                    FileName = "ExpApprovalController"
                };
                new ErrorLogController().CreateErrorLog(error);
                return Ok();
            }
        }

        [Route("Exp/CheckDuplicate")]
        [HttpGet]
        public IHttpActionResult CheckDuplicate(string approvalType= "SOAmendment", string approvalPassword= "retail")
        {
           
            try
            {
                var duplicateList = Facade.exp_Approval.DuplicateCheck(approvalType, approvalPassword);
                return Ok(duplicateList);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log
                {
                    ErrorMessage = ex.Message,
                    ErrorType = ex.GetType().ToString(),
                    FileName = "ExpApprovalController"
                };
                new ErrorLogController().CreateErrorLog(error);
                return Ok();
            }
        }

        [Route("Exp/exp_ExpAmendment_GetForEdit")]
        [HttpGet]
        public IHttpActionResult exp_ExpAmendment_GetForEdit(string approvalType= "SOAmendment", string approvalPassword="retail")
        {
            try
            {
                var expExpAmendmentList = Facade.exp_Approval.exp_ExpAmendment_GetForEdit(approvalType, approvalPassword);
                return Ok(expExpAmendmentList);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log
                {
                    ErrorMessage = ex.Message,
                    ErrorType = ex.GetType().ToString(),
                    FileName = "ExpApprovalController"
                };
                new ErrorLogController().CreateErrorLog(error);
                return Ok();
            }
        }

       
       

        [Route("Exp/GetCommercialInvoice")]
        [HttpGet]
        public IHttpActionResult GetCommercialInvoice(string approvalType= "PiAmendment")
        {
            try
            {
                var commercialInvoice = Facade.exp_Approval.GetCommercialInvoice(approvalType);
                return Ok(commercialInvoice);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log
                {
                    ErrorMessage = ex.Message,
                    ErrorType = ex.GetType().ToString(),
                    FileName = "ExpApprovalController"
                };
                new ErrorLogController().CreateErrorLog(error);
                return Ok();
            }
        }

        [Route("Exp/GetSalesOrder")]
        [HttpGet]
        public IHttpActionResult GetSalesOrder(string approvalType = "PiAmendment")
        {
            try
            {
                var salesOrder = Facade.exp_Approval.GetSalesOrder(approvalType);
                return Ok(salesOrder);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log
                {
                    ErrorMessage = ex.Message,
                    ErrorType = ex.GetType().ToString(),
                    FileName = "ExpApprovalController"
                };
                new ErrorLogController().CreateErrorLog(error);
                return Ok();
            }
        }

        [Route("Exp/exp_PiAmendment_GetForEdit")]
        [HttpGet]
        public IHttpActionResult exp_PiAmendment_GetForEdit(string approvalType = "SOAmendment", string approvalPassword = "retail")
        {
            try
            {
                var expPiAmendmentList = Facade.exp_Approval.exp_PiAmendment_GetForEdit(approvalType, approvalPassword);
                return Ok(expPiAmendmentList);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log
                {
                    ErrorMessage = ex.Message,
                    ErrorType = ex.GetType().ToString(),
                    FileName = "ExpApprovalController"
                };
                new ErrorLogController().CreateErrorLog(error);
                return Ok();
            }
        }
        [Route("Exp/exp_CiAmendment_GetForEdit")]
        [HttpGet]
        public IHttpActionResult exp_CiAmendment_GetForEdit(string approvalType = "SOAmendment", string approvalPassword = "retail")
        {
            try
            {
                var expCiAmendmenList = Facade.exp_Approval.exp_CiAmendment_GetForEdit(approvalType, approvalPassword);
                return Ok(expCiAmendmenList);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log
                {
                    ErrorMessage = ex.Message,
                    ErrorType = ex.GetType().ToString(),
                    FileName = "ExpApprovalController"
                };
                new ErrorLogController().CreateErrorLog(error);
                return Ok();
            }
        }

        [Route("Exp/UpdateApproval")]
        [HttpPost]
        public string UpdateApproval([FromBody] List<exp_Approval> expApproval)
        {
            try
            {
                int i = 0;
                foreach (var item in expApproval)
                {
                    i = Facade.exp_Approval.Update(item);
                }
                return i.ToString();
            }
            catch (Exception ex)
            {
                return "Error: " + ex.Message;
            }
        }

        //[Route("Exp/SaveApproval")]
        //[HttpPost]
        //public string Save([FromBody] exp_Approval expApproval)
        //{

        //    try
        //    {
        //        Int64 ret = 0;
        //        expApproval.UpdateDate = DateTime.Now;
        //        //if (expApproval.ApprovalId == 0)
        //        //{
        //        //    ret = Facade.exp_Approval.Add(expApproval);
        //        //}
        //        //else
        //        //{
        //        //    Facade.exp_Approval.Update(expApproval);
        //        //}
        //        expApproval.UpdateDate = DateTime.Now;
        //        ret = expApproval.ApprovalId == 0 ? Facade.exp_Approval.Add(expApproval) : Facade.exp_Approval.Update(expApproval);
        //        return ret.ToString();

        //    }
        //    catch (Exception ex)
        //    {
        //        return "Error: " + ex.Message;
        //    }

           

        //}

        [Route("Exp/SaveApproval")]
        [HttpPost]
      
        public Int64 Save([FromBody] exp_Approval expApproval)
        {
            Int64 ret = 0;
            try
            {
                expApproval.UpdateDate = DateTime.Now;
                ret = expApproval.ApprovalId == 0 ? Facade.exp_Approval.Add(expApproval) : Facade.exp_Approval.Update(expApproval);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log
                {
                    ErrorMessage = ex.Message,
                    ErrorType = ex.GetType().ToString(),
                    FileName = "ExpApprovalController"
                };
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

    }
}
