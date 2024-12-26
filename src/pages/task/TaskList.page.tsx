import { useNavigate, useLocation } from "react-router-dom";
import logotaks from "@assets/logotask.svg";
import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/Table";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { MoreVertical } from "lucide-react";
import VTask from "@/models/Task.model";
import { TaskController } from "@/controllers/Task.controller";
import TaskMetadata from "@/models/Metadata.model";
import { CustomPagination } from "@/components/common/Paginate";
import { TEMPLATE_TYPES_MAP } from "@/utils/Contants";
import { MAgent } from "@/models/Agent.model";
// import { AgentSelectionDialog } from "@/components/dialogs/AgentSelectionDialog";
import { mockTaskList } from "@/mocks/mockTaskData";

const TaskListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sorting, setSorting] = useState<SortingState>([]);

  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<TaskMetadata>({
    page: 1,
    page_size: 10,
    total_pages: 1,
    total_items: 0,
    has_previous: false,
    has_next: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<VTask | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const handleAssignTask = async (task: VTask) => {
    setSelectedTask(task);
    setSelectedAgent(task.employee_details || null);
    setIsAssignDialogOpen(true);
  };

  const columns: ColumnDef<VTask>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Task ID
          <ChevronUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div
          className="flex items-center gap-2 cursor-pointer text-primary hover:text-primary/80 underline underline-offset-4"
          onClick={() => {
            // navigator.clipboard.writeText(row.original.task_id);
            // toast.success("Task ID copied to clipboard");
            handleViewDetail(row.original);
          }}
        >
          #{row.original.id.slice(-4).toUpperCase()}
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Task Title
          <ChevronUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 max-w-[300px]">
          <img
            src={row.original.icon ? row.original.icon : logotaks}
            alt={row.original.title}
            className="w-8 h-8 rounded object-cover flex-shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-bold truncate">{row.original.title}</span>
            <span className="text-sm text-gray-500 line-clamp-2">
              {row.original.description}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "template_type",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Type
          <ChevronUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 max-w-[100px] font-bold">
          {TEMPLATE_TYPES_MAP[
            row.original.template_type as keyof typeof TEMPLATE_TYPES_MAP
          ] || "Unknown"}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Status
          <ChevronUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span
            className={cn(
              "px-2 py-1 rounded-md text-sm font-medium whitespace-nowrap",
              {
                "bg-slate-100 text-slate-700": status === "todo",
                "bg-yellow-100 text-yellow-700": status === "in_review",
                "bg-green-100 text-green-700": status === "approved",
                "bg-red-100 text-red-700": status === "rejected",
              }
            )}
          >
            {status ? status.replace("_", " ").toUpperCase() : "No Status"}
          </span>
        );
      },
      size: 10,
    },
    {
      accessorKey: "employee_details",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Employee
          <ChevronUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const employee = row.original?.employee_details;
        return employee ? (
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full border border-blue-200 shadow-sm capitalize truncate">
                {employee?.first_name?.toLowerCase()}{" "}
                {employee?.last_name?.toLowerCase()}
              </span>
            </div>
          </div>
        ) : (
          <span className="px-2 py-1 text-sm text-gray-500 bg-gray-50 rounded-md italic">
            Unassigned
          </span>
        );
      },
    },
    {
      accessorKey: "assignee_details",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Assigned To
          <ChevronUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const agent = row.original?.assignee_details;
        return agent && agent?.first_name ? (
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-purple-50 to-indigo-100 text-indigo-700 rounded-full border border-indigo-200 shadow-sm capitalize truncate">
                {agent?.first_name?.toLowerCase()}{" "}
                {agent?.last_name?.toLowerCase()}
              </span>
            </div>
          </div>
        ) : (
          <span className="px-2 py-1 text-sm text-gray-500 bg-gray-50 rounded-md italic">
            Unassigned
          </span>
        );
      },
    },
    {
      id: "action",
      header: () => <></>,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleAssignTask(row.original)}>
              <UserPlusIcon className="mr-2 h-4 w-4" />
              Assign Task
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleViewDetail(row.original)}>
              <PencilIcon className="mr-2 h-4 w-4" />
              Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      size: 10,
    },
  ];

  const handleViewDetail = (task: VTask) => {
    if (task.status === "approved" || task.status === "rejected") {
      toast.error("This task is locked and cannot be viewed.");
      return;
    }

    if (task.template_type === "id_vevo") {
      navigate(`/task/vevo/${task.id}`, { state: { task } });
    } else if (task.template_type === "id_wwc") {
      navigate(`/task/wwc/${task.id}`, { state: { task } });
    } else if (task.template_type === "qual_check") {
      navigate(`/task/qual_check/${task.id}`, { state: { task } });
    } else {
      navigate(`/task/${task.template_type}/${task.id}`, { state: { task } });
    }
  };

  const fetchTasks = async ({ page = pagination.page }: { page?: number }) => {
    setIsLoading(true);
    try {
      const taskController = new TaskController();
      const res = await taskController.getTasks({
        page: page,
        pageSize: pagination.page_size,
        sortBy: sorting[0]?.id || "created_at",
        sortDirection: sorting[0]?.desc ? "desc" : "desc",
      });
      if (res.isSuccessful()) {
        const taskData: VTask[] = res.data.map((task: any) => new VTask(task));
        setTasks(taskData);

        setPagination({
          page: res.meta.page,
          page_size: res.meta.page_size,
          total_pages: res.meta.total_pages,
          total_items: res.meta.total_items,
          has_previous: res.meta.has_previous,
          has_next: res.meta.has_next,
        });
      }
    } catch (error) {
      toast.error("Failed to fetch tasks.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks({ page: pagination.page });
  }, []);

  const handlePaginationChange = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      page: page,
    }));
    fetchTasks({ page });
  };

  const [tasks, setTasks] = useState<VTask[]>(mockTaskList);

  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      globalFilter: globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  });

  useEffect(() => {
    const updatedTask = location.state?.updatedTask;
    if (updatedTask) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === updatedTask.id ? { ...task, ...updatedTask } : task
        )
      );
    }
  }, [location.state]);

  const handleAgentSelect = async (agent: MAgent) => {
    if (!selectedTask || isAssigning) return;

    setIsAssigning(true);
    try {
      const taskController = new TaskController();
      const response = await taskController.assignTask(
        selectedTask.id,
        agent.id || ""
      );

      if (response.isSuccessful()) {
        toast.success("Task assigned successfully");
        setIsAssignDialogOpen(false);
        fetchTasks({ page: pagination.page });
      }
    } catch (error) {
      toast.error("Failed to assign task", {
        // description: error || 'An error occurred while assigning the task',
        style: {
          backgroundColor: "#f87171",
          color: "#fff",
          borderRadius: "8px",
          padding: "12px",
          fontSize: "14px",
        },
      });
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl text-gray-900">Task List</h1>
        <div className="relative w-72">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search tasks..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-md border border-gray-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-sm font-medium text-gray-900 text-left p-0"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="w-full flex items-center">
        <CustomPagination
          currentPage={pagination.page}
          totalPages={pagination.total_pages}
          onPageChange={handlePaginationChange}
          className="mx-4 my-2"
        />
      </div>

      {/* <AgentSelectionDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        onSelect={handleAgentSelect}
        selectedAgentId={selectedAgent?.id}
      /> */}

      {isAssignDialogOpen ? (
        <div className="p-4 bg-gray-100 text-gray-700 text-center rounded-md">
          The function will be used later.
        </div>
      ) : null}
    </div>
  );
};

export default TaskListPage;
