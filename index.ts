import './index.scss';
import { initHeatMap } from './src/initHeatMap';

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    (): void => {
      initHeatMap();
    }
  );
} else {
  initHeatMap();
}
