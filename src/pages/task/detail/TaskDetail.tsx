import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import VEVODetail from "./VEVODetail";
// import { LoadingState } from '@/components/ui/LoadingState';
// import API from '@/api/API';
import { toast } from "sonner";
import WWCDetail from "./WWCDetail";
import { TaskController } from "@/controllers/Task.controller";
import { VTaskDetail } from "@/models/TaskDetail.model";
import { LoadingState } from "@/components/ui/LoadingState";
import QualCheckDetail from "./QualCheckDetail";
import { mockTaskDetail } from "@/mocks/mockTaskData";

const TaskDetail = () => {
  const { taskId, taskType } = useParams();
  const [data, setData] = useState<VTaskDetail | null>(mockTaskDetail); // Initialize with mock data
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    console.log("taskId", taskId);
    setIsLoading(true);
    const fetchTaskDetail = async () => {
      try {
        const controller = new TaskController();
        const rs = await controller.getTaskDetail(taskId || "");
        setData(rs.data);
      } catch (error) {
        toast.error("Failed to fetch task details. Using mock data.");
        setData(mockTaskDetail);
      } finally {
        setIsLoading(false);
      }
    };

    if (taskId) {
      fetchTaskDetail();
    }
  }, [taskId]);

  useEffect(() => {
    console.log("location.state", location.state);
    const _data = location.state;
    if (_data) {
      setData(_data);
    }
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  if (taskType === "vevo") {
    return <VEVODetail taskId={taskId} data={data || undefined} />;
  } else if (taskType === "wwc") {
    return <WWCDetail taskId={taskId} data={data || undefined} />;
  } else if (taskType === "qual_check") {
    return <QualCheckDetail taskId={taskId} data={data || undefined} />;
  }

  return (
    <div className="text-center text-sm text-gray-500">
      This type of detail is not supported at this time
    </div>
  );
};

export default TaskDetail;
