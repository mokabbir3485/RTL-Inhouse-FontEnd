using DbExecutor;
using InventoryBLL;
using InventoryEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Security.UI.Controllers
{
    public class DeliveryNonSOController : Controller
    {
        [HttpPost]
        public ActionResult SaveDeliveryNonSO(inv_StockDeliveryNonSO inv_stockDeliveryNonSO, List<inv_StockDeliveryNonSODetail> inv_stockDeliveryNonSODetailLst)
        {
            using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
            {
                Int64 ret = 0;
                inv_stockDeliveryNonSO.UpdateDate = DateTime.Now;

                try
                {
                    if (inv_stockDeliveryNonSO.DeliveryId == 0)
                    {
                        ret = Facade.StockDeliveryNonSO.Add(inv_stockDeliveryNonSO);
                        if (ret > 0)
                        {
                            foreach (inv_StockDeliveryNonSODetail ainv_stockDeliveryNonSODetail in inv_stockDeliveryNonSODetailLst)
                            {
                                ainv_stockDeliveryNonSODetail.DeliveryId = ret;
                                if (ainv_stockDeliveryNonSODetail.ItemRemarks == null)
                                    ainv_stockDeliveryNonSODetail.ItemRemarks = "";
                                if (ainv_stockDeliveryNonSODetail.DeliveryUnitPrice == null)
                                    ainv_stockDeliveryNonSODetail.DeliveryUnitPrice = 0;

                                InventoryBLL.Facade.StockDeliveryNonSODetail.Add(ainv_stockDeliveryNonSODetail);
                            }
                        }
                    }

                    ts.Complete();

                    return Json(ret, JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {
                    error_Log error = new error_Log();
                    error.ErrorMessage = ex.Message;
                    error.ErrorType = ex.GetType().ToString();
                    error.FileName = "DeliveryNonSOController";
                    new ErrorLogInventoryController().CreateErrorLog(error);

                    return Json(null, JsonRequestBehavior.AllowGet);
                }
            }
        }
    }
}