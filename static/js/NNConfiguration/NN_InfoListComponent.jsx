import React from 'react';
import Api from './../utils/Api'
import Modal from 'react-modal';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import ReportRepository from './../repositories/ReportRepository'
import StepArrowComponent from './../NNLayout/common/StepArrowComponent'

export default class NN_InfoListComponent extends React.Component {
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
        this.getCommonNNInfo();
        
    }

    getCommonNNInfo(params) {
        this.props.reportRepository.getCommonNNInfo(params).then((tableData) => {
            this.setState({ NN_TableData: null })
            this.setState({ NN_TableData: tableData })
        });   
    }

    searchCommonNNInfo(params) {
        this.getCommonNNInfo(params)
    }

    deleteCommonNNInfo(params) {
        let nn_id = ''
        let re = confirm( "Are you delete?" )

        if(re == true){
            for(let i=1 ; i < this.refs.master2.rows.length ; i++){
                let key = this.refs.master2.rows[i].children[0].children.rd1
                if(key.checked == true){
                    nn_id = key.value
                    params = { use_flag : 'N' }
                    this.props.reportRepository.putCommonNNInfo(nn_id, params).then((tableData) => {
                        this.getCommonNNInfo();
                    });
                }
            }
        }
    }

    updateCommonNNInfo(params){   
        let nn_id = ''
        let bc = ''
        let bc_sub = ''
        let bc_title = ''
        let bc_desc = ''
        let re = confirm( "Are you update?" )
        if(re == true){
            for(let i=1 ; i < this.refs.master2.rows.length ; i++){
                let key = this.refs.master2.rows[i].children[0].children.rd1
                if(key.checked == true){
                    bc = this.refs.master2.rows[i].children[1].children[0].value
                    bc_sub = this.refs.master2.rows[i].children[2].children[0].value
                    bc_title = this.refs.master2.rows[i].children[3].children[0].value
                    bc_desc = this.refs.master2.rows[i].children[4].children[0].value
                    nn_id = this.refs.master2.rows[i].children[5].innerText

                    params = { biz_cate : bc, biz_sub_cate : bc_sub, nn_title: bc_title, nn_desc :bc_desc }
                    this.props.reportRepository.putCommonNNInfo(nn_id, params).then((tableData) => {
                        this.getCommonNNInfo();
                    });
                }
            }
        }
        this.searchCommonNNInfo(params)
    }

    addCommonNNInfo(params) {
        return this.props.getHeaderEvent(4); //call Net Info   
    }

    handleChange(selectedValue){
        let value = selectedValue.target.alt //radio button cell
        if(value != undefined){// key, desc cell
            for(let i=1 ; i < this.refs.master2.rows.length ; i++){
                let key = this.refs.master2.rows[i].children[0].children.rd1
                if(key.value == value){
                    key.checked = true
                }
            }
        }
    }

    handleClick(value){
        
    }

    render() {
        let k = 1
        function sortByKey(array, key) {
            return array.sort(function(a, b) {
                var x = a[key]; var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        }

        let nnInfoNewList = [];

        if (this.state.NN_TableData != null) {
            for (var i in this.state.NN_TableData) {
                nnInfoNewList[i] = this.state.NN_TableData[i];
            }
        }

        nnInfoNewList = sortByKey(nnInfoNewList, 'id');

        // Network Select Header
        let tableHeaderSL = []; //make header
        let colDatasSL = ["sel", "Category", "SubCategory", "Title", "Description", "ID", "Ver", "Batch"]
        let headerDataSL = []
        for (let i=0;i < colDatasSL.length;i++){
            headerDataSL.push(<th key={k++} style={{"text-align":"center"}} >{colDatasSL[i]}</th>)
        }
        
        tableHeaderSL.push(<tr key={k++} >{headerDataSL}</tr>)

        //Network Select Data
        let tableDataSL = []; // make tabledata
        for(let rows in nnInfoNewList){
            let colDataSL = [];
            let row = nnInfoNewList[rows]

            colDataSL.push(<td key={k++} > < input type = "checkbox" name="rd1"
                                                                    value = {row["nn_id"]}
                                                                    style={{"text-align":"center"}} />  </td>)
            colDataSL.push(<td key={k++} > < input type = {"string"} style={{"text-align":"center"}} defaultValue = {row["biz_cate"]}
                                                         alt = {row["nn_id"]} onChange = {this.handleChange.bind(this)} />  </td>)
            colDataSL.push(<td key={k++} > < input type = {"string"} style={{"text-align":"center"}} defaultValue = {row["biz_sub_cate"]} 
                                                         alt = {row["nn_id"]} onChange = {this.handleChange.bind(this)} />  </td>)
            colDataSL.push(<td key={k++} > < input type = {"string"} style={{"text-align":"center"}} defaultValue = {row["nn_title"]} 
                                                         alt = {row["nn_id"]} onChange = {this.handleChange.bind(this)} />  </td>)
            colDataSL.push(<td key={k++} > < input type = {"string"} style={{"text-align":"center"}} defaultValue = {row["nn_desc"]} 
                                                         alt = {row["nn_id"]} onChange = {this.handleChange.bind(this)} />  </td>)

            colDataSL.push(<td key={k++} value = {row["nn_id"]} style ={{"color":"blue", "cursor":"pointer"}}
                            onClick={() => this.handleClick(row["nn_id"]) } > {row["nn_id"]} </td>) 
            colDataSL.push(<td key={k++} value = {row["nn_id"]} > {row["nn_wf_ver_id"]} </td>)
            colDataSL.push(<td key={k++} value = {row["nn_id"]} > {row["nn_batch_ver_id"]} </td>) 
            // let clickUrl = "./images/ico_help.png"
            // colDataSL.push(<td key={k++} > <img style ={{width:20, "cursor":"pointer"}} alt = {row["id"]}
            //                                     onClick={this.viewNetImage.bind(this)} 
            //                                     src={clickUrl} /></td>)

            tableDataSL.push(<tr key={k++}>{colDataSL}</tr>)
        }


        let nnInfoNewListTable = []
        nnInfoNewListTable.push(<thead ref='thead' key={k++} className="center">{tableHeaderSL}</thead>)
        nnInfoNewListTable.push(<tbody ref='tbody' key={k++} className="center" >{tableDataSL}</tbody>)

        return (
            <section>
                <h1 className="hidden">tensor MSA main table</h1>
                <div className="container paddingT10">
                    <div className="tblBtnArea">
                        
                        <button type="button" className="addnew" onClick={() => this.addCommonNNInfo() } >Add New</button>
                    </div>

                    <div className="tblBtnArea">
                        <button type="button" className="search" onClick={() => this.searchCommonNNInfo()} >Search</button>               
                        <button type="button" className="delete" onClick={() => this.deleteCommonNNInfo()} >Delete</button>
                        <button type="button" className="modify" onClick={() => this.updateCommonNNInfo()} >Modify</button>
                    </div>

                    <div>
                        <h1> Network List </h1>
                    </div>

                    <div>
                        <table className="table detail" ref= 'master2' >
                            {nnInfoNewListTable}
                        </table>
                    </div>


                </div>
            </section>
        );
    }
}







NN_InfoListComponent.defaultProps = {
    reportRepository: new ReportRepository(new Api())
};

