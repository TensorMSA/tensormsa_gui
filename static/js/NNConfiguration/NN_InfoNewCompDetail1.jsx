import React from 'react';
import Api from './../utils/Api'
import Modal from 'react-modal';
import EnvConstants from './../constants/EnvConstants';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import ReportRepository from './../repositories/ReportRepository'
import FileUploadComponent from './../NNLayout/common/FileUploadComponent'
import JsonConfComponent from './../NNLayout/common/JsonConfComponent'
// import TabPanel from 'react-tab-panel'
// import 'react-tab-panel/index.css'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.scss';

import { downloadFile } from 'download-url-file';



export default class NN_InfoNewCompDetail1 extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            tableData: null,
            NN_TableData: null,
            NN_TableDataDetail : null,
            color : "red",
            isViewImage: false,//Net Select Image view
            isViewImageDetail : null,//Net Select Image view
            netType : null,
            NN_TableColArr1:[    {index:0,      id:"sel",                   name:"Sel"}
                                ,{index:1,      id:"network",               name:"Network"}
                                ,{index:2,      id:"description",           name:"Description"}
                                ,{index:3,      id:"sample",                name:"SampleFile"}
                                ,{index:4,      id:"help",                  name:"Help"}

                            ]
        };
    }

    // 최초 1회 실행하여 Network Config List를 가져온다.
    componentDidMount(){
        this.getCommonNNInfoAuto(this.props.tabIndex);
        
    }

    // get Network List ex)wdnn, resnet, charcnn_csv    
    getCommonNNInfoAuto(params) {
        this.props.reportRepository.getCommonNNInfoAuto(params).then((tableData) => {
            this.setState({ NN_TableData: tableData })
        });   
    }

    // get Network config list ex)netconf_node, dataconf_node
    getCommonNNInfoAutoDetail(row){
        this.props.reportRepository.getCommonNNInfoAuto(row).then((tableData) => {
            this.setState({ NN_TableDataDetail: tableData })
        });
    }

    findColInfo(col, idxType, idxName){
        let fItem = ""
        if(idxType == "index"){
            fItem = col.find(data => { return data.index == idxName})
        }else if(idxType == "id"){
            fItem = col.find(data => { return data.id == idxName})
        }else if(idxType == "name"){
            fItem = col.find(data => { return data.name == idxName})
        }

        return fItem
    }

    //Network List가 선택 되면 해당 Config를 조회해준다.
    handleChangeRadio(selectedValue){
        let netSelectTable = this.refs.master2
        let value = selectedValue.target.value //radio button cell
        if(value == undefined && selectedValue.target.attributes[0] != undefined){// key, desc cell
            value = selectedValue.target.attributes [0].value
            for(let i=1 ; i < netSelectTable.rows.length ; i++){
                let key = netSelectTable.rows[i].children[0].children.rd1
                if(key.value == value && key.checked == false){
                    key.checked = true
                }else if(key.value == value && key.checked == true){
                    key.checked = false
                }
            }
        }
        this.state.netType = value

        this.getCommonNNInfoAutoDetail(value);
    }

    // Network 를 선택 하면 아래에 Image를 보여준다.
    viewNetImage(value){
        let url = "./images/"+value.target.alt+".png"
        if(this.state.isViewImage == true && this.state.isViewImageDetail == url){
            this.setState({ isViewImage: false })
            this.setState({ isViewImageDetail: null })
        }else{
            this.setState({ isViewImage: true })
            this.setState({ isViewImageDetail: url })
        }

        this.handleChangeRadio(value)
    }

    fileDownloadFunc(selectedValue){
        let path = selectedValue.target.alt
        let url = EnvConstants.getWebServerUrl()+path

        console.log(url)
        downloadFile(url);
    }


    render() {
        let k = 1
        function sortByKey(array, key) {
            return array.sort(function(a, b) {
                var x = a[key]; var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        }

        function makeHeader(data){// Make header
            let headerData = []
            for(let i in data){
                headerData.push(<th key={k++} style={{"textAlign":"center"}} >{data[i].name}</th>)
            }
            let tableHeader = []; //make header
            tableHeader.push(<tr key={k++} >{headerData}</tr>)
            return tableHeader
        }
        /////////////////////////////////////////////////////////////////////////////////////////
        // Select Network List
        /////////////////////////////////////////////////////////////////////////////////////////

        // Network List
        let nnInfoNewList = [];
        if (this.state.NN_TableData != null) {
            for (var i in this.state.NN_TableData) {
                nnInfoNewList[i] = {id:this.state.NN_TableData[i]["pk"]
                                    , desc:this.state.NN_TableData[i]["fields"]["graph_flow_desc"]
                                    , path:this.state.NN_TableData[i]["fields"]["train_file_path"]
                                    };
            }
        }
        nnInfoNewList = sortByKey(nnInfoNewList, 'id');

        // Network Select Header
        let tableHeaderSL = makeHeader(this.state.NN_TableColArr1)

        //Network Select Data
        let clickUrl = ""
        let tableDataSL = []; // make tabledata

        for(let rows in nnInfoNewList){
            let colDataSL = [];
            let row = nnInfoNewList[rows]

            if(this.props.tabIndex == 1){
                colDataSL.push(<td key={k++} > < input type = "checkbox" name="rd1"
                                                                    value = {row["id"]}
                                                                    onClick={this.handleChangeRadio.bind(this)} 
                                                                    style={{"textAlign":"center"}} />  </td>)
            }else{
                colDataSL.push(<td key={k++} > < input type = "radio" name="rd1"
                                                                    value = {row["id"]}
                                                                    onClick={this.handleChangeRadio.bind(this)} 
                                                                    style={{"textAlign":"center"}} />  </td>)
            }
            
            colDataSL.push(<td key={k++} value = {row["id"]} onClick={this.handleChangeRadio.bind(this)} > {row["id"]} </td>) 
            colDataSL.push(<td key={k++} value = {row["id"]} style={{"textAlign":"left"}} onClick={this.handleChangeRadio.bind(this)} > {row["desc"]} </td>) 
            clickUrl = "./images/ico_menu03.png"
            colDataSL.push(<td key={k++} > <img style ={{width:20, "cursor":"pointer"}} alt = {row["path"]}
                                                onClick={this.fileDownloadFunc.bind(this)} 
                                                src={clickUrl} /></td>)
            clickUrl = "./images/ico_help_on.png"
            colDataSL.push(<td key={k++} > <img style ={{width:20, "cursor":"pointer"}} alt = {row["id"]}
                                                onClick={this.viewNetImage.bind(this)} 
                                                src={clickUrl} /></td>)

            tableDataSL.push(<tr key={k++}>{colDataSL}</tr>)
        }


        let nnInfoNewListTable = []
        nnInfoNewListTable.push(<thead ref='thead' key={k++} className="center">{tableHeaderSL}</thead>)
        nnInfoNewListTable.push(<tbody ref='tbody' key={k++} className="center" >{tableDataSL}</tbody>)


        return (
            <section>
                    <div>
                        <table className="table detail" ref= 'master2' >
                            {nnInfoNewListTable}
                        </table>
                    </div>

                    {this.state.isViewImage ?
                        <div>
                        <table className="table detail" ref= 'master2_1' >
                        <tr><td style={{"textAlign":"center"}}>
                            <img src = {this.state.isViewImageDetail} style={{"width":"800"}} />
                        </td></tr>
                        </table>
                        </div>
                        :
                        <div>
                        </div>
                    }

                    <div>
                        <h1> Network Config ({this.state.netType}) </h1>
                    </div>
 
                    <JsonConfComponent ref="netconfig" editable="Y" NN_TableDataDetail={this.state.NN_TableDataDetail} />

                    <table className="table detail">
                    <tr>
                    <td style={{"verticalAlign":"top"}}>
                    <h1> Network Train Source File Upload </h1>
                    <FileUploadComponent ref="trainfilesrc" 
                                            nn_id={this.props.tmp_train_node_name} 
                                            nn_wf_ver_id={"1"} 
                                            nn_node_name={this.props.train_node_name} 
                                            nn_path_type={"source"}
                                            uploadbtnflag={true} 
                                            deletebtnflag={true} />
                    </td>

                    <td style={{"verticalAlign":"top"}}>
                    <h1> Network Eval Source File Upload </h1>
                    <FileUploadComponent ref="evalfilesrc" 
                                            nn_id={this.props.tmp_eval_node_name} 
                                            nn_wf_ver_id={"1"} 
                                            nn_node_name={this.props.eval_node_name} 
                                            nn_path_type={"source"}
                                            uploadbtnflag={true} 
                                            deletebtnflag={true} />
                    </td>

                    </tr>
                    </table>
            </section>

        );
    }
}

NN_InfoNewCompDetail1.defaultProps = {
    reportRepository: new ReportRepository(new Api())
};




