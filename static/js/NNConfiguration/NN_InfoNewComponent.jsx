import React from 'react';
import Api from './../utils/Api'
import Modal from 'react-modal';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import ReportRepository from './../repositories/ReportRepository'
import StepArrowComponent from './../NNLayout/common/StepArrowComponent'

export default class NN_InfoNewComponent extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            tableData: null,
            NN_TableData: null,
            selModalView: null,
            NN_ID : null,
            stepBack : 1,
            stepForward : 2
        };
    }

    componentDidMount(){
        this.getCommonNNInfoNew();
    }

    getCommonNNInfoNew(params) {
        this.props.reportRepository.getCommonNNInfoNew(params).then((tableData) => {
            this.setState({ NN_TableData: tableData })
        });   
    }

    addCommonNNInfo(params) {
        console.log(this.refs.table.state.selectedRowKeys)
        // this.setState({<NN_InfoNewComponent /> });   
    }


    render() {
        const cellEditProp = {
            mode: 'click',
            blurToSave: true
        }

        let nnInfoDefault = [   {title:"Network ID"            , input_data:"", ex:"ex) ERP0001"}
                        ,{title:"Biz Category"          , input_data:"", ex:"ex) ERP, MES, SCM"}
                        ,{title:"Biz Sub Category"      , input_data:"", ex:"ex) MRO Classification"}
                        ,{title:"Biz Description"       , input_data:"", ex:"ex) MRO Classification Description"}
                     ];
        let nnInfoNewList = [];

        if (this.state.NN_TableData != null) {
            for (var i in this.state.NN_TableData) {
                nnInfoNewList[i] = this.state.NN_TableData[i];
            }
        }
        return (
            <section>
                <h1 className="hidden">tensor MSA main table</h1>
                <div className="container paddingT10">
                    
                
                    <div className="net-info-default">
                        <table className="form-table align-left">
                            <BootstrapTable ref= 'table' 
                                data={nnInfoDefault} 
                                striped={true} 
                                hover={true} 
                                condensed={true} 
                                cellEdit={ cellEditProp } 
                                >
                                
                                <TableHeaderColumn dataField="title" headerAlign='center' dataAlign='center' isKey={true} >Title</TableHeaderColumn>
                                <TableHeaderColumn dataField="input_data"  headerAlign='center' dataAlign='center' >Input Data</TableHeaderColumn>
                                <TableHeaderColumn dataField="ex"  headerAlign='center' dataAlign='left' editable={ false } >Example</TableHeaderColumn>
                            </BootstrapTable>
                        </table>
                    </div>

                    <div className="net-info">
                        <table className="form-table align-left">
                            <BootstrapTable ref= 'table' 
                                data={nnInfoNewList} 
                                striped={true} 
                                hover={true} 
                                condensed={true} 
                                cellEdit={ cellEditProp } 
                                >
                                
                                <TableHeaderColumn dataField="graph_flow_id" headerAlign='center' dataAlign='center' isKey={true} >Network</TableHeaderColumn>
                                <TableHeaderColumn dataField="graph_flow_data"  headerAlign='center' dataAlign='center' >Data</TableHeaderColumn>
                               
                            </BootstrapTable>
                        </table>
                    </div>

                    <div className="tblBtnArea">
                        <button type="button" className="save" onClick={() => this.addCommonNNInfo()} >Save</button>
                    </div>

                </div>
            </section>

        );
    }
}

NN_InfoNewComponent.defaultProps = {
    reportRepository: new ReportRepository(new Api())
};

