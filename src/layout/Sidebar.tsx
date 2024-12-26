import { ChevronUp, LogOutIcon, User2 } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/Sidebar";
import logoImage from "@assets/images/logo.png";
import logoIcon from "@assets/images/logo.png";
import { cn } from "@/lib/utils";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";
import { getNavItems } from "../router/RouteUtils";
import { routes } from "../router/Routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import Text from "@/components/ui/Text";
import { useEffect, useState } from "react";
import * as auth from "aws-amplify/auth";
import { useAppNavigation } from "@/hooks/UseAppNavigate";
import { useStore } from "@/stores/Stores";
import { MUser } from "@/models/User.model";

export function AppSidebar() {
  const { open } = useSidebar();
  const navItems = getNavItems(routes);
  const [userInfo, setUserInfo] = useState<any>(null);
  const { navigateTo } = useAppNavigation();
  const { userStore } = useStore();

  const path = window.location.pathname;
  const isActive = (href: string) => path === href;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (typeof auth.fetchUserAttributes !== "function") {
          throw new Error("fetchUserAttributes is not a function");
        }

        const attributes = await auth.fetchUserAttributes();

        if (!Array.isArray(attributes)) {
          console.error("Unexpected attributes format:", attributes);
          throw new Error("Attributes are not in expected array format");
        }

        const emailAttr = attributes.find(
          (attr: { Name: string; Value: string }) => attr.Name === "email"
        );

        const email = emailAttr?.Value || "No Email";

        const user = new MUser({
          email,
          first_name: "Default",
          last_name: "User",
        });

        userStore.setUser(user);
        setUserInfo(user);
      } catch (error) {
        console.error("Error fetching user attributes:", error);
      }
    };

    fetchUserInfo();
  }, [userStore]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigateTo("AUTH.SIGN_IN");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };
  return (
    <Sidebar collapsible="icon">
      <SidebarContent className=" py-8">
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="flex items-center justify-start h-[30px] mb-9">
              {!open ? (
                <img
                  src={logoIcon}
                  alt="Logo"
                  className={cn(
                    "h-[30px] w-[30px] absolute transition-all duration-300 ease-in-out"
                  )}
                />
              ) : (
                <div className="flex items-center gap-2 justify-center">
                  <img
                    src={logoImage}
                    alt="Logo"
                    className={cn(
                      "h-[30px] transition-all duration-300 ease-in-out"
                    )}
                  />

                  <div className="text-center">
                    <span className="text-white font-semibold text-lg">
                      Kinatico Verification Portal
                    </span>
                  </div>
                </div>
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href ?? "")}
                  >
                    <Link to={item.href ?? ""}>
                      {item.icon && (
                        <div className="w-5 h-5">
                          <item.icon width={20} height={20} />
                        </div>
                      )}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton>
                        <User2 color="#ffffff" />
                        <p className="text-sm truncate text-white">
                          {userInfo?.email ?? ""}
                        </p>
                        <ChevronUp color="#ffffff" className="ml-auto" />
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm truncate text-white">
                      {userInfo?.email ?? ""}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem onClick={handleLogout} asChild>
                  <Button
                    variant={"ghost"}
                    className="w-full flex justify-between"
                  >
                    <Text variant="text-14-leading-18">Log out</Text>
                    <LogOutIcon className="w-5 h-5" />
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
