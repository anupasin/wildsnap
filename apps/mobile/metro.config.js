// Metro config for the pnpm monorepo.
//
// packages/ui keeps its own local `react`/`react-native` installs (for its
// standalone `tsc --noEmit`), and pnpm's peer-dependency resolution gives
// those a DIFFERENT physical copy than the one apps/mobile installs (even
// at the same version string) whenever the surrounding peer context differs.
// Metro's hierarchical lookup finds ui's own local copy first when bundling
// ui/src files, so a plain `extraNodeModules` fallback never kicks in —
// the app ends up with two live React/React Native instances, which breaks
// hooks at runtime ("Invalid hook call" / "Cannot read property 'use' of
// null"). `resolveRequest` intercepts before hierarchical lookup and forces
// every request for these packages to resolve from this app's own copy.
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

const SINGLE_INSTANCE_PACKAGES = ["react", "react-native"];
const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  for (const pkg of SINGLE_INSTANCE_PACKAGES) {
    if (moduleName === pkg || moduleName.startsWith(`${pkg}/`)) {
      const rest = moduleName.slice(pkg.length); // "" or "/subpath..."
      const forcedPath = path.resolve(projectRoot, "node_modules", pkg) + rest;
      return context.resolveRequest(context, forcedPath, platform);
    }
  }
  return defaultResolveRequest
    ? defaultResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

config.resolver.unstable_enableSymlinks = true;

module.exports = config;
