import React from "react";
import { Redirect } from "expo-router";
import "../constants/theme/unistyles";
export default function Index() {
  // const [onboarded] = useState(true);
  // const {loggedIn} = useAppSelector(state => state.isLoggedIn);
  // return <Redirect href={'/onboarding'} />;
  return (
    <Redirect
      // href={"/liveanimation"}
      // href={"/trigonometryline"}
      // href={"/Messagehome"}
      href={"/collision"}
    />
  );
}
// ✗ eas build -p android --profile preview2
