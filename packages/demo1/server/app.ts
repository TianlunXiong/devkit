import App from '@vikit/nest';
import { devConnector } from '@vikit/bake';

const app = new App();

app.use(devConnector())

app.listen(9000, () => {
  app.cycleLog();
})