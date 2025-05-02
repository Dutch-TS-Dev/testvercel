import { Provider } from "jotai/react";
import { store } from "../useAtoms";

// Export the Provider component with the initialized store
const JotaiProvider = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

export default JotaiProvider;
