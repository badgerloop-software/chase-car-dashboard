import React from "react";

class Dashboard extends React.Component {
    render() {
        return <div id="dashboard" style={{display:'grid', gridTemplateColumns:'1fr 2fr', backgroundColor:'linen', position:'absolute', height:'100%', width:'100%'}}>
            <div id="immediate-data" style={{display:'grid', gridTemplateRows:'1fr 25px 2.5fr 25px 2fr', borderRight:'solid blue'}}>
                <div id="fault-container" style={{border:'dashed'}}>
                    TODO: Define Fault Container class and use a separate CSS file to structure the data views within it
                </div>
                <div id="data1-dropdown" style={{border:'dashed'}}>
                    Data 1 Dropdown
                </div>
                <div id="data1-container" style={{border:'dashed'}}>
                    TODO: Define Data 1 Container class and use a separate CSS file to structure the data views within it
                </div>
                <div id="data2-dropdown" style={{border:'dashed'}}>
                    Data 2 Dropdown
                </div>
                <div id="data2-container" style={{border:'dashed'}}>
                    TODO: Define Data 1 Container class and use a separate CSS file to structure the data views within it
                </div>
            </div>
            <div id="graph-data" style={{display:'grid', gridTemplateRows:'1fr 1fr 1fr', borderLeft:'solid red'}}>
                <div id="graph1" style={{border:'dashed'}}>
                    Graph 1
                    TODO: Create a generic graph class
                </div>
                <div id="graph2" style={{border:'dashed'}}>
                    Graph 2
                    TODO: Create a generic graph class
                </div>
                <div id="graph3" style={{border:'dashed'}}>
                    Graph 3
                    TODO: Create a generic graph class
                </div>
            </div>
        </div>;
    }
}

export default Dashboard;
