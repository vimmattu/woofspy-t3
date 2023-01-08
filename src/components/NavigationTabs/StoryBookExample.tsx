import { NavigationTabs, TabItem } from "./";

export const StoryBookExample = () => {
  return (
    <NavigationTabs>
      <TabItem title="Spy" href="/" active />
      <TabItem title="History" href="/history" />
      <TabItem title="Settings" href="/settings" />
    </NavigationTabs>
  );
};
