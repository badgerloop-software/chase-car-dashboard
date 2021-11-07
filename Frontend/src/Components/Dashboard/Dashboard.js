import React from "react";

class Dashboard extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: null
        }
    }

    componentDidMount() {
        this.callBackEndApi()
            .then(
                res => {
                    this.setState({ data: res.response })
                    console.log("api::", res.response)
                }
            ).catch(err => console.log(err));
    }

    callBackEndApi = async () => {
        const response = await fetch('/api');
        const body = await response.json();

        if (response.status !== 200) {
            console.error("something is wrong with the api!!")
            throw Error(body.message)
        }

        return body;
    }
    render() {
        return (
            <div className="Dashboard">
                Dashboard 
                {/* Note: Data used here is just to test to ake sure we are able to communicate with the backend */}
                <p>Car Name:{this.state.data?.CarName}</p>
                <p>Speed:{this.state.data?.speed}</p>
                <p>Power:{this.state.data?.power}</p>
            </div>
        );
    }
}

export default Dashboard;
