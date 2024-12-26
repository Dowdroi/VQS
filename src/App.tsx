import { useEffect } from "react";
import { DesktopOnlyNotice } from "@/pages/DeskTopOnlyNotice";
import Router from "./router";
import "@/configs/config";
import { AuthProvider } from "./providers/AuthContext";
import { StateProvider } from "./providers/StateContext";
import { Toaster } from "sonner";
import { OrganizationController } from "./controllers/Organization.controller";
import { UserController } from "./controllers/User.controller";

const userController = new UserController();
const organizationController = new OrganizationController();

function App() {
  useEffect(() => {
    const init = async () => {
      await userController.getUser();
      await userController.getToken();
      await organizationController.getList();
    };
    init();
  }, []);

  return (
    <AuthProvider>
      <DesktopOnlyNotice>
        <StateProvider>
          <Router />
        </StateProvider>
      </DesktopOnlyNotice>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
