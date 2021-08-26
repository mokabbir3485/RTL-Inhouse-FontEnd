using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Security.UI.ErpReports
{
    public partial class RV_inv_GatePass : System.Web.UI.Page
    {
        public Int64 DeliveryId { get; set; }
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                try
                {
                    DeliveryId = Convert.ToInt32(Request.QueryString["DeliveryId"]);
                }
                catch (Exception)
                {
                    DeliveryId = 0;
                }
            }
        }

        protected void ObjectDataSource1_Selecting(object sender, ObjectDataSourceSelectingEventArgs e)
        {
            e.InputParameters["DeliveryId"] = DeliveryId;
        }

        
    }
}