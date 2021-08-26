using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Security.UI.ErpReports
{
    public partial class RV_Inv_PurchaseBillByPBId : System.Web.UI.Page
    {
        public Int64 PBId = 0;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                try
                {
                    PBId = Convert.ToInt64(Request.QueryString["PBId"]);
                }
                catch (Exception)
                {
                    PBId = 0;
                }
            }
        }

        protected void ObjectDataSource1_Selecting(object sender, ObjectDataSourceSelectingEventArgs e)
        {
            e.InputParameters["PBId"] = PBId;
        }
    }
}