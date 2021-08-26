using DbExecutor;
using InventoryEntity;
using Newtonsoft.Json;
using SecurityBLL;
using SecurityEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;



namespace Security.UI.Controllers
{
    public class ItemController : Controller
    {
        public JsonResult GetAllSPCase()
        {
            try
            {
                var list = Facade.Item.GetAllSPCase();
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

        [HttpPost]
        public int Save(ad_Item item)
        {
            int ret = 0;
            item.CreateDate = DateTime.Now;
            item.UpdateDate = DateTime.Now;
            item.ItemCode = "N/A";
            //if (item.AccountCode == null)
            //{
            //    item.AccountCode = "";
            //}
            try
            {
                if (item.ItemId == 0)
                {
                    ret = Facade.Item.Add(item);
                }
                else
                {
                    ret = Facade.Item.Update(item);
                   
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
        [HttpPost]
        public int SaveNew(ad_Item item,ad_ItemVat itemVat)
        {
            if (item.ContainerSize == null) { item.ContainerSize = ""; };
            //if (item.ItemDescription == null) { item.ItemDescription = ""; };
            item.CreateDate = DateTime.Now;
            item.UpdateDate = DateTime.Now;
            int id = 0;

            try
            {
                using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
                {
                    if (item.ItemId == 0)
                    {
                        id = Facade.Item.Add(item);
                    }
                    else
                    {
                        id = Facade.Item.Update(item);
                    }
                   
                    if (itemVat.ItemVatId==0)
                    {
                        itemVat.ItemId = id;
                        id = Facade.Item.ad_ItemVat_Add(itemVat);
                    }
                    else
                    {
                        Facade.Item.ad_ItemVat_Update(itemVat);
                    }
                   
                    
                    ts.Complete();
                }


            }


            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return id;
        }

        [HttpGet]
        public JsonResult GetItemVatById(Int64 ItemId)
        {
          
            try
            {

              var  itemVatList = Facade.Item.GetItemVatById(ItemId);
                return Json(itemVatList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                //throw;
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemController";
                return Json(null, JsonRequestBehavior.AllowGet);
            }
           
        }

       


        [HttpPost]
        public int Delete(int ItemId)
        {
            int ret = 0;
            try
            {

                ret = Facade.Item.Delete(ItemId);
            }
            catch (Exception ex)
            {
                //throw;
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
        public JsonResult GetItemState()
        {
            try
            {
                var list = Facade.ItemState.GetAll();
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
        public JsonResult GetItemById(int itemId)
        {
            try
            {
                var list = Facade.Item.GetByItemId(itemId);
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
        public JsonResult GetAllItem()
        {
            try
            {
                var list = Facade.Item.GetAll();
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
        public JsonResult GetSubCategoryByItemIds(string itemIds)
        {
            try
            {
                var list = Facade.ItemSubCategory.GetByItemIds(itemIds);
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
        [HttpPost]
        public int SaveItemWiseState(ad_ItemWiseItemState itemWiseState)
        {

            int ret = 0;
            try
            {
                ret = Facade.ItemWiseItemState.Add(itemWiseState);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
        [HttpPost]
        public int SaveItemPrice(ad_ItemPrice itemPrice)
        {
            int ret = 0;
            itemPrice.CreateDate = DateTime.Now;
            itemPrice.UpdateDate = DateTime.Now;
            try
            {
                ret = Facade.ItemPrice.Add(itemPrice);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
        [HttpPost]
        public int SaveItemAssembly(ad_ItemAssembly itemAssembly)
        {
            int ret = 0;
            itemAssembly.CreateDate = DateTime.Now;
            itemAssembly.UpdateDate = DateTime.Now;
            try
            {
                ret = Facade.ItemAssembly.Add(itemAssembly);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
        [HttpPost]
        public int SaveItemSupplier(ad_ItemWiseSupplier itemSupplier)
        {
            int ret = 0;

            try
            {
                ret = Facade.ItemWiseSupplier.Add(itemSupplier);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
        [HttpPost]
        public Int64 SaveItemAdditionalAttribute(List<ad_ItemAdditionalAttribute> itemAdditionalAttributeLst, List<ad_ItemAdditionalAttributeValue> itemAdditionalAttributeValueLst, List<ad_ItemPrice> itemPricelst)
        {
            Int64 ret = 0;
            itemAdditionalAttributeValueLst = itemAdditionalAttributeValueLst.Where(x => x.AttributeValueId != 0).ToList();
            try
            {
                List<ad_ItemPrice> NewitemPricelst = itemPricelst.Where(i => i.TransactionTypeId == 2).ToList();

                using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
                {
                    if (itemAdditionalAttributeLst != null && itemAdditionalAttributeLst.Count > 0)
                    {
                        foreach (ad_ItemAdditionalAttribute itemAdditionalAttribute in itemAdditionalAttributeLst)
                        {
                            int flag = Facade.ItemAdditionalAttribute.GetByItemIdAndAttributeValueIdConcatCount(itemAdditionalAttribute.ItemId, itemAdditionalAttribute.Combination);
                            itemAdditionalAttribute.IsActive = true;
                            if (flag == 0)
                            {
                                ret = Facade.ItemAdditionalAttribute.Add(itemAdditionalAttribute);
                                foreach (ad_ItemPrice aNewitemPricelst in NewitemPricelst)
                                {
                                    ad_ItemPriceByAttribute attPrice = new ad_ItemPriceByAttribute()
                                    {
                                        AttributePriceId = 1,
                                        CreateDate = System.DateTime.Now,
                                        CreatorId = 1,
                                        IsActive = true,
                                        ItemAddAttId = ret,
                                        PriceTypeId = aNewitemPricelst.PriceTypeId,
                                        PurchaseContainerPrice = itemPricelst.Where(i => i.TransactionTypeId == 1).Select(o => o.ContainerPrice).FirstOrDefault(),
                                        PurchasePackagePrice = itemPricelst.Where(i => i.TransactionTypeId == 1).Select(o => o.PackagePrice).FirstOrDefault(),
                                        PurchaseUnitPrice = itemPricelst.Where(i => i.TransactionTypeId == 1).Select(o => o.UnitPrice).FirstOrDefault(),
                                        SaleContainerPrice = aNewitemPricelst.ContainerPrice,
                                        SalePackagePrice = aNewitemPricelst.PackagePrice,
                                        SaleUnitPrice = aNewitemPricelst.UnitPrice,
                                        UpdateDate = System.DateTime.Now,
                                        UpdatorId = 1
                                    };
                                    Facade.ad_ItemPriceByAttribute.Add(attPrice);
                                }
                                foreach (ad_ItemAdditionalAttributeValue value in itemAdditionalAttributeValueLst)
                                {
                                    if (value.Barcode == itemAdditionalAttribute.Barcode)
                                    {
                                        value.ItemAddAttId = ret;
                                        Facade.ItemAdditionalAttributeValue.Add(value);
                                    }
                                }
                            }
                        }
                    }
                    ts.Complete();
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
        [HttpPost]
        public Int64 SaveItemAdditionalAttributeValue(ad_ItemAdditionalAttributeValue itemAdditionalAttributeValue)
        {
            Int64 ret = 0;
            try
            {
                ret = Facade.ItemAdditionalAttributeValue.Add(itemAdditionalAttributeValue);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
        public JsonResult GetItemPriceItemId(int itemId)
        {
            try
            {
                var list = Facade.ItemPrice.GetByItemId(itemId);
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
        public JsonResult GetItemAssemblyByItemId(int itemId)
        {
            try
            {
                var list = Facade.ItemAssembly.GetByItemId(itemId);
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
        public JsonResult GetItemStateByItemId(int itemId)
        {
            try
            {
                var list = Facade.ItemWiseItemState.GetByItemId(itemId);
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
        public JsonResult GetItemSupplierByItemId(int itemId)
        {
            try
            {
                var list = Facade.ItemWiseSupplier.GetByItemId(itemId);
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
        public JsonResult GetItemAdditionalAttributeByItemId(int itemId)
        {
            try
            {
                var list = Facade.ItemAdditionalAttribute.GetByItemId(itemId);
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
        public string GetBarcode(int qty)
        {
            try
            {
                DataTable dt = Facade.Item.GetNBarcode(qty);
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {

                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemController";
                new ErrorLogController().CreateErrorLog(error);
                return null;
            }

        }
        public JsonResult GetItemAdditionalAttributeValueByItemAddAttId(int ItemAddAttId)
        {
            try
            {
                var list = Facade.ItemAdditionalAttributeValue.GetByItemAddAttId(ItemAddAttId);
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
        public JsonResult GetItemAdditionalAttributeValueByItemAddAttIdForItemEdit(Int32 itemId, Int32 attributeId)
        {
            try
            {
                var list = Facade.ItemAdditionalAttributeValue.GetByItemAddAttIdForItemEdit(itemId, attributeId);
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
        public JsonResult GetAttributes()
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
                error.FileName = "ItemController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetAddAttributesByItemId(int itemId)
        {
            try
            {
                var list = Facade.ItemAdditionalAttribute.GetByItemId(itemId);
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
        [HttpPost]
        public Int64 SaveItemAdditionalAttributes(ad_ItemAdditionalAttribute itemAdditionalAttributes)
        {

            Int64 ret = 0;
            try
            {
                ret = Facade.ItemAdditionalAttribute.Add(itemAdditionalAttributes);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
        public JsonResult GetAllTransactionType()
        {
            try
            {
                var transactionTypelist = Facade.TransactionType.GetAll();
                return Json(transactionTypelist, JsonRequestBehavior.AllowGet);
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
        public JsonResult GetAllPriceType()
        {
            try
            {
                var priceTypelist = Facade.PriceType.GetAll();
                return Json(priceTypelist, JsonRequestBehavior.AllowGet);
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
        public JsonResult GetAllChargeType()
        {
            try
            {
                var chargeTypelist = Facade.ChargeType.GetAll();
                return Json(chargeTypelist, JsonRequestBehavior.AllowGet);
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
        public JsonResult GetAllFinalPriceConfigforPurchase()
        {
            try
            {
                var FinalPriceConfiglistforPurchase = Facade.FinalPriceConfig.GetAllForPurchase();
                return Json(FinalPriceConfiglistforPurchase, JsonRequestBehavior.AllowGet);
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
        public JsonResult GetAllFinalPriceConfigforSale()
        {
            try
            {
                var FinalPriceConfiglistforSale = Facade.FinalPriceConfig.GetAllForSale();
                return Json(FinalPriceConfiglistforSale, JsonRequestBehavior.AllowGet);
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
        public JsonResult GetFinalPriceConfigDetailByConfigId(int ConfigId)
        {
            try
            {
                // new ad_FinalPriceConfigDetail().ChargePercentage;
                var customMODList = new List<object>();

                List<ad_FinalPriceConfigDetail> FinalPriceConfigDetailList = Facade.FinalPriceConfigDetail.GetByConfigId(ConfigId);

                foreach (ad_FinalPriceConfigDetail adFinalPriceConfigDetail in FinalPriceConfigDetailList)
                {
                    var cusMOD = new
                    {
                        ConfigId = adFinalPriceConfigDetail.ConfigId,
                        ConfigDetailId = adFinalPriceConfigDetail.ConfigDetailId,
                        ChargeTypeName = adFinalPriceConfigDetail.ChargeTypeName,
                        ChargeTypeId = adFinalPriceConfigDetail.ChargeTypeId,
                        ChargePercentage = adFinalPriceConfigDetail.ChargePercentage,
                        ApplyOn = Facade.FinalPriceConfigDetailApplyOn.GetByConfigDetailId(adFinalPriceConfigDetail.ConfigDetailId)
                    };
                    customMODList.Add(cusMOD);
                }


                return Json(customMODList, JsonRequestBehavior.AllowGet);
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
        public JsonResult GetFinalPriceConfigDetailApplyOnByConfigDetailId(Int64 ConfigDetailId)
        {
            //List<ad_FinalPriceConfigDetailApplyOn> aMockList =new List<ad_FinalPriceConfigDetailApplyOn>()
            //{
            //    new ad_FinalPriceConfigDetailApplyOn {ConfigDetailApplyOnId = 3 , ConfigDetailId = 6 , ApplyOnChargeTypeId =1},
            //    new ad_FinalPriceConfigDetailApplyOn {ConfigDetailApplyOnId = 6 , ConfigDetailId = 8 , ApplyOnChargeTypeId =1},
            //    new ad_FinalPriceConfigDetailApplyOn {ConfigDetailApplyOnId = 7 , ConfigDetailId = 9 , ApplyOnChargeTypeId =1},
            //    new ad_FinalPriceConfigDetailApplyOn {ConfigDetailApplyOnId = 8 , ConfigDetailId = 9 , ApplyOnChargeTypeId =8}
            //};

            try
            {
                var FinalPriceConfigDetailApplyOnList = Facade.FinalPriceConfigDetailApplyOn.GetByConfigDetailId(ConfigDetailId);

                //aMockList = aMockList.Where(r => r.ConfigDetailId == ConfigDetailId).ToList();
                return Json(FinalPriceConfigDetailApplyOnList, JsonRequestBehavior.AllowGet);
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
        public JsonResult GetAllChargeTypeWithProductPrice()
        {
            try
            {
                var chargeTypelistWithProductPrice = Facade.ChargeType.GetAllWithProductPrice();
                return Json(chargeTypelistWithProductPrice, JsonRequestBehavior.AllowGet);
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
        public JsonResult GetProductMovementType()
        {
            try
            {
                var myVar = System.Configuration.ConfigurationManager.AppSettings["ProductMovementType"].ToString(); ;
                return Json(myVar, JsonRequestBehavior.AllowGet);
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
        public JsonResult GetHasProduction()
        {
            try
            {
                var myVar = System.Configuration.ConfigurationManager.AppSettings["HasProduction"].ToString(); ;
                return Json(myVar, JsonRequestBehavior.AllowGet);
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
        public JsonResult GetHasAccounts()
        {
            try
            {
                var myVar = System.Configuration.ConfigurationManager.AppSettings["HasAccounts"].ToString(); ;
                return Json(myVar, JsonRequestBehavior.AllowGet);
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
        public JsonResult GetAllRawItem()
        {
            try
            {
                var RawItemList = Facade.Item.GetRaw();
                return Json(RawItemList, JsonRequestBehavior.AllowGet);
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
        public JsonResult GetRawWithoutSelectedItem(int itemId)
        {
            try
            {
                var RawItemList = Facade.Item.GetRawWithoutSelectedItem(itemId);
                return Json(RawItemList, JsonRequestBehavior.AllowGet);
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
        public JsonResult GetItemSearchResult(string searchCriteria)
        {

            try
            {
                string orderBy = "CategoryName, SubCategoryName, ItemName";
                var list = Facade.Item.GetDynamic(searchCriteria, orderBy);
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
        public JsonResult GetItemSearchResultPaged(int StartRecordNo, int RowPerPage, string whClause, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData = Facade.Item.GetPaged(StartRecordNo, RowPerPage, whClause, "CategoryName, SubCategoryName, ItemName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
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
        public JsonResult GetAdditionalAttributeWithValue(int attributeId)
        {
            try
            {
                var AdditionalAttributeListWithValue = new List<object>();

                ad_AdditionalAttribute aAdditionalAttribute = Facade.AdditionalAttribute.GetAll(attributeId).FirstOrDefault();

                var aAdditionalAttributeWithValue = new
                {
                    AttributeId = aAdditionalAttribute.AttributeId,
                    AttributeName = aAdditionalAttribute.AttributeName,
                    ValueAvailibilityType = aAdditionalAttribute.ValueAvailibilityType,
                    IsActive = aAdditionalAttribute.IsActive,
                    CreatorId = aAdditionalAttribute.CreatorId,
                    CreateDate = aAdditionalAttribute.CreateDate,
                    UpdatorId = aAdditionalAttribute.UpdatorId,
                    UpdateDate = aAdditionalAttribute.UpdateDate,
                    Values = Facade.AdditionalAttributeValue.GetByAttributeId(aAdditionalAttribute.AttributeId)
                };
                AdditionalAttributeListWithValue.Add(aAdditionalAttributeWithValue);

                return Json(AdditionalAttributeListWithValue, JsonRequestBehavior.AllowGet);
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
        public JsonResult GetAllAdditionalAttributeWithValue(string attributeIds)
        {
            try
            {
                //var test = Facade.AdditionalAttributeValue.GetByAttributeId(4);
                var AdditionalAttributeListWithValue = new List<object>();
                List<ad_AdditionalAttribute> additionalAttributeList = Facade.AdditionalAttribute.GetAllActiveByIds(attributeIds);
                foreach (ad_AdditionalAttribute aAdditionalAttribute in additionalAttributeList)
                {
                    var aAdditionalAttributeWithValue = new
                    {
                        AttributeId = aAdditionalAttribute.AttributeId,
                        AttributeName = aAdditionalAttribute.AttributeName,
                        ValueAvailibilityType = aAdditionalAttribute.ValueAvailibilityType,
                        IsActive = aAdditionalAttribute.IsActive,
                        CreatorId = aAdditionalAttribute.CreatorId,
                        CreateDate = aAdditionalAttribute.CreateDate,
                        UpdatorId = aAdditionalAttribute.UpdatorId,
                        UpdateDate = aAdditionalAttribute.UpdateDate,
                        Values = Facade.AdditionalAttributeValue.GetByAttributeId(aAdditionalAttribute.AttributeId)
                    };
                    AdditionalAttributeListWithValue.Add(aAdditionalAttributeWithValue);
                }

                return Json(AdditionalAttributeListWithValue, JsonRequestBehavior.AllowGet);
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
        public JsonResult GetByCombinationLike()
        {
            try
            {
                //DataTable dt = Facade.ItemAdditionalAttribute.GetByCombinationLike();
                //return Json(JsonConvert.SerializeObject(dt), JsonRequestBehavior.AllowGet);
                DataTable dt = Facade.ItemAdditionalAttribute.GetByCombinationLike();
                var item = JsonConvert.SerializeObject(dt);
                return Json(item, JsonRequestBehavior.AllowGet);

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

        
        public JsonResult GetByDepartmentAndCombinationLike(int departmentId)
        {
            try
            {
                DataTable dt = Facade.ItemAdditionalAttribute.GetByDepartment(departmentId);
                return Json(JsonConvert.SerializeObject(dt), JsonRequestBehavior.AllowGet);
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
        public JsonResult GetByDepartmentAndAllCombinationLikeWithCurrent(int departmentId)
        {
            try
            {
                DataTable dt = Facade.ItemAdditionalAttribute.GetByDepartmentAllItem(departmentId);
                return Json(JsonConvert.SerializeObject(dt), JsonRequestBehavior.AllowGet);
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
        public JsonResult GetCombinationWithPrice()
        {
            try
            {
                DataTable dt = Facade.ItemAdditionalAttribute.GetCombinationWithPrice();
                return Json(JsonConvert.SerializeObject(dt), JsonRequestBehavior.AllowGet);
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

      

        //public JsonResult GetCombinationByRequisition(int requisitionId)
        //{
        //    try
        //    {
        //        DataTable dt = Facade.ItemAdditionalAttribute.GetCombinationByRequisitionId(requisitionId);
        //        return Json(JsonConvert.SerializeObject(dt), JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception ex)
        //    {
        //        error_Log error = new error_Log();
        //        error.ErrorMessage = ex.Message;
        //        error.ErrorType = ex.GetType().ToString();
        //        error.FileName = "ItemController";
        //        new ErrorLogController().CreateErrorLog(error);
        //        return Json(null, JsonRequestBehavior.AllowGet);
        //    }
        //}
        public JsonResult GetAllActiveMovementMethod()
        {
            try
            {
                var movementList = Facade.StockMovementMethod.GetAllActive();
                return Json(movementList, JsonRequestBehavior.AllowGet);
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
        public JsonResult GetItemDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.Item.GetDynamic(searchCriteria, orderBy);
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

        public JsonResult GetItemForIwoDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.Item.GetDynamic(searchCriteria, "I.ItemName");
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
        public string GetLimitedProperty()
        {
            try
            {
                DataTable dt = Facade.Item.GetLimitedProperty();
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemController";
                new ErrorLogController().CreateErrorLog(error);
                return null;
            }
        }
        public string GetSinglePrice(Int32 transactionTypeId, Int32 priceTypeId, Int64 ItemAddAttId, Int32 unitId)
        {
            try
            {
                DataTable dt = Facade.ItemPrice.GetSinglePrice(transactionTypeId, priceTypeId, ItemAddAttId, unitId);
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemController";
                new ErrorLogController().CreateErrorLog(error);
                return null;
            }
        }
        public JsonResult GetPriceAndAdditionalAttribute(Int32 transactionTypeId, Int32 priceTypeId, Int32 itemId, Int32 unitId)
        {
            try
            {
                DataTable dt = Facade.ItemPrice.GetSinglePrice(transactionTypeId, priceTypeId, itemId, unitId);
                List<ad_ItemAdditionalAttribute> ItemAdditionalAttributeLst = Facade.ItemAdditionalAttribute.GetByItemId(itemId);
                DataTable dt3 = Facade.ItemAdditionalAttribute.GetAttributeNameByItemId(itemId);
                var FinalResult = new { finalPrice = JsonConvert.SerializeObject(dt), ItemAdditionalAttributeLst = ItemAdditionalAttributeLst, ItemAdditionalAttributeValueLst = JsonConvert.SerializeObject(dt3) };
                return Json(FinalResult, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemController";
                new ErrorLogController().CreateErrorLog(error);
                return null;
            }
        }
        public JsonResult SaveFiles(string description)
        {
            
            string Message, fileName, actualFileName;
            Message = fileName = actualFileName = string.Empty;
            bool flag = false;
            if (Request.Files != null)
            {
                var file = Request.Files[0];
                actualFileName = file.FileName;
                fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                int size = file.ContentLength;

                var artWorkFileName = "ArtWork"+"_"+ actualFileName;




                try
                {
                    file.SaveAs(Path.Combine(Server.MapPath("~/UploadedFiles/ArtWork"), artWorkFileName));

                    //PhotoFile f = new PhotoFile
                    //{
                    //    FileName = actualFileName,
                    //    FilePath = fileName,
                    //    Description = description,
                    //    FileSize = size
                    //};
                    //using (angularDBEntities dc = new angularDBEntities())
                    //{
                    //    dc.PhotoFiles.Add(f);
                    //    dc.SaveChanges();
                    //    Message = "File uploaded successfully";
                    //    flag = true;
                    //}
                }
                catch (Exception)
                {
                    Message = "File upload failed! Please try again";
                }

            }
            return new JsonResult { Data = new { Message = Message, Status = flag } };
        }
        //[HttpPost]
        //public JsonResult SaveFiles(string odlUrl)
        //{
        //    if (!odlUrl.Equals("undefined"))
        //    {
        //        DeletePysicalFiles(odlUrl);
        //    }
        //    string Message, fileName, actualFileName;
        //    Message = fileName = actualFileName = string.Empty;
        //    bool flag = false;
        //    if (Request.Files.Count != 0)
        //    {
        //        var file = Request.Files[0];
        //        actualFileName = file.FileName;
        //        fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
        //        int size = file.ContentLength;

        //        try
        //        {
        //            file.SaveAs(Path.Combine(Server.MapPath("~/UploadedImages"), actualFileName));
        //        }
        //        catch (Exception)
        //        {
        //            Message = "File upload failed! Please try again";
        //        }
        //    }
        //    return new JsonResult { Data = new { Message = Message, Status = flag } };
        //}
        public void DeletePysicalFiles(string fileName)
        {

            try
            {
                System.IO.File.Delete(Request.PhysicalApplicationPath + fileName);
            }
            catch (Exception)
            {

            }
        }
        public JsonResult GetAllBarcode()
        {
            try
            {
                DataTable dt = Facade.ItemAdditionalAttribute.GetAllBarcode();
                return Json(JsonConvert.SerializeObject(dt), JsonRequestBehavior.AllowGet);
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
        public string GetByCombinationValue()
        {
            try
            {
                DataTable dt = Facade.ItemAdditionalAttribute.GetByCombinationValue();
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ItemController";
                new ErrorLogController().CreateErrorLog(error);
                return null;
            }
        }
        public JsonResult GetCombinationByRequisition(int requisitionId)
        {
            try
            {
                DataTable dt = Facade.Item.GetCombinationByRequisitionId(requisitionId);
                return Json(JsonConvert.SerializeObject(dt), JsonRequestBehavior.AllowGet);
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