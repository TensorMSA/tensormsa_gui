import React from 'react'
import ReportRepository from './../repositories/ReportRepository'
import Api from './../utils/Api'


export default class Help_seq2seq extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
        	NN_TableData: null
        };

    }
    /////////////////////////////////////////////////////////////////////////////////////////
    // Search Function
    /////////////////////////////////////////////////////////////////////////////////////////
    componentDidMount() {
    }

    render() {

        return (  

            <div>
                <h1> Seq2Seq </h1>
                
                <div className="container tabBody">
        
                </div>
            </div>
        )
    }
}


