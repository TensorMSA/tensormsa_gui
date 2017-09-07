import React from 'react';
import Api from './../utils/Api'
import Modal from 'react-modal';
import EnvConstants from './../constants/EnvConstants';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import ReportRepository from './../repositories/ReportRepository'
import FileUploadComponent from './../NNLayout/common/FileUploadComponent'
import JsonConfComponent from './../NNLayout/common/JsonConfComponent'

export default class NN_InfoNewComponent extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            tableData: null,
            NN_TableMaster: null,
            NN_TableData: null,
            NN_TableDataDetail : null,
            nn_id : null,
            wf_ver_id : null,
            color : "red",
            isViewImage: false,//Net Select Image view
            isViewImageDetail : null,//Net Select Image view
            netType : null,
            train_node_name:null,
            eval_node_name:null,
            tmp_train_node_name:"tmpTrainNodeName",
            tmp_eval_node_name:"tmpEvalNodeName",
            NN_TableColArr1:[    {index:0,      id:"title",                 name:"Title"}
                                ,{index:1,      id:"input_data",            name:"Input Data"}
                                ,{index:2,      id:"example",               name:"Example"}
                            ],
            NN_TableColArr2:[    {index:0,      id:"sel",                   name:"Sel"}
                                ,{index:1,      id:"network",               name:"Network"}
                                ,{index:2,      id:"description",           name:"Description"}
                                ,{index:3,      id:"help",                  name:"Help"}

                            ],
        };
    }

    // 최초 1회 실행하여 Network Config List를 가져온다.
    componentDidMount(){
        this.props.setActiveItem("init",null,null,null,null,null,null,null);
        // 파일 임시 저장소를 만들어 가져와 준다.
        this.props.reportRepository.getFileUpload(this.state.tmp_train_node_name, "1", "1", "tmp").then((tableData) => {
            this.state.train_node_name = tableData["path"]
        });
        this.props.reportRepository.getFileUpload(this.state.tmp_eval_node_name, "1", "1", "tmp").then((tableData) => {
            this.state.eval_node_name = tableData["path"]
        });

        this.getCommonNNInfoAuto('all');
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

    // Network Create
    saveData() {
        let flag = "T"
        let title = ""
        let input_data = ""
        let table = this.refs.master1
        let col = this.state.NN_TableColArr1
        
        // Validation Check
        for (let i=1 ; i < table.rows.length ; i++) {
            title = table.rows[i].cells[this.findColInfo(col, "id", "title").index].innerText
            input_data = table.rows[i].cells[this.findColInfo(col, "id", "input_data").index].children[0].value
            if(input_data == null || input_data == ""){ alert( title + " is not exist." );return; flag = "F"; break;}
        }

        let netType = this.state.netType
        if(flag == "T" && (netType == null || netType == "")){ 
            alert( "Select a Network Type") 
            return
        }

        let params = this.refs.netconfig.getConfigData("auto")
        
        // Make NN Info
        let inDefault = ["", "biz_cate","biz_sub_cate","nn_title","nn_desc"]
        let dparam = {}
        for (let i=1 ; i < table.rows.length ; i++) {
            title = table.rows[i].cells[this.findColInfo(col, "id", "title").index].innerText
            input_data = table.rows[i].cells[this.findColInfo(col, "id", "input_data").index].children[0].value
            dparam[inDefault[i]] = input_data
        }
        dparam["use_flag"] = "Y"
        dparam["config"] = "N"
        dparam["dir"] = netType
        dparam["automl_parms"] = params

        // Make NN WF Info
        let wfparam = {}
        wfparam["nn_def_list_info_nn_id"] = ""
        wfparam["nn_wf_ver_info"] = "init"
        wfparam["condition"] = "1"
        wfparam["active_flag"] = "Y"

        // Make NN WF Node Info
        let nodeparam = {}
        nodeparam["type"] = netType
        let desc = ""

        let trainfile = this.state.tmpFilePathTrain
        let evalfile = this.state.tmpFilePathEval

        let tfparam = {}
        tfparam["first_tmp_folder"] = this.state.tmp_train_node_name
        tfparam["last_tmp_folder"] = this.state.train_node_name

        let efparam = {}
        efparam["first_tmp_folder"] = this.state.tmp_eval_node_name
        efparam["last_tmp_folder"] = this.state.eval_node_name

        // let nn_id = "nn00000001"
        // let wf_ver_id = "1"


        let re = confirm( "Are you create?" )
        if(re == true){
            // Make NN Info
            this.props.reportRepository.postCommonNNInfo("", dparam).then((nn_id) => {
                this.setState({ nn_id: nn_id })
                // Make NN WF Info
                this.props.reportRepository.postCommonNNInfoWF(nn_id, wfparam).then((wf_ver_id) => {
                    this.setState({ wf_ver_id: wf_ver_id })
                    // Make NN WF Node Info
                    this.props.reportRepository.postCommonNNInfoWFNode(nn_id, wf_ver_id, nodeparam).then((tableData) => {
                        // Train File Save
                        desc = "train_data"
                        this.props.reportRepository.getCommonNNInfoWFNode(nn_id, wf_ver_id, desc).then((tableData) => {
                            desc = tableData[0]["fields"]["nn_wf_node_name"]
                            this.props.reportRepository.putFileUpload(nn_id, wf_ver_id, desc, tfparam).then((tableData) => {
                            });
                        });

                        // Eval File Save
                        desc = "eval_data"
                        this.props.reportRepository.getCommonNNInfoWFNode(nn_id, wf_ver_id, desc).then((tableData) => {
                            desc = tableData[0]["fields"]["nn_wf_node_name"]
                            this.props.reportRepository.putFileUpload(nn_id, wf_ver_id, desc, efparam).then((tableData) => {
                            });
                        });
                    });
                });
            });
        } 
    }

    //Network List가 선택 되면 해당 Config를 조회해준다.
    handleChangeRadio(selectedValue){
        let netSelectTable = this.refs.master2
        let value = selectedValue.target.value //radio button cell
        if(value == undefined && selectedValue.target.attributes[0] != undefined){// key, desc cell
            value = selectedValue.target.attributes [0].value
            for(let i=1 ; i < netSelectTable.rows.length ; i++){
                let key = netSelectTable.rows[i].children[0].children.rd1
                if(key.value == value){
                    key.checked = true
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


    render() {
        let k = 1
        /////////////////////////////////////////////////////////////////////////////////////////
        // First Network Default
        /////////////////////////////////////////////////////////////////////////////////////////
        const cellEditProp = {
            mode: 'click',
            blurToSave: true
        }

        // Network default
        let nnInfoDefault = [];
        if (this.state.NN_TableMaster == null){
            this.state.NN_TableMaster = [   {title:"Category"       , width:10    , input_data:"", ex:"ex) ERP, MES, SCM"}
                                            ,{title:"SubCategory"    , width:10    , input_data:"", ex:"ex) MRO"}
                                            ,{title:"Title"          , width:100    , input_data:"", ex:"ex) MRO Classification"}
                                            ,{title:"Description"    , width:5000    , input_data:"", ex:"ex) MRO Classification Description"}
                                         ];
        }
        nnInfoDefault = this.state.NN_TableMaster

        
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

        let tableHeader = makeHeader(this.state.NN_TableColArr1)
        let tableData = []
        for(let rows in this.state.NN_TableMaster){
            let colData = [];
            let row = this.state.NN_TableMaster[rows]
            colData.push(<td key={k++} style={{ "width":"20%"}}> {row["title"]} </td>)
            colData.push(<td key={k++} > < input type = {"string"} style={{"textAlign":"center", "width":"100%"}} 
                                                        defaultValue = {row["input_data"]}
                                                        maxLength = {row["width"]}  />  </td>)
            colData.push(<td key={k++} style={{"textAlign":"left", "width":"30%"}} > {row["ex"]} </td>)

            tableData.push(<tr key={k++}>{colData}</tr>)
        }

        let masterListTable = []
        masterListTable.push(<thead ref='thead' key={k++} className="center">{tableHeader}</thead>)
        masterListTable.push(<tbody ref='tbody' key={k++} className="center" >{tableData}</tbody>)
        /////////////////////////////////////////////////////////////////////////////////////////
        // Select Network List
        /////////////////////////////////////////////////////////////////////////////////////////
        // Network List
        let nnInfoNewList = [];
        if (this.state.NN_TableData != null) {
            for (var i in this.state.NN_TableData) {
                nnInfoNewList[i] = {id:this.state.NN_TableData[i]["pk"], desc:this.state.NN_TableData[i]["fields"]["graph_flow_desc"]};
            }
        }
        nnInfoNewList = sortByKey(nnInfoNewList, 'id');

        // Network Select Header
        let tableHeaderSL = []; //make header
        let colDatasSL = ["Sel", "Network", "Description", "Help"]
        let headerDataSL = []
        for (let i=0;i < colDatasSL.length;i++){
            headerDataSL.push(<th key={k++} style={{"textAlign":"center"}} >{colDatasSL[i]}</th>)
        }
        
        tableHeaderSL.push(<tr key={k++} >{headerDataSL}</tr>)

        //Network Select Data
        let tableDataSL = []; // make tabledata
        let checkRadio = false
        for(let rows in nnInfoNewList){
            let colDataSL = [];
            let row = nnInfoNewList[rows]
            if(row["id"] == this.state.netType){
                checkRadio = true
            }else{
                checkRadio = false
            }

            colDataSL.push(<td key={k++} > < input type = "radio" name="rd1"
                                                                    value = {row["id"]}
                                                                    onClick={this.handleChangeRadio.bind(this)} 
                                                                    checked = {checkRadio}
                                                                    style={{"textAlign":"center"}} />  </td>)
            colDataSL.push(<td key={k++} value = {row["id"]} onClick={this.handleChangeRadio.bind(this)} > {row["id"]} </td>) 
            colDataSL.push(<td key={k++} value = {row["id"]} style={{"textAlign":"left"}} onClick={this.handleChangeRadio.bind(this)} > {row["desc"]} </td>) 
            let clickUrl = "./images/ico_help_on.png"
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
                <h1 className="hidden">tensor MSA main table</h1>
                <div className="container paddingT10">
                    <div className="tblBtnArea">
                        <button type="button" className="save" onClick={() => this.saveData()} >Save</button>
                    </div>

                    <div>
                        <h1> Network Info </h1>
                    </div>


                    <div ref="masterInfo">
                        <table className="table detail" ref= 'master1' >
                            {masterListTable}
                        </table>
                    </div>
                        

                    <div>
                        <h1> Network Select </h1>
                    </div>

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

                    <JsonConfComponent ref="netconfig" NN_TableDataDetail={this.state.NN_TableDataDetail} />

                    <table className="table detail">
                    <tr>
                    <td style={{"verticalAlign":"top"}}>
                    <h1> Network Train Source File Upload </h1>
                    <FileUploadComponent ref="trainfilesrc" 
                                            nn_id={this.state.tmp_train_node_name} 
                                            nn_wf_ver_id={"1"} 
                                            nn_node_name={this.state.train_node_name} 
                                            nn_path_type={"source"}
                                            uploadbtnflag={true} 
                                            deletebtnflag={true} />
                    </td>

                    <td style={{"verticalAlign":"top"}}>
                    <h1> Network Eval Source File Upload </h1>
                    <FileUploadComponent ref="evalfilesrc" 
                                            nn_id={this.state.tmp_eval_node_name} 
                                            nn_wf_ver_id={"1"} 
                                            nn_node_name={this.state.eval_node_name} 
                                            nn_path_type={"source"}
                                            uploadbtnflag={true} 
                                            deletebtnflag={true} />
                    </td>

                    </tr>
                    </table>

                </div>
            </section>

        );
    }
}

NN_InfoNewComponent.defaultProps = {
    reportRepository: new ReportRepository(new Api())
};




