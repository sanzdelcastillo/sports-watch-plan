import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { DirectionComparison, DirectionDetail } from "./pages/DirectionReview";
import { Route, Switch } from "wouter";

function App() {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <Toaster position="top-center" richColors />
        <Switch>
          <Route path="/" component={DirectionComparison} />
          <Route path="/direction/editorial">{() => <DirectionDetail id="editorial" />}</Route>
          <Route path="/direction/planner">{() => <DirectionDetail id="planner" />}</Route>
          <Route path="/direction/command">{() => <DirectionDetail id="command" />}</Route>
          <Route component={DirectionComparison} />
        </Switch>
      </TooltipProvider>
    </ErrorBoundary>
  );
}

export default App;
