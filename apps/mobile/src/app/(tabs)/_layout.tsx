import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";

import { AppHeader } from "@/components/ui/app-header";
import { TabBar, TabButton } from "@/components/ui/tab-bar";

/**
 * Custom Expo Router tabs layout. Uses the headless Tabs/TabList/TabTrigger/
 * TabSlot from expo-router/ui to render a neo-brutalist bottom navigation.
 *
 * Four tabs: Home, Explore, Saved, Profile. The detail routes (paths/[slug],
 * lessons/[slug]) live in the parent Stack, not in the tabs.
 */
export default function TabsLayout() {
  return (
    <Tabs>
      <AppHeader />
      <TabSlot />
      <TabList asChild>
        <TabBar>
          <TabTrigger name="home" href="/" asChild>
            <TabButton
              label="Home"
              icon={{ ios: "house", android: "home", web: "home" }}
            />
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton
              label="Explore"
              icon={{ ios: "safari", android: "explore", web: "explore" }}
            />
          </TabTrigger>
          <TabTrigger name="saved" href="/saved" asChild>
            <TabButton
              label="Saved"
              icon={{ ios: "bookmark", android: "bookmark", web: "bookmark" }}
            />
          </TabTrigger>
          <TabTrigger name="profile" href="/profile" asChild>
            <TabButton
              label="Profile"
              icon={{ ios: "person", android: "person", web: "person" }}
            />
          </TabTrigger>
        </TabBar>
      </TabList>
    </Tabs>
  );
}
