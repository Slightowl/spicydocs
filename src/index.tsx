import "bulmaswatch/superhero/bulmaswatch.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./img.css";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./state";
import CellList from "./components/cell-list";

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <img src="spicy-logo.png" alt="alternatetext" className="center"></img>
      </div>
      <div>
        <CellList />
      </div>
    </Provider>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
