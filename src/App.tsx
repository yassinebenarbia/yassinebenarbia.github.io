import { Outlet } from "react-router-dom";
import Layout from "./components/layout";
import { UserConfig as Config } from "@/interfaces/user-config";

const App = ({ config }: { config: Config }) => {
  return (
    <Layout config={config}>
      <Outlet />
    </Layout>
  );
};

export default App;
