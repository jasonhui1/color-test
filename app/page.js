'use client'

import { UserContextProvider } from "../Contexts/user";
import ColorTrainingTool from "./main";
export default function Home() {
  return (
    <UserContextProvider>
      <ColorTrainingTool />
    </UserContextProvider>
  );
}
