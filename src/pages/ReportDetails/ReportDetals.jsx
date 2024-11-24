import React, { useEffect, useState } from "react";
import { getReport } from "../../api/reports";
import { useParams } from "react-router-dom";
import Microsoft from "../../components/Microsoft/Microsoft";

const ReportDetails = () => {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await getReport(reportId);
        setReport(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDetails();
  }, [reportId]);

  return (
    <div className="main container-fluid w-100 py-5 px-2 px-lg-5 position-relative">
      <div className="data-core w-100 py-3 px-4 d-flex flex-column align-items-center">
        <Microsoft width={"100"} height={"100"} />
        <h3 className="mt-3 mb-4">Check Reports</h3>
        {report ? (
          <div className="container w-100">
            {report.user ? (
              <div className="w-100 d-flex flex-column mb-3 p-3" style={{border: '1px solid black', borderRadius: '15px'}} >
                <label htmlFor="name" className="mb-2 fs-4 fw-semibold">
                  Sender:
                </label>
                <p className=" mb-0">{report.user.first_name} {report.user.last_name}</p>
                <p className="">{report.user.email}</p>
              </div>
            ) : (
              <p className=" mb-0">User information is not available.</p>
            )}
            <div className="w-100 d-flex flex-column mb-3 p-3" style={{border: '1px solid black', borderRadius: '15px'}}>
              <label htmlFor="sku" className="mb-2 fs-4 fw-semibold">
                Object:
              </label>
              <p className="">{report.object}</p>
            </div>
            <div className="w-100 d-flex flex-column mb-3 p-3" style={{border: '1px solid black', borderRadius: '15px'}}>
              <label htmlFor="price" className="mb-2 fs-4 fw-semibold">
                Content:
              </label>
              <p className="">{report.content}</p>
            </div>
          </div>
        ) : (
          <p>Loading report details...</p>
        )}
      </div>
    </div>
  );
};

export default ReportDetails;
