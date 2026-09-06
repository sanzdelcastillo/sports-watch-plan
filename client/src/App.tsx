import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import {
  EventDetailPage,
  FollowingPage,
  SettingsPage,
  StateLabPage,
  WatchPlanPage,
} from "./pages/ProductPrototype";
import { Route, Switch } from "wouter";

function App() {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <Toaster position="top-center" richColors />
        <Switch>
          <Route path="/" component={WatchPlanPage} />
          <Route path="/event/:id" component={EventDetailPage} />
          <Route path="/following" component={FollowingPage} />
          <Route path="/states" component={StateLabPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route component={WatchPlanPage} />
        </Switch>
      </TooltipProvider>
    </ErrorBoundary>
  );
}

export default App;
