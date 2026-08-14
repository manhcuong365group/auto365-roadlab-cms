import "./workspace.css";
import WorkspaceSidebar from "./sidebar";
import WorkspaceTopbar from "./topbar";

export default function WorkspaceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="workspace-app"><WorkspaceSidebar /><main className="workspace-page"><WorkspaceTopbar />{children}</main></div>;
}
