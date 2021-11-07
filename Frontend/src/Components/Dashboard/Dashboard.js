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

    componentDidUpdate(prevProps, prevState) {
        // console.log(prevState.data, this.state.data)
        // Typical usage (don't forget to compare props):
         if (prevState?.data !== this.state.data) {
            this.getNewData()
         }
      }

    callBackEndApi = async () => {
        const response = await fetch('/api');
        const body = await response.json();

        if (response.status !== 200) {
            console.error("api: error")
            throw Error(body.message)
        }

        return body;
    }

    getNewData(e) {
        this.callBackEndApi()
            .then(
                res => {
                    this.setState({ data: res.response })
                    // console.log("api::", res.response)
                }
            ).catch(err => console.log(err));
    }

    render() {
        return (
            <div className="Dashboard">
                Dashboard
                {/* Note: Data used here is just to test to make sure we are able to communicate with the backend
                          and update data */}
                <p>Car Name:{this.state.data?.carName}</p>
                <p>Speed:{this.state.data?.speed}</p>
                <p>Power:{this.state.data?.power}</p>
                {/* <button onClick={() => this.getNewData()}>
                    Update Data
                </button> */}
            </div>
        );
    }
}

export default Dashboard;
