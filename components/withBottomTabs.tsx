import BottomTabs from "@/components/BottomTabs";
import { SafeArea } from "@/components/SafeArea";
import React from "react";

// Higher-Order Component to wrap tab pages with BottomTabs
const withBottomTabs = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  backgroundColor: string = "#ffffff"
) => {
  const ComponentWithBottomTabs = (props: P) => {
    return (
      <SafeArea
        backgroundColor={backgroundColor}
        edges={["top", "left", "right"]}
      >
        <WrappedComponent {...props} />
        <BottomTabs />
      </SafeArea>
    );
  };

  ComponentWithBottomTabs.displayName = `withBottomTabs(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return ComponentWithBottomTabs;
};

export default withBottomTabs;
