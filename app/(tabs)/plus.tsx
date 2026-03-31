import { Redirect } from "expo-router";

// This is a placeholder for the plus button action.
// The real action is handled by the tabBarButton in _layout.tsx
export default function PlusPlaceholder() {
  return <Redirect href="/" />;
}
