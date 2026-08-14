import "./workspace.css";
import WorkspaceSidebar from "./sidebar";

export default function WorkspaceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="workspace-app"><WorkspaceSidebar />{children}</div>;
}
