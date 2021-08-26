using System;

namespace Security.UI.ErpReports
{
    public partial class RV_inv_StockLedgerSummary : System.Web.UI.Page
    {
        public DateTime FromDate, ToDate;
        public Int32 ItemId;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                FromDate = Convert.ToDateTime(Request.QueryString["FromDate"]);
                ToDate = Convert.ToDateTime(Request.QueryString["ToDate"]);
                ItemId = Request.QueryString["ItemId"] == "null" ? 0 : Convert.ToInt32(Request.QueryString["ItemId"]);
            }
        }
        protected void ObjectDataSource1_Selecting(object sender, System.Web.UI.WebControls.ObjectDataSourceSelectingEventArgs e)
        {
            e.InputParameters["FromDate"] = FromDate;
            e.InputParameters["ToDate"] = ToDate;
            e.InputParameters["ItemId"] = ItemId;
        }
    }
}