using HrAndPayrollEntity;
using SecurityBLL;
using SecurityEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Transactions;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Security.UI.Controllers
{
    [EnableCors(origins: "http://localhost:4200,http://43.224.119.250:85,http://192.168.0.10:85,http://103.4.147.81:85", headers: "*", methods: "*")]
    public class HrController : ApiController
    {
        [Route("OvertimeInsert/{otTypeId}/{name}/{period}/{otOn}/{timesOfAnHour}/{hoursAfterOTStarts}/{oTPulsaeInMin}")]
        [HttpGet]
        public int OvertimeInsert(int otTypeId, string name, string period, string otOn, decimal timesOfAnHour, decimal hoursAfterOTStarts, int oTPulsaeInMin)
        {
            hr_OverTimeType otType = new hr_OverTimeType();
            otType.OverTimeTypeId = otTypeId;
            otType.OverTimeTypeName = name;
            otType.OverTimePeriod = period;
            otType.OverTimeOn = otOn;
            otType.TimesOfAnHour = timesOfAnHour;
            otType.HoursAfterOTStarts = hoursAfterOTStarts;
            otType.OTPulsaeInMin = oTPulsaeInMin;
            otType.UpdatorId = 1;
            otType.UpdateDate = DateTime.Now;

            int i = HrAndPayrollBLL.Facade.hr_OverTimeType.Add(otType);
            return i;
        }

        [Route("OverTimeType/GetAllOverTimeType")]
        [HttpGet]
        public IEnumerable<hr_OverTimeType> GetAllOverTimeType()
        {
            List<hr_OverTimeType> otTypeList = HrAndPayrollBLL.Facade.hr_OverTimeType.GetAll();
            return otTypeList;
        }

        [Route("HrTypesInsert/{typeId}/{entity}/{name}/{isActive}")]
        [HttpGet]
        public int HrTypesInsert(int typeId, string entity, string name, bool isActive)
        {
            hr_Types types = new hr_Types();
            types.TypesId = typeId;
            types.Entity = entity;
            types.TypesName = name;
            types.IsActive = isActive;
            types.UpdatorId = 1;
            types.UpdateDate = DateTime.Now;

            int i = HrAndPayrollBLL.Facade.hr_Types.Add(types);
            return i;
        }

        [Route("HrTypes/GetAllHrTypes")]
        [HttpGet]
        public IEnumerable<hr_Types> GetAllHrTypes()
        {
            List<hr_Types> typeList = HrAndPayrollBLL.Facade.hr_Types.GetAll();
            return typeList;
        }

        [Route("Holiday/SaveHoliday")]
        [HttpPost]
        public int SaveHoliday([FromBody] hr_Holiday holiday)
        {
            //holiday.BranchId = 0;
            holiday.DepartmentId = 0;
            holiday.UpdatorId = 1;
            holiday.UpdateDate = DateTime.Now;
            int i = HrAndPayrollBLL.Facade.hr_Holiday.Add(holiday);
            return i;
        }

        [Route("Holiday/DeleteHoliday")]
        [HttpPost]
        public string DeleteHoliday([FromBody] hr_Holiday holiday)
        {
            try
            {
                int i = HrAndPayrollBLL.Facade.hr_Holiday.Delete(holiday.HolidayId);
                return i.ToString();
            }
            catch (Exception ex)
            {
                return "Error: " + ex.Message;
            }
        }

        [Route("Holiday/GetAllHoliday")]
        [HttpGet]
        public IEnumerable<hr_Holiday> GetAllHoliday()
        {
            List<hr_Holiday> holidayList = HrAndPayrollBLL.Facade.hr_Holiday.GetAll();
            return holidayList;
        }

        [Route("AttPolicy/SaveAttPolicy")]
        [HttpPost]
        public string SaveAttPolicy([FromBody] hr_AttendancePolicy attPolicy)
        {
            try
            {
                attPolicy.NoOfWeeklyHoliday = 1;
                attPolicy.UpdatorId = 1;
                attPolicy.UpdateDate = DateTime.Now;
                int i = HrAndPayrollBLL.Facade.hr_AttendancePolicy.Add(attPolicy);
                return i.ToString();
            }
            catch (Exception ex)
            {
                return "Error: " + ex.Message;
            }
        }

        [Route("AttendancePolicy/GetAllAttendancePolicy")]
        [HttpGet]
        public IEnumerable<hr_AttendancePolicy> GetAllAttendancePolicy()
        {
            List<hr_AttendancePolicy> AttendancePolicyList = new List<hr_AttendancePolicy>();
            try
            {
                AttendancePolicyList = HrAndPayrollBLL.Facade.hr_AttendancePolicy.GetAll();
            }
            catch (Exception ex)
            {

            }
            return AttendancePolicyList;
        }

        [Route("Grade/SaveGrade")]
        [HttpPost]
        public string SaveGrade([FromBody] hr_Grade grade)
        {
            try
            {
                grade.UpdatorId = 1;
                grade.UpdateDate = DateTime.Now;
                int i = HrAndPayrollBLL.Facade.hr_Grade.Add(grade);
                return i.ToString();
            }
            catch (Exception ex)
            {
                return "Error: " + ex.Message;
            }
        }

        [Route("LeaveTypeSetup/SaveLeaveTypeSetup")]
        [HttpPost]
        public int SaveLeaveTypeSetup([FromBody] hr_LeaveTypeSetup leaveType)
        {
            leaveType.IsByYearly = true;
            int i = HrAndPayrollBLL.Facade.hr_LeaveTypeSetup.Add(leaveType);
            return i;
        }

        [Route("BonusTypeSetup/SaveBonusTypeSetup")]
        [HttpPost]
        public int SaveBonusTypeSetup([FromBody] hr_BonusTypeSetup bonusType)
        {
            int i = HrAndPayrollBLL.Facade.hr_BonusTypeSetup.Add(bonusType);
            return i;
        }

        [Route("AllowanceTypeSetup/SaveAllowanceTypeSetup")]
        [HttpPost]
        public int SaveAllowanceTypeSetup([FromBody] hr_AllowanceTypeSetup allowanceType)
        {
            int i = HrAndPayrollBLL.Facade.hr_AllowanceTypeSetup.Add(allowanceType);
            return i;
        }

        [Route("Shift/SaveShift")]
        [HttpPost]
        public string SaveShift([FromBody] hr_Shift shift)
        {
            try
            {
                shift.IsHalfDay = false;
                shift.UpdatorId = 1;
                shift.UpdateDate = DateTime.Now;
                Int64 i = HrAndPayrollBLL.Facade.hr_Shift.Add(shift);
                return i.ToString();
            }
            catch (Exception ex)
            {
                return "Error: " + ex.Message;
            }
        }

        [Route("Shift/UpdateShift")]
        [HttpPost]
        public string UpdateShift([FromBody] hr_Shift shift)
        {
            try
            {
                int i = HrAndPayrollBLL.Facade.hr_Shift.UpdateShift(shift);
                return i.ToString();
            }
            catch (Exception ex)
            {
                return "Error: " + ex.Message;
            }
        }

        [Route("Shift/GetEmployeeForShiftEntry/{branchId}/{from}/{to}")]
        [HttpGet]
        public IEnumerable<ad_Employee> GetEmployeeForShiftEntry(int branchId, DateTime from, DateTime to)
        {
            List<ad_Employee> empList = SecurityBLL.Facade.Employee.GetForShiftEntry(branchId, from, to);
            return empList;
        }

        [Route("Shift/GetShiftForEntry/{branchId}/{attPolicyId}/{from}/{to}/{empIds}")]
        [HttpGet]
        public IEnumerable<hr_Shift> GetShiftForEntry(int branchId, int attPolicyId, DateTime from, DateTime to, string empIds)
        {
            List<hr_Shift> shiftList = HrAndPayrollBLL.Facade.hr_Shift.GetForEntry(branchId, attPolicyId, from, to, empIds);
            return shiftList;
        }

        [Route("Shift/GetShiftForFinalise/{branchId}/{employeeId}/{from}/{to}")]
        [HttpGet]
        public IEnumerable<hr_Shift> GetShiftForFinalise(int branchId, int employeeId, string from, string to)
        {
            try
            {
                DateTime fromDate = Convert.ToDateTime(from);
                DateTime toDate = Convert.ToDateTime(to);
                List<hr_Shift> shiftList = HrAndPayrollBLL.Facade.hr_Shift.GetForFinalise(branchId, employeeId, fromDate, toDate);
                return shiftList;
            }
            catch (Exception ex)
            {
                hr_Shift shiftError = new hr_Shift();
                shiftError.Remarks = ex.Message;
                List<hr_Shift> shiftList = new List<hr_Shift>();
                shiftList.Add(shiftError);
                return shiftList;
            }
        }

        [Route("Shift/GetForExcelExport/{branchId}/{from}/{to}")]
        [HttpGet]
        public IEnumerable<hr_Shift> GetForExcelExport(int branchId, DateTime from, DateTime to)
        {
            try
            {
                DateTime fromDate = Convert.ToDateTime(from);
                DateTime toDate = Convert.ToDateTime(to);
                List<hr_Shift> shiftList = HrAndPayrollBLL.Facade.hr_Shift.GetForExcelExport(branchId, fromDate, toDate);
                return shiftList;
            }
            catch (Exception ex)
            {
                hr_Shift shiftError = new hr_Shift();
                shiftError.Remarks = ex.Message;
                List<hr_Shift> shiftList = new List<hr_Shift>();
                shiftList.Add(shiftError);
                return shiftList;
            }
        }
        [Route("leaveSetup/GetLeaveTypeByGradeId/{gradeId}")]
        [HttpGet]

        //public List<hr_LeaveTypeSetup> GetLeaveTypeByGradeId(int gradeId)
        //{
        //    List<hr_LeaveTypeSetup> GetLeaveTypeList = new List<hr_LeaveTypeSetup>();
        //    try
        //    {
        //        GetLeaveTypeList = HrAndPayrollBLL.Facade.hr_LeaveTypeSetup.GetLeaveTypeByGradeId(gradeId);
        //    }
        //    catch (Exception ex)
        //    {
               
        //    }
        //    return GetLeaveTypeList;
        //}

        [Route("LeaveApplication/SaveLeaveApplication")]
        [HttpPost]
        public string SaveLeaveApplication([FromBody] hr_LeaveApplication LeaveApplication)
        {
            try
            {
                LeaveApplication.UpdatorId = 1;
                LeaveApplication.UpdateDate = DateTime.Now;
                Int64 i = HrAndPayrollBLL.Facade.hr_LeaveApplication.Save(LeaveApplication);
                return i.ToString();
            }
            catch (Exception ex)
            {
                return "Error: " + ex.Message;
            }
        }

        [Route("LeaveApplication/SaveLeaveApproval")]
        [HttpPost]
        public string SaveLeaveApproval([FromBody] hr_LeaveApplication LeaveApplication)
        {
            try
            {
                //LeaveApplication.UpdatorId = 1;
                LeaveApplication.UpdateDate = DateTime.Now;
                Int64 i = HrAndPayrollBLL.Facade.hr_LeaveApplication.SaveApproval(LeaveApplication);
                return i.ToString();
            }
            catch (Exception ex)
            {
                return "Error: " + ex.Message;
            }
        }

        [Route("LeaveApplication/ForwardForApproval")]
        [HttpPost]
        public string ForwardForApproval([FromBody] hr_LeaveApplication LeaveApplication)
        {
            try
            {
                Int64 i = HrAndPayrollBLL.Facade.hr_LeaveApplication.SaveForward(LeaveApplication);
                return i.ToString();
            }
            catch (Exception ex)
            {
                return "Error: " + ex.Message;
            }
        }

        [Route("LeaveApplication/GetLeaveApplicationForApproval")]
        [HttpGet]
        public IEnumerable<hr_LeaveApplication> GetLeaveApplicationForApproval()
        {
            List<hr_LeaveApplication> leaveApplicationList = new List<hr_LeaveApplication>();
            try
            {
                leaveApplicationList = HrAndPayrollBLL.Facade.hr_LeaveApplication.GetForApproval();
            }
            catch (Exception ex)
            {

            }
            return leaveApplicationList;
        }

        [Route("LeaveApplication/GetByBranch/{branchId}")]
        [HttpGet]
        public IEnumerable<hr_LeaveApplication> GetByBranch(int branchId)
        {
            List<hr_LeaveApplication> leaveApplicationList = new List<hr_LeaveApplication>();
            try
            {
                leaveApplicationList = HrAndPayrollBLL.Facade.hr_LeaveApplication.GetByBranchId(branchId);
            }
            catch (Exception ex)
            {

            }
            return leaveApplicationList;
        }

        [Route("LeaveApplication/GetLeaveApplicationByEmployee/{employeeId}")]
        [HttpGet]
        public IEnumerable<hr_LeaveApplication> GetLeaveApplicationByEmployee(int employeeId)
        {
            List<hr_LeaveApplication> leaveApplicationList = new List<hr_LeaveApplication>();
            try
            {
                leaveApplicationList = HrAndPayrollBLL.Facade.hr_LeaveApplication.GetByEmployeeId(employeeId);
            }
            catch (Exception ex)
            {

            }
            return leaveApplicationList;
        }

        [Route("Employee/GetAllEmployee")]
        [HttpGet]
        public IEnumerable<ad_Employee> GetEmployeeForApproval()
        {
            List<ad_Employee> EmployeeList = new List<ad_Employee>();
            try
            {
                EmployeeList = SecurityBLL.Facade.Employee.GetAll();
            }
            catch (Exception ex)
            {

            }
            return EmployeeList;
        }

        [Route("Employee/GetEmployeeLeaveBalance/{employeeId}/{appDate}")]
        [HttpGet]
        public IEnumerable<hr_LeaveTypeSetup> GetEmployeeLeaveBalance(Int32 employeeId, DateTime appDate)
        {
            List<hr_LeaveTypeSetup> EmployeeList = new List<hr_LeaveTypeSetup>();
            try
            {
                EmployeeList = HrAndPayrollBLL.Facade.hr_LeaveTypeSetup.GetEmployeeLeaveBalance(employeeId, appDate);
            }
            catch (Exception ex)
            {

            }
            return EmployeeList;
        }

        [Route("Employee/GetEmployeeByBranchId/{branchId}")]
        [HttpGet]
        public IEnumerable<ad_Employee> GetEmployeeByBranchId(Int32 branchId)
        {
            List<ad_Employee> EmployeeList = new List<ad_Employee>();
            try
            {
                EmployeeList = SecurityBLL.Facade.Employee.GetDynamic("E.IsActive=1 AND D.BranchId=" + branchId, "FullName");
            }
            catch (Exception ex)
            {

            }
            return EmployeeList;
        }

        [Route("Shift/GetShiftForView/{branchId}/{employeeId}/{from}/{to}")]
        [HttpGet]
        public IEnumerable<hr_Shift> GetShiftForView(int branchId, int employeeId, string from, string to)
        {
            try
            {
                DateTime fromDate = Convert.ToDateTime(from);
                DateTime toDate = Convert.ToDateTime(to);
                List<hr_Shift> shiftList = HrAndPayrollBLL.Facade.hr_Shift.GetForView(branchId, employeeId, fromDate, toDate);
                return shiftList;
            }
            catch (Exception ex)
            {
                hr_Shift shiftError = new hr_Shift();
                shiftError.Remarks = ex.Message;
                List<hr_Shift> shiftList = new List<hr_Shift>();
                shiftList.Add(shiftError);
                return shiftList;
            }
        }

        [Route("Shift/GetRawPunch/{employeeId}/{from}/{to}")]
        [HttpGet]
        public IEnumerable<hr_RawPunch> GetRawPunch(int employeeId, string from, string to)
        {
            try
            {
                DateTime fromDate = Convert.ToDateTime(from);
                DateTime toDate = Convert.ToDateTime(to);
                List<hr_RawPunch> shiftList = HrAndPayrollBLL.Facade.hr_Shift.GetRawPunch(employeeId, fromDate, toDate);
                return shiftList;
            }
            catch (Exception ex)
            {
                hr_RawPunch shiftError = new hr_RawPunch();
                shiftError.EmployeeName = ex.Message;
                List<hr_RawPunch> shiftList = new List<hr_RawPunch>();
                shiftList.Add(shiftError);
                return shiftList;
            }
        }

        [Route("HrUser/GetHrUserByUsernameAndPassword/{username}/{password}")]
        [HttpGet]
        public IEnumerable<hr_User> GetHrUserByUsernameAndPassword(string username, string password)
        {
            try
            {
                List<hr_User> shiftList = HrAndPayrollBLL.Facade.hr_User.GetHrUserByUsernameAndPassword(username, password);
                return shiftList;
            }
            catch (Exception ex)
            {
                hr_User shiftError = new hr_User();
                shiftError.Username = ex.Message;
                List<hr_User> shiftList = new List<hr_User>();
                shiftList.Add(shiftError);
                return shiftList;
            }
        }

        [Route("HrUser/GetHrUserByEmployeeId/{employeeId}")]
        [HttpGet]
        public IEnumerable<hr_User> GetHrUserByEmployeeId(int employeeId)
        {
            try
            {
                List<hr_User> shiftList = HrAndPayrollBLL.Facade.hr_User.GetHrUserByEmployeeId(employeeId);
                return shiftList;
            }
            catch (Exception ex)
            {
                hr_User shiftError = new hr_User();
                shiftError.Username = ex.Message;
                List<hr_User> shiftList = new List<hr_User>();
                shiftList.Add(shiftError);
                return shiftList;
            }
        }

        [Route("HrUser/GetHrUser/{hrUserId}")]
        [HttpGet]
        public IEnumerable<hr_User> GetHrUser(int? hrUserId = null)
        {
            try
            {
                List<hr_User> usertList = HrAndPayrollBLL.Facade.hr_User.GetAll(hrUserId);
                return usertList;
            }
            catch (Exception ex)
            {
                hr_User error = new hr_User();
                error.Username = ex.Message;
                List<hr_User> usertList = new List<hr_User>();
                usertList.Add(error);
                return usertList;
            }
        }

        [Route("HrUser/SaveHrUser")]
        [HttpPost]
        public string SaveHrUser([FromBody] hr_User user)
        {
            try
            {
                user.UpdatorId = 1;
                user.UpdateDate = DateTime.Now;
                Int32 i = HrAndPayrollBLL.Facade.hr_User.Save(user);
                return i.ToString();
            }
            catch (Exception ex)
            {
                return "Error: " + ex.Message;
            }
        }

        [Route("HrUser/ChangeHrUserPassword/{employeeId}/{password}")]
        [HttpGet]
        public int ChangeHrUserPassword(int employeeId, string password)
        {
            int i = HrAndPayrollBLL.Facade.hr_User.HrUserChangePassword(employeeId, password);
            return i;
        }

        [Route("HrUser/GetPrioritySequenceeByBranchId/{branchId}")]
        [HttpGet]
        public IEnumerable<hr_User> GetPrioritySequenceeByBranchId(int branchId)
        {
            try
            {
                List<hr_User> usertList = HrAndPayrollBLL.Facade.hr_User.GetPrioritySequenceeByBranchId(branchId);
                return usertList;
            }
            catch (Exception ex)
            {
                hr_User error = new hr_User();
                error.Username = ex.Message;
                List<hr_User> usertList = new List<hr_User>();
                usertList.Add(error);
                return usertList;
            }
        }

        [Route("HrUser/PostPrioritySequence")]
        [HttpPost]
        public string PostPrioritySequence(hr_User user)
        {
            try
            {

                int i = HrAndPayrollBLL.Facade.hr_User.PostPrioritySequence(user);
                return i.ToString();
            }
            catch (Exception ex)
            {
                return "Error: " + ex.Message;
            }
        }

        [Route("Grade/GetAllGrade")]
        [HttpGet]
        public IEnumerable<hr_Grade> GetAllGrade()
        {
            List<hr_Grade> gradeList = new List<hr_Grade>();
            try
            {
                gradeList = HrAndPayrollBLL.Facade.hr_Grade.GetAll();
            }
            catch (Exception ex)
            {

            }
            return gradeList;
        }

        [Route("AllowanceTypeSetup/GetAllAllowanceTypeSetupByGradeId/{gradeId}")]
        [HttpGet]
        public IEnumerable<hr_AllowanceTypeSetup> GetAllAllowanceTypeSetupByGradeId(int gradeId)
        {
            List<hr_AllowanceTypeSetup> AllowanceTypeSetupList = new List<hr_AllowanceTypeSetup>();
            try
            {
                AllowanceTypeSetupList = HrAndPayrollBLL.Facade.hr_AllowanceTypeSetup.GetByGradeId(gradeId);
            }
            catch (Exception ex)
            {

            }
            return AllowanceTypeSetupList;
        }

        [Route("BonusTypeSetup/GetAllBonusTypeSetupByGradeId/{gradeId}")]
        [HttpGet]
        public IEnumerable<hr_BonusTypeSetup> GetAllBonusTypeSetupByGradeId(int gradeId)
        {
            List<hr_BonusTypeSetup> BonusTypeSetupList = new List<hr_BonusTypeSetup>();
            try
            {
                BonusTypeSetupList = HrAndPayrollBLL.Facade.hr_BonusTypeSetup.GetByGradeId(gradeId);
            }
            catch (Exception ex)
            {

            }
            return BonusTypeSetupList;
        }

        [Route("LeaveTypeSetup/GetAllLeaveTypeSetupByGradeId/{gradeId}")]
        [HttpGet]
        public IEnumerable<hr_LeaveTypeSetup> GetAllLeaveTypeSetupByGradeId(int gradeId)
        {
            List<hr_LeaveTypeSetup> LeaveTypeSetupList = new List<hr_LeaveTypeSetup>();
            try
            {
                LeaveTypeSetupList = HrAndPayrollBLL.Facade.hr_LeaveTypeSetup.GetByGradeId(gradeId);
            }
            catch (Exception ex)
            {

            }
            return LeaveTypeSetupList;
        }

        [Route("Role/GetHrRole")]
        [HttpGet]
        public IEnumerable<s_Role> GetHrRole()
        {
            List<s_Role> roleList = new List<s_Role>();
            try
            {
                roleList = SecurityBLL.Facade.Role.GetDynamic("RoleName LIKE 'HR %'", "");
            }
            catch (Exception ex)
            {

            }
            return roleList;
        }

        [Route("Report/GetAttendanceSummary/{from}/{to}/{branchId}/{gradeId}/{employeeId}/{departmentId}/{sectionId}")]
        [HttpGet]
        public IEnumerable<hr_AttendanceSummary> GetAttendanceSummary(DateTime from, DateTime to, int branchId, int gradeId, int employeeId, string departmentId, int sectionId)
        {
            List<hr_AttendanceSummary> summaryList = HrAndPayrollBLL.Facade.hr_Shift.GetAttendanceSummary(from, to, branchId, gradeId, employeeId, departmentId, sectionId);
            return summaryList;
        }

        [Route("Report/GetAttendanceDetail/{from}/{to}/{employeeId}")]
        [HttpGet]
        public IEnumerable<hr_AttendanceDetail> GetAttendanceDetail(DateTime from, DateTime to, int employeeId)
        {
            List<hr_AttendanceDetail> DetailList = HrAndPayrollBLL.Facade.hr_Shift.GetAttendanceDetail(from, to, employeeId);
            return DetailList;
        }

        [Route("Payroll/GetSalaryForPrepare/{monthId}/{yearId}/{branchId}/{gradeId}/{departmentId}/{sectionId}")]
        [HttpGet]
        public IEnumerable<hr_Salary> GetSalaryForPrepare(int monthId, int yearId, int branchId, int gradeId, string departmentId, int sectionId)
        {
            List<hr_Salary> salaryList = HrAndPayrollBLL.Facade.hr_Salary.GetForPrepare(monthId, yearId, gradeId);

            hr_Salary salary = salaryList.FirstOrDefault();

            List<hr_SalaryDetail> salaryDetailList = HrAndPayrollBLL.Facade.hr_SalaryDetail.GetForPrepare(monthId, yearId, branchId, gradeId, departmentId, sectionId);

            salary.SalaryDetailList = salaryDetailList;

            List<hr_Salary> salaryListRet = new List<hr_Salary>();
            salaryListRet.Add(salary);

            return salaryListRet;
        }

        [Route("Payroll/PostSalary")]
        [HttpPost]
        public string PostSalary([FromBody] hr_Salary salary)
        {
            using (TransactionScope ts = new TransactionScope())
            {
                try
                {
                    salary.BasicFormula = string.IsNullOrEmpty(salary.BasicFormula) ? string.Empty : salary.BasicFormula;
                    salary.HouseRentFormula = string.IsNullOrEmpty(salary.HouseRentFormula) ? string.Empty : salary.HouseRentFormula;
                    salary.MedicalFormula = string.IsNullOrEmpty(salary.MedicalFormula) ? string.Empty : salary.MedicalFormula;
                    salary.ConveyanceFormula = string.IsNullOrEmpty(salary.ConveyanceFormula) ? string.Empty : salary.ConveyanceFormula;
                    salary.LunchFormula = string.IsNullOrEmpty(salary.LunchFormula) ? string.Empty : salary.LunchFormula;
                    salary.FourthSignLabel = string.IsNullOrEmpty(salary.FourthSignLabel) ? string.Empty : salary.FourthSignLabel;
                    salary.FifthSignLabel = string.IsNullOrEmpty(salary.FifthSignLabel) ? string.Empty : salary.FifthSignLabel;
                    salary.CreateDate = DateTime.Now;
                    salary.UpdateDate = DateTime.Now;

                    Int64 salaryId = HrAndPayrollBLL.Facade.hr_Salary.Post(salary);

                    if (salaryId > 0)
                    {
                        foreach (hr_SalaryDetail salaryDetail in salary.SalaryDetailList)
                        {
                            salaryDetail.SalaryId = salaryId;
                            salaryDetail.OtherAddition = salaryDetail.OtherAddition; //string.IsNullOrEmpty(salaryDetail.OtherAddition) ? string.Empty : salaryDetail.OtherAddition;
                            salaryDetail.OtherAdditionRemarks = string.IsNullOrEmpty(salaryDetail.OtherAdditionRemarks) ? string.Empty : salaryDetail.OtherAdditionRemarks;
                            salaryDetail.OtherDeduction = salaryDetail.OtherDeduction;// string.IsNullOrEmpty(salaryDetail.OtherDeduction) ? string.Empty : salaryDetail.OtherDeduction;
                            salaryDetail.OtherDeductionRemarks = string.IsNullOrEmpty(salaryDetail.OtherDeductionRemarks) ? string.Empty : salaryDetail.OtherDeductionRemarks;
                            salaryDetail.GeneralRemarks = string.IsNullOrEmpty(salaryDetail.GeneralRemarks) ? string.Empty : salaryDetail.GeneralRemarks;

                            HrAndPayrollBLL.Facade.hr_SalaryDetail.Post(salaryDetail);
                        }
                    }

                    ts.Complete();

                    return salaryId.ToString();
                }
                catch (Exception ex)
                {
                    return "Error: " + ex.Message;
                }
            }
        }

        [HttpPost]
        [Route("Leave/LeaveOpeningBalanceCreate")]
      
        public string LeaveOpeningBalanceCreate( List<hr_LeaveOpeningBalance> LeaveOpeningBalances)
        {
            using (TransactionScope ts = new TransactionScope())
            {
                try
                {

                    foreach (hr_LeaveOpeningBalance LeaveOpeningBalance in LeaveOpeningBalances)
                    {
                        LeaveOpeningBalance.LeaveSetupId = LeaveOpeningBalance.LeaveSetupId;
                        LeaveOpeningBalance.EmployeeId = LeaveOpeningBalance.EmployeeId; //string.IsNullOrEmpty(salaryDetail.OtherAddition) ? string.Empty : salaryDetail.OtherAddition;
                        LeaveOpeningBalance.OpeningDate = DateTime.Now;
                        LeaveOpeningBalance.OpeningBalance = LeaveOpeningBalance.OpeningBalance;// string.IsNullOrEmpty(salaryDetail.OtherDeduction) ? string.Empty : salaryDetail.OtherDeduction;

                        Int64 leaveId = HrAndPayrollBLL.Facade.hr_LeaveTypeSetup.LeaveOpeningBalanceCreate(LeaveOpeningBalance);
                       
                    }
                    //Int64 leaveId = HrAndPayrollBLL.Facade.hr_LeaveTypeSetup.LeaveOpeningBalanceCreate(LeaveOpeningBalance);


                    ts.Complete();
                   
                    return LeaveOpeningBalances.Count.ToString();
                }
                catch (Exception ex)
                {
                    return "Error: " + ex.Message;
                }
            }
        }
        [Route("Report/GetAttendanceTypeCount/{date}")]
        [HttpGet]
        public IEnumerable<hr_AttendanceTypeCount> GetAttendanceTypeCount(DateTime date)
        {
            List<hr_AttendanceTypeCount> countList = HrAndPayrollBLL.Facade.hr_Shift.GetAttendanceTypeCount(date);
            return countList;
        }

        [Route("Department/GetDepartmentByBranch/{branchId}")]
        [HttpGet]
        public IEnumerable<ad_Department> GetDepartmentByBranch(int branchId)
        {
            List<ad_Department> departmentList = Facade.Department.GetAllActiveByBranchId(branchId);
            return departmentList;
        }

        [Route("Department/GetDepartmentByBranchAndGrade/{branchId}/{gradeId}")]
        [HttpGet]
        public IEnumerable<ad_Department> GetDepartmentByBranchAndGrade(int branchId,int gradeId)
        {
            List<ad_Department> departmentList = Facade.Department.GetByBranchAndGrade(branchId,gradeId);
            return departmentList;
        }

        [Route("Section/GetSectionByDepartment/{departmentId}")]
        [HttpGet]
        public IEnumerable<ad_DepartmentWiseSection> GetSectionByDepartment(int departmentId)
        {
            List<ad_DepartmentWiseSection> sectionList = Facade.ad_DepartmentWiseSection.GetSectionByDepartmentId(departmentId);
            return sectionList;
        }

       // [Route("Section/GetAllBranch/{branchId}")]
       // [HttpGet]
       // ///{branchId
    
       //public IEnumerable<ad_Branch> GetAllBranch(int? branchId = null)
       // {
       //     List<ad_Branch> branchList = Facade.Branch.ad_BranchDAO.GetAll(branchId);
       //     return branchList;
       // }

        [Route("Section/GetAllBranch")]
        [HttpGet]
        ////Route("Section/GetAllBranch/{where}/{orderBy}/")

        public IEnumerable<ad_Branch> GetAllBranch(string where = "1=1 and isActive=1", string orderBy = "BranchId")
        {

            List<ad_Branch> branchList = Facade.Branch.ad_BranchDAO.GetDynamic(where, orderBy);
            return branchList;
        }

        //[Route("Grade/SaveGrade")]
        //[HttpPost]
        //public int SaveGrade([FromBody] hr_Grade grade, hr_LeaveTypeSetup leaveType, hr_BonusTypeSetup bonusType)
        //{
        //    grade.UpdatorId = 1;
        //    grade.UpdateDate = DateTime.Now;
        //    int i = HrAndPayrollBLL.Facade.hr_Grade.Add(grade);

        //    grade.GradeId = grade.GradeId == 0 ? i : grade.GradeId;

        //    if (i > 0)
        //    {
        //        leaveType.GradeId = grade.GradeId;
        //        leaveType.IsByYearly = false;
        //        HrAndPayrollBLL.Facade.hr_LeaveTypeSetup.Add(leaveType);

        //        bonusType.GradeId = grade.GradeId;

        //    }
        //    return i;
        //}
    }
}
