using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Security.UI.ErpReports
{
    public partial class RV_pro_DateWiseProductionStatus : System.Web.UI.Page
    {
        public DateTime fromDate, toDate = DateTime.Now;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                try
                {
                    fromDate = Convert.ToDateTime(Request.QueryString["fromDate"]);
                    toDate = Convert.ToDateTime(Request.QueryString["toDate"]);
                }
                catch (Exception)
                {
                    //ignored
                }
            }
        }

        protected void ObjectDataSource1_Selecting(object sender, ObjectDataSourceSelectingEventArgs e)
        {
            e.InputParameters["fromDate"] = fromDate;
            e.InputParameters["toDate"] = toDate;
        }
    }
}