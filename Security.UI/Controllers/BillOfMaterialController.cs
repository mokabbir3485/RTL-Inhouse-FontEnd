using DbExecutor;
using InventoryBLL;
using InventoryEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Security.UI.Controllers
{
    public class BillOfMaterialController : Controller
    {
        // GET: BillOfMaterial
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetMaxBillOfMaterialNo()
        {
            try
            {

                var dt = new DataTable();
                dt.Load(Facade.inv_BillOfMaterialBLL.GetMaxBillOfMaterialNo());

                List<string[]> results =
                    dt.Select()
                        .Select(drr =>
                            drr.ItemArray
                                .Select(x => x.ToString())
                                .ToArray())
                        .ToList();

                return Json(results, JsonRequestBehavior.AllowGet);

            }


            catch (Exception ex)
            {

                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BillOfMaterialController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetBillOfMaterialByBillOfMaterialId()
        {
            try
            {
                var list = Facade.inv_BillOfMaterialBLL.Get();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BillOfMaterialController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetBillOfMaterialDetailByBillOfMaterialId(Int64 BOMId)
        {
            try
            {
                var list = Facade.inv_BillOfMaterialBLL.GetDetail(BOMId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BillOfMaterialController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetBillOfMaterialOverheadByBillOfMaterialId(Int64 BOMId, string SectorType)
        {
            try
            {
                var list = Facade.inv_BillOfMaterialBLL.OverheadGetAll(BOMId, SectorType);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BillOfMaterialController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetBillOfMaterialPaged(int startRecordNo, int rowPerPage, string whereClause, int rows)
        {
            // whereClause = "[SO].[SalesOrderDate] between '2020-10-16' and '2020-10-20'";
            //  whereClause = "[SO].[SalesOrderDate]'2020-10-17' between '20/11/2020'";
            //startRecordNo = 1;
            //rowPerPage = 5;
            //whereClause = "[DeliveryDate] between '2021-06-05' and '2021-06-08'";
            //whereClause = "ItemName like '%75%'";
            //whereClause = "[DeliveryDate] between '2021-06-05' and '2021-06-08' and ItemName like '%75%'";
            try
            {

                var customMODEntity = new
                {

                    ListData = Facade.inv_BillOfMaterialBLL.GetPaged(startRecordNo, rowPerPage, whereClause, "BillOfMaterialId", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BillOfMaterialController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]

        public Int64 Save(inv_BillOfMaterial BillOfMaterial, inv_BillOfMaterialDetail[] BillOfMaterialDetaillist, inv_BillOfMaterialOverhead[] OverheadDetailList)
        {
            if (BillOfMaterial.ItemName == null) { BillOfMaterial.ItemName = ""; }
            if (BillOfMaterial.Unit == null) { BillOfMaterial.Unit = ""; }


            
            Int64 ret = 0;
            Int64 BillOfMaterialId = 0;
            BillOfMaterialId = BillOfMaterial.BillOfMaterialId;
            try
            {
                if (BillOfMaterial.BillOfMaterialId == 0)
                {
                    BillOfMaterial.CreatorId = BillOfMaterial.UpdatorId;
                    BillOfMaterial.UpdateDate = DateTime.Now;
                    BillOfMaterial.CreateDate = DateTime.Now;
                    ret = Facade.inv_BillOfMaterialBLL.Post(BillOfMaterial);

                    if (BillOfMaterialDetaillist != null)
                    {
                        foreach (var BOMDetail in BillOfMaterialDetaillist)
                        {
                            BOMDetail.BOMId = Convert.ToInt64(ret);
                            Facade.inv_BillOfMaterialBLL.PostDetail(BOMDetail);

                        }
                    }

                    if (OverheadDetailList != null)
                    {
                        foreach (var OverheadDetail in OverheadDetailList)
                        {
                            OverheadDetail.BOMId = Convert.ToInt64(ret);
                            Facade.inv_BillOfMaterialBLL.PostOverhead(OverheadDetail);

                        }
                    }

                }
                else
                {
                    BillOfMaterial.UpdateDate = DateTime.Now;
                    ret = Facade.inv_BillOfMaterialBLL.Post(BillOfMaterial);
                    if (BillOfMaterialDetaillist != null)
                    {
                        Facade.inv_BillOfMaterialBLL.DeleteDetailByBOMId(ret);
                        foreach (var BOMDetail in BillOfMaterialDetaillist)
                        {
                            BOMDetail.BOMDetailId = 0;
                            BOMDetail.BOMId = Convert.ToInt64(ret);
                            Facade.inv_BillOfMaterialBLL.PostDetail(BOMDetail);
                        }
                    }
                    if (OverheadDetailList != null)
                    {
                        Facade.inv_BillOfMaterialBLL.DeleteOerheadByBOMId(ret);
                        foreach (var OverheadDetail in OverheadDetailList)
                        {
                            OverheadDetail.BOMOverheadId = 0;
                            OverheadDetail.BOMId = Convert.ToInt64(ret);
                            Facade.inv_BillOfMaterialBLL.PostOverhead(OverheadDetail);

                        }
                    }

                }

                
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BillOfMaterialController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
    }
}