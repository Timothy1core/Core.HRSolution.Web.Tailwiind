import React, { useEffect, useState } from "react";
import { ToolbarWrapper } from "../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../_metronic/layout/components/content";
import "./FunnelChart.css";
import { listPipeline } from "../core/requests/_request";
import {
  disableLoadingRequest,
  enableLoadingRequest,
} from "../../../../helpers/loading_request";

const PipelinePage = () => {
  const [pipelineData, setPipelineData] = useState([]);

  const fetchPipeline = async () => {
    enableLoadingRequest();
    try {
      const response = await listPipeline();
      if (response.data) {
        const formattedData = formatPipelineData(response.data);
        setPipelineData(formattedData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      disableLoadingRequest();
    }
  };

  useEffect(() => {
    fetchPipeline();
  }, []);

  const formatPipelineData = (data) => {
    const orderedStages = [
      "Applied & Sourced",
      "Initial Interview",
      "Assessment",
      "Final Interview",
      "Job Offered",
      "Hired",
    ];

    const stageDetails = {
      "Applied & Sourced": {
        leftNote: "Workable, Jobstreet, Indeed, Kalibr, System Applications & Active Sourced from LinkedIn",
        rateLabel: " ",
        rightNote: null,
      },
      "Initial Interview": {
        leftNote: "Total Processed",
        rateLabel: "Processing rate:",
        rightNote: null,
      },
      "Assessment": {
        leftNote: "Total Processed",
        rateLabel: "Passing rate:",
        rightNote: "Candidates successfully given the assessments",
      },
      "Final Interview": {
        leftNote: "Total Processed",
        rateLabel: "Endorsement rate:",
        rightNote: "Candidates successfully endorsed for final interview",
      },
      "Job Offered": {
        leftNote: "Total Processed",
        rateLabel: "Passing rate:",
        rightNote: "Candidates successfully given the assessments",
      },
      "Hired": {
        leftNote: null,
        rateLabel: "Success rate:",
        rightNote: null,
      },
    };

    let stageCounts = {
      "Applied & Sourced": 0,
      "Initial Interview": 0,
      "Assessment": 0,
      "Final Interview": 0,
      "Job Offered": 0,
      "Hired": 0,
    };

    // Process API data and store counts
    data.data.forEach((item) => {
      if (orderedStages.includes(item.processName)) {
        stageCounts[item.processName] = item.processCount;
      }
    });

    // Calculate rates dynamically
    let formatted = orderedStages.map((stage, index) => {
      let count = stageCounts[stage] || 0;
      let rate = " ";

      if (index > 0) {
        let prevStage = orderedStages[index - 1];
        let prevCount = stageCounts[prevStage];

        if (prevCount > 0) {
          rate = `${((count / prevCount) * 100).toFixed(2)}%`;
        }
      }

      return {
        stage: stage,
        count: count,
        rate: stageDetails[stage].rateLabel ? `${stageDetails[stage].rateLabel} ${rate}` : "",
        leftNote: stageDetails[stage].leftNote,
        RightNote: stageDetails[stage].rightNote,
      };
    });

    return formatted;
  };

  return (
    <>
      <ToolbarWrapper title="Pipeline Dashboard" subtitle="Recruitment" />
      <Content>
        <div className="card p-7 container mt-5">
          <h1 className="mb-4 text-center fw-bolder">Overall Sourcing Effort</h1>
          <div className="funnel-container">
            {pipelineData.map((item, index) => (
              <div key={index} className={`d-flex w-100 justify-content-center align-items-center`}>
                <span className="d-flex justify-content-end stage align-items-center">
                  <div>
                    <div>{item.stage}</div>
                    <div className="fs-9">{item.leftNote}</div>
                  </div>
                  <span className="arrow mx-5">→</span>
                </span>
                <div className={`count funnel-step rounded-pill step-${index}`}>
                  {item.count}
                </div>
                {item.rate && (
                  <span className="d-flex justify-content-start rate align-items-center">
                    {item.rate !== " " && index !== 0 && <span className="arrow mx-5">←</span>}
                    <div>
                      <div>{item.rate}</div>
                      <div className="fs-9">{item.RightNote}</div>
                    </div>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </Content>
    </>
  );
};

const PipelineWrapper = () => {
  return (
    <>
      <PipelinePage />
    </>
  );
};

export { PipelineWrapper };
