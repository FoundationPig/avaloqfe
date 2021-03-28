import './App.css';
import MyChart from "./components/MyChart";

function App() {
    return (
        <div style={{display: "flex",
            justifyContent: "center",
            flexDirection: "row",
            flexWrap: "wrap"}}>
            <MyChart type="fizz" />
            <MyChart type="fizzbuzz" />
            <MyChart type="buzz" />
        </div>

    );
}
export default App;
