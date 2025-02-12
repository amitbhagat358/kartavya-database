import InputComponent from "@/components/InputComponent";
import SelectComponent from "@/components/SelectComponent";
import { Checkbox } from "@/components/ui/checkbox";
import React, { useEffect, useState } from "react";
// import StudentProgressGraph from "./StudentProgressGraph";
// import AttendanceMonitoringGraph from "./AttendenceMonitoringGraph";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@radix-ui/react-icons";
import DialogForResultEdit from "./DialogForResultEdit";
import DialogForPdfPreview from "./DialogForPdfPreview";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { AlertForDialogDeletion } from "@/components/AlertForStudentDeletion";
import DialogForProfilePhotoUpdate from "./DialogForProfilePhotoUpdate";

// const studentDataFromBackend = {
//   id: "1",
//   name: "Mahi Kumari",
//   gender: "Female",
//   session: "2024-25",
//   dob: "2014-06-06",
//   class: "4",
//   center: "C2",
//   school: "Lucious Public School",
//   fatherName: "FatherName",
//   fatherOccupation: "FatherOccupation",
//   motherName: "MotherName",
//   motherOccupation: "MotherOccupation",
//   address: "Dhanbad",
//   familyIncome: 120000,
//   contactNumber: "1234567890",
//   aadhar: true,
//   domicile: true,
//   birthCertificate: true,
//   disability: false,
//   singleParent: true,
//   releventCertificate: true,
//   isSponsored: true,
//   annualFees: 10000,
//   payTotalFees: true,
//   feesWePay: 0,
//   sponserId: 1,
//   sponserName: "XYZ",
//   amountBySponsor: 10000,
//   results: {
//     "2022-23": {
//       midTerm: "60",
//       endTerm: "80",
//     },
//     "2023-24": {
//       midTerm: "70",
//       endTerm: "92",
//     },
//     "2024-25": {
//       midTerm: "85",
//       endTerm: "90",
//     },
//   },
//   attendence: {
//     Jan: { totalDays: 22, presentDays: 18 },
//     Feb: { totalDays: 20, presentDays: 16 },
//     Mar: { totalDays: 20, presentDays: 16 },
//     Apr: { totalDays: 20, presentDays: 16 },
//     May: { totalDays: 20, presentDays: 16 },
//     Jun: { totalDays: 20, presentDays: 16 },
//     Jul: { totalDays: 20, presentDays: 16 },
//     Aug: { totalDays: 20, presentDays: 16 },
//     Sept: { totalDays: 20, presentDays: 16 },
//     Oct: { totalDays: 20, presentDays: 16 },
//     Nov: { totalDays: 20, presentDays: 16 },
//     Dec: { totalDays: 20, presentDays: 16 },
//   },
// };

const StudentProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [studentData, setStudentData] = useState(null);
  const [studentDataChanged, setStudentDataChanged] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3500/api/students/${encodeURIComponent(id)}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Failed to fetch student data");
        const data = await response.json();

        setStudentData(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Error fetching student");
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudentData();
  }, [id]);

  // useEffect(() => {
  //   console.log(studentData, "studentData");
  // }, [studentData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStudentData({
      ...studentData,
      [name]: type === "checkbox" ? checked : value,
    });
    setStudentDataChanged(true);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      for (const key in studentData) {
        formDataToSend.append(key, studentData[key]);
      }

      const res = await fetch(
        `http://localhost:3500/api/students/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studentData),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update student data");
      }

      const message = await res.json();
      console.log(message, "message");

      toast.success(message.message);
      setStudentDataChanged(false);
    } catch (e) {
      toast.error(`Error updating student data: ${e.message}`);
      return;
    }
  };

  const handleDeleteStudent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:3500/api/students/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete student");
      }

      navigate("/student-spreadsheet");
      toast.success("Student deleted successfully!");
    } catch (e) {
      toast.error(`Error deleting student data: ${e.message}`);
      return;
    }
  };

  {
    loading && (
      <div className="flex justify-center items-center text-4xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex select-none">
      <div className="sticky top-0 flex flex-col gap-10 sidebar w-[21%] h-screen pl-[10px] pr-[10px] border-r border-r-[#DDE4EB]">
        <div className="logo w-full">
          <img src="/logos.png" alt="logos" className="object-contain" />
        </div>

        <div className="basic-details">
          <div className="filters flex flex-col items-center p-[10px]">
            <div className="profile-photo h-[270px] w-[220px] bg-cover rounded-lg border overflow-hidden">
              <img
                src={studentData?.profilePhoto || "/student.jpg"}
                alt="profile-photo"
                className="w-full h-full object-cover"
              />
            </div>
            <DialogForProfilePhotoUpdate
              photoExists={studentData?.profilePhoto}
            />
          </div>

          <div className="basic-details p-4">
            <div className="label text-xl font-bold text-[#21526E] mb-4">
              Basic Details
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="font-semibold text-gray-700">Name:</div>
              <div className="col-span-2">{studentData?.studentName}</div>

              <div className="font-semibold text-gray-700">Roll No.:</div>
              <div className="col-span-2">{studentData?.rollNumber}</div>

              <div className="font-semibold text-gray-700">Class:</div>
              <div className="col-span-2">{studentData?.class}</div>

              <div className="font-semibold text-gray-700">Center:</div>
              <div className="col-span-2">{studentData?.centre}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero flex flex-col w-[80%]  bg-fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(222,80,85,0.4),transparent),radial-gradient(ellipse_at_top_left,rgba(205,214,219,0.8),rgba(255,255,255,0.8),rgba(255,255,255,0)),radial-gradient(ellipse_at_top_right,rgba(205,214,219,0.8),rgba(255,255,255,0.8),rgba(255,255,255,0)),radial-gradient(ellipse_at_bottom_left,rgba(205,214,219,0.8),rgba(255,255,255,0.8),rgba(255,255,255,0)),radial-gradient(ellipse_at_bottom_right,rgba(205,214,219,0.8),rgba(255,255,255,0.8),rgba(255,255,255,0))]">
        <div className="heading text-3xl font-semibold text-center pt-5 pb-5 border-b w-full">
          Student Profile
        </div>

        {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}

        {/* General Details */}

        <div className="general-details w-[90%] m-auto mt-10">
          <div className="w-full flex justify-between text-2xl h-10 font-semibold text-[#21526E]">
            General Details
            {studentDataChanged && (
              <Button
                onClick={handleSaveChanges}
                variant="outline"
                className="bg-[#21526E] text-white"
              >
                <CheckIcon /> <span className="ml-2"> Save Changes</span>
              </Button>
            )}
          </div>
          <div className="input-section flex flex-col items-end w-full pt-8 gap-[1.2rem]">
            {/* Row 1 */}
            <div className="flex flex-col gap-5 xl:gap-0 xl:flex-row flex-wrap w-full">
              <div className="w-full xl:w-1/2">
                <InputComponent
                  title={"Name of Student"}
                  name={"studentName"}
                  type={"text"}
                  value={studentData?.studentName}
                  placeholder={"Name"}
                  handleInputChange={handleInputChange}
                />
              </div>
              <div className="w-full xl:w-1/2">
                <SelectComponent
                  title={"Gender"}
                  name={"gender"}
                  options={[
                    { value: "Male" },
                    { value: "Female" },
                    { value: "Other" },
                  ]}
                  handleInputChange={handleInputChange}
                  value={studentData?.gender}
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col gap-5 xl:gap-0 xl:flex-row flex-wrap w-full">
              <div className="w-full xl:w-1/2">
                <InputComponent
                  title={"Date of birth of Student"}
                  name={"dob"}
                  type={"date"}
                  placeholder={"Date of birth"}
                  handleInputChange={handleInputChange}
                  value={studentData?.dob}
                />
              </div>
              <div className="w-full xl:w-1/2">
                <InputComponent
                  title={"Address of Student"}
                  name={"address"}
                  type={"text"}
                  placeholder={"Address"}
                  handleInputChange={handleInputChange}
                  value={studentData?.address}
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex flex-col gap-5 xl:gap-0 xl:flex-row flex-wrap w-full">
              <div className="w-full xl:w-1/2">
                <InputComponent
                  title={"Current Session"}
                  name={"currentSession"}
                  type={"text"}
                  placeholder={"Session"}
                  handleInputChange={handleInputChange}
                  value={studentData?.currentSession}
                />
              </div>
              <div className="w-full xl:w-1/2">
                <InputComponent
                  title={"Class of Student"}
                  name={"class"}
                  type={"text"}
                  placeholder={"Class"}
                  handleInputChange={handleInputChange}
                  value={studentData?.class}
                />
              </div>
            </div>

            {/* Row 4 */}

            <div className="flex flex-col gap-5 xl:gap-0 xl:flex-row flex-wrap w-full">
              <div className="w-full xl:w-1/2">
                <SelectComponent
                  title={"Center of Student"}
                  name={"centre"}
                  options={[
                    { value: "C1" },
                    { value: "C2" },
                    { value: "C3" },
                    { value: "C5" },
                    { value: "Anganwadi" },
                  ]}
                  handleInputChange={handleInputChange}
                  value={studentData?.centre}
                />
              </div>
              <div className="w-full xl:w-1/2">
                <SelectComponent
                  title={"School of Student"}
                  name={"school"}
                  options={[
                    { value: "Education Academy" },
                    { value: "Vidiya Public School" },
                    { value: "Vidya Bharti" },
                    { value: "Lucious Public School" },
                    { value: "Tagore Academy" },
                    { value: "Saraswati Vidya Niketan" },
                    { value: "Dhanbad Vikas Vidyalaya" },
                    { value: "NIOS" },
                    { value: "ISL Jhariya" },
                    { value: "Dhanbad Public School" },
                    { value: "Physics Wallah" },
                    { value: "Akash" },
                    { value: "Ram Krishna Public School" },
                  ]}
                  handleInputChange={handleInputChange}
                  value={studentData?.school}
                />
              </div>
            </div>

            {/* Row 5 */}

            <div className="flex flex-col gap-5 xl:gap-0 xl:flex-row flex-wrap w-full">
              <div className="w-full xl:w-1/2">
                <InputComponent
                  title={"Father's Name"}
                  name={"fathersName"}
                  type={"text"}
                  placeholder={"Father's Name"}
                  handleInputChange={handleInputChange}
                  value={studentData?.fathersName}
                />
              </div>
              <div className="w-full xl:w-1/2">
                <InputComponent
                  title={"Fathers's Occupation"}
                  name={"fathersOccupation"}
                  type={"text"}
                  placeholder={"Father's Occupation"}
                  handleInputChange={handleInputChange}
                  value={studentData?.fathersOccupation}
                />
              </div>
            </div>

            {/* Row 6 */}
            <div className="flex flex-col gap-5 xl:gap-0 xl:flex-row flex-wrap w-full">
              <div className="w-full xl:w-1/2">
                <InputComponent
                  title={"Mother's Name"}
                  name={"mothersName"}
                  type={"text"}
                  placeholder={"Mother's Name"}
                  handleInputChange={handleInputChange}
                  value={studentData?.mothersName}
                />
              </div>
              <div className="w-full xl:w-1/2">
                <InputComponent
                  title={"Mothers's Occupation"}
                  name={"mothersOccupation"}
                  type={"text"}
                  placeholder={"Mother's Occupation"}
                  handleInputChange={handleInputChange}
                  value={studentData?.mothersOccupation}
                />
              </div>
            </div>

            {/* Row 7 */}
            <div className="flex flex-col gap-5 xl:gap-0 xl:flex-row flex-wrap w-full">
              <div className="w-full xl:w-1/2">
                <InputComponent
                  title={"Annual Family Income"}
                  name={"annualIncome"}
                  type={"number"}
                  placeholder={"Family Income"}
                  handleInputChange={handleInputChange}
                  value={studentData?.annualIncome}
                />
              </div>
              <div className="w-full xl:w-1/2">
                <InputComponent
                  title={"Contact Number"}
                  name={"contactNumber"}
                  type={"text"}
                  placeholder={"Contact Number"}
                  handleInputChange={handleInputChange}
                  value={studentData?.contactNumber}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}

        <div className="flex w-[90%] m-auto mt-20">
          {/* Document Details */}
          <div className="document-details flex flex-col w-full gap-[1.55rem]">
            <div className="w-full text-2xl font-semibold text-[#21526E] mb-5">
              Document Details
            </div>
            {/* Aadhar Details */}
            <div className="flex items-center space-x-2 pl-[2.5%] pr-[2.5%] ">
              <Checkbox
                id="aadhar"
                checked={studentData?.aadhar}
                onCheckedChange={(checked) =>
                  handleInputChange({
                    target: {
                      name: "aadhar",
                      type: "checkbox",
                      checked: checked,
                    },
                  })
                }
              />
              <label
                htmlFor="aadhar"
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Aadhar Card
              </label>
            </div>

            {/* Domicile Details */}
            <div className="flex items-center space-x-2 pl-[2.5%] pr-[2.5%]">
              <Checkbox
                id="domicile"
                checked={studentData?.domicile}
                onCheckedChange={(checked) =>
                  handleInputChange({
                    target: {
                      name: "domicile",
                      type: "checkbox",
                      checked: checked,
                    },
                  })
                }
              />
              <label
                htmlFor="domicile"
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Domicile Certificate
              </label>
            </div>

            {/* Birth Certificate Details */}
            <div className="flex items-center space-x-2 pl-[2.5%] pr-[2.5%]">
              <Checkbox
                id="birthCertificate"
                checked={studentData?.birthCertificate}
                onCheckedChange={(checked) =>
                  handleInputChange({
                    target: {
                      name: "birthCertificate",
                      type: "checkbox",
                      checked: checked,
                    },
                  })
                }
              />
              <label
                htmlFor="birthCertificate"
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Birth Certificate
              </label>
            </div>

            {/* Disability  Details */}
            <div className="flex items-center space-x-2 pl-[2.5%] pr-[2.5%]">
              <Checkbox
                id="disability"
                checked={studentData?.disability}
                onCheckedChange={(checked) =>
                  handleInputChange({
                    target: {
                      name: "disability",
                      type: "checkbox",
                      checked: checked,
                    },
                  })
                }
              />
              <label
                htmlFor="disability"
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Disability Certificate
              </label>
            </div>

            {/* Single Parent  Details */}
            <div className="flex items-center space-x-2 pl-[2.5%] pr-[2.5%]">
              <Checkbox
                id="singleParent"
                checked={studentData?.singleParent}
                onCheckedChange={(checked) =>
                  handleInputChange({
                    target: {
                      name: "singleParent",
                      type: "checkbox",
                      checked: checked,
                    },
                  })
                }
              />
              <label
                htmlFor="singleParent"
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Single Parent Certificate
              </label>
            </div>

            {/* Relevant Ceritificate  Details */}
            <div className="flex items-center space-x-2 pl-[2.5%] pr-[2.5%]">
              <Checkbox
                id="releventCertificate"
                checked={studentData?.releventCertificate}
                onCheckedChange={(checked) =>
                  handleInputChange({
                    target: {
                      name: "releventCertificate",
                      type: "checkbox",
                      checked: checked,
                    },
                  })
                }
              />
              <label
                htmlFor="releventCertificate"
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Relevent Certificate for single parent
              </label>
            </div>
          </div>

          {/* ----------------------------------------------------------------------------------------------------------------------------------------- */}

          {/* Sponsorship Details */}
          <div className="sponsorhip-details flex flex-col w-full gap-2">
            <div className="w-full text-2xl font-semibold text-[#21526E] mb-5">
              Sponsorship Details
            </div>

            <div className="flex items-center w-full h-9 pl-[2.5%] pr-[2.5%] ">
              <label
                htmlFor="isSponsored"
                className="w-[60%] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Do we sponsor this student?
              </label>
              <Checkbox
                id="isSponsored"
                checked={studentData?.isSponsored}
                onCheckedChange={(checked) =>
                  handleInputChange({
                    target: {
                      name: "isSponsored",
                      type: "checkbox",
                      checked: checked,
                    },
                  })
                }
              />
              <span className="font-semibold ml-5">
                {studentData?.isSponsored ? "Yes" : "No"}
              </span>
            </div>

            <div className="annual-school-fees flex items-center w-full h-9 pl-[2.5%] pr-[2.5%]">
              <label className="w-[60%] font-semibold">
                Annual School Fees of student
              </label>
              <div className="w-[200px]">
                <input
                  type="number"
                  name="annualFees"
                  placeholder="Annual Fees"
                  className="p-2 text-sm font-semibold outline-none rounded-lg"
                  value={studentData?.annualFees}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex items-center w-full h-9 pl-[2.5%] pr-[2.5%]">
              <label
                htmlFor="payTotalFees"
                className="w-[60%] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Do we pay total school fees
              </label>
              <Checkbox
                id="payTotalFees"
                checked={studentData?.payTotalFees}
                onCheckedChange={(checked) =>
                  handleInputChange({
                    target: {
                      name: "payTotalFees",
                      type: "checkbox",
                      checked: checked,
                    },
                  })
                }
              />
              <span className="font-semibold ml-5">
                {studentData?.payTotalFees ? "Yes" : "No"}
              </span>
            </div>

            <div className="flex items-center w-full h-9 pl-[2.5%] pr-[2.5%]">
              <label
                htmlFor="feesWePay"
                className="w-[60%] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Total Fees we pay
              </label>
              <div className="w-[200px]">
                <input
                  type="number"
                  name="feesWePay"
                  placeholder={
                    studentData?.payTotalFees === false
                      ? "Enter the amount"
                      : ""
                  }
                  className="p-2 text-sm font-semibold outline-none rounded-lg"
                  value={
                    studentData?.payTotalFees === true
                      ? studentData?.annualFees
                      : studentData?.feesWePay
                  }
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex items-center w-full h-9 pl-[2.5%] pr-[2.5%]">
              <label
                htmlFor="sponserName"
                className="w-[60%] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Name of Sponsor
              </label>
              <div className="w-[200px]">
                <input
                  type="text"
                  name="sponserName"
                  className="p-2 text-sm font-semibold rounded-lg"
                  placeholder="Enter sponser name"
                  value={studentData?.sponserName}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex items-center w-full h-9 pl-[2.5%] pr-[2.5%]">
              <label
                htmlFor="amountBySponsor"
                className="w-[60%] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Total Amount by Sponsor
              </label>
              <div className="w-[200px]">
                <input
                  type="number"
                  name="amountBySponsor"
                  className="p-2 text-sm font-semibold rounded-lg outline-none"
                  placeholder="Enter total amount"
                  value={studentData?.amountBySponsor}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------------------------------------------------------------------------------------- */}
        </div>

        {/* Result Details */}

        <div className="result-details w-[90%] m-auto mt-20">
          <div className="w-full flex justify-between text-2xl font-semibold text-[#21526E] mb-5">
            Result Details
            <DialogForResultEdit resultExists={studentData?.result} />
          </div>

          {studentData?.result && (
            <div className="filters flex flex-col gap-10 p-[25px]">
              <div className="profile-photo h-full rounded-lg border">
                <img src={studentData?.result} alt="result"></img>
              </div>
            </div>
          )}

          {/* Result Graph */}

          {/* <div className="result-graph w-full h-[400px]">
              <StudentProgressGraph results={studentData?.results} />
            </div> */}
        </div>

        {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}

        {/* Attendence details */}
        {/* <div className="attendence-details w-[90%] m-auto mt-20">
            <div className="w-full flex justify-between text-2xl font-semibold text-[#21526E] mb-5">
              Attendence Details
              <DialogForAttendenceEdit
                studentData={studentData}
                setStudentData={setStudentData}
              />
            </div> */}

        {/* Attendence Graph */}
        {/* <div className="result-graph w-full h-[400px] mb-10">
              <AttendanceMonitoringGraph
                attendanceData={studentData?.attendence}
              />
            </div>
          </div> */}

        {/* Download Profile option */}
        <div className="download-profile w-[90%] m-auto mt-32">
          <div className="w-full flex justify-center gap-5 text-2xl font-semibold text-[#21526E] mb-5">
            <DialogForPdfPreview studentData={studentData} />
            {studentDataChanged && (
              <Button
                onClick={handleSaveChanges}
                variant="outline"
                className="bg-[#21526E] text-white"
              >
                <CheckIcon /> <span className="ml-2"> Save Changes</span>
              </Button>
            )}
            <div>
              <AlertForDialogDeletion handleClick={handleDeleteStudent} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
