import { Route, Switch } from 'wouter';
import Home from './pages/Home';
import CityDetails from './pages/CityDetails';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Cookies from './pages/Cookies';
import Credits from './pages/Credits';
import NotFound from './pages/NotFound';
import WhatsAppFloatingChat from './components/WhatsAppFloatingChat';

export default function App() {
  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/city/:cityId" component={CityDetails} />
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/cookies" component={Cookies} />
        <Route path="/credits" component={Credits} />
        <Route component={NotFound} />
      </Switch>
      <WhatsAppFloatingChat />
    </>
  );
}
