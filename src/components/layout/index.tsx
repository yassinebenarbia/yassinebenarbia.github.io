import React, { useEffect, useState } from "react";
import { getSanitizedConfig, setupHotjar } from "../../utils";
import { SanitizedConfig } from "../../interfaces/sanitized-config";
import { UserConfig as Config } from "@/interfaces/user-config";
import { BG_COLOR } from "@/constants";

const Layout = ({
  children,
  config,
}: {
  children: React.ReactNode;
  config: Config;
}) => {
  const [sanitizedConfig] = useState<SanitizedConfig | Record<string, never>>(
    getSanitizedConfig(config),
  );

  useEffect(() => {
    if (Object.keys(sanitizedConfig).length > 0) {
      setupHotjar(sanitizedConfig.hotjar);
    }
  }, [sanitizedConfig]);

  return (
    <div className={`min-h-screen w-full ${BG_COLOR}`}>{children}</div>
  );
};

export default Layout;
