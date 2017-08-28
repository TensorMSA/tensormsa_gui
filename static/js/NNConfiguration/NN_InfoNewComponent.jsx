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
            tmp_eval_node_name:"tmpEvalNodeName"
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

    // getConfigData에서 Table 값을 가져와 로우 단위로 값을 편성하여 Json을 만들기 쉽게 하기 위함이다.
    setConfigData(data){
        let redata = []
        let childcnt = data.childElementCount // Table Cell Child Count
        let text = data.textContent.trim() // Table Cell Text innerText
        let rowspan = data.rowSpan // Table Cell RowSpan
        let edit = data.contentEditable // Table Cell Editable
        let type = data.getAttribute("type") // Table Last Cell Type ex) number, string
        let color = data.style.color

        if(childcnt > 0){// 마지막 값인 경우 childcnt를 가진다.
            let childN = data.childNodes[0]
            // Select Box의 선택 값을 가져와 넣어준다.
            if(childN != undefined && childN.childNodes[0] != undefined && childN.childNodes[0].type == "select-one"){
                let selectedValue = ""
                if(childN.childNodes[0].selectedOptions[0] != null){
                   text = childN.childNodes[0].selectedOptions[0].value
                }
                type = "sel"
                color = childN.childNodes[0].style.color
            }else{// 일반적인 Text 값을 가져온다.
                text = data.children[0].value
                type = data.children[0].type
            }

            rowspan = 1
            edit = "true"
        }

        if(type == "number"){
            type = "int"
        }else if(type == "string"){
            type = "str"
        }

        redata.push(text)
        redata.push(rowspan)
        redata.push(edit)
        redata.push(type)
        redata.push(color)

        return redata
    }

    // Table에 있는 값을 가져와 Json으로 만들어주는 함수.
    getConfigData(){
        let noconfTable = this.refs.netconfig.refs.master3
        let tdata = noconfTable.rows
        let sColor = this.state.color

        let preData = []
        let params = {}
        let maxrowcnt = noconfTable.tHead.children[0].childElementCount
        let arr = []
        // Table Cell 이 Group 으로 묶여 있어 Rowspan 을 재정의 하여 배열로 만들어 주며 이를 Json으로 만들어준다.
        for(let rowcnt=0;rowcnt < tdata.length;rowcnt++){
            let row = tdata[rowcnt].cells
            
            // Row 단위로 주요 정보를 배열 형태로 만들어 준다.
            let rowcol = 0
            for(let colcnt=0;colcnt < maxrowcnt;colcnt++){
                if(preData[colcnt] == undefined){//첫번쨰 줄은 바로 Insert 해준다.
                    preData.push(this.setConfigData(row[colcnt]))
                }else{
                    if(preData[colcnt][1] == 1){// RowSpan이 1인경우는 값을 넣어주어야 한다.
                        preData[colcnt] = this.setConfigData(row[rowcol])
                        rowcol += 1
                    }else if(preData[colcnt][1] > 1){// RowSpan이 1을 넘는 경우는 넣어주지 않고 이전 값을 사용하며 RowSpan을 1 줄인다.
                        preData[colcnt][1] = preData[colcnt][1]-1
                    }
                }
            }
            
            // 만들어 진 배열을 컬럼 단위로 읽어 Json으로 변환해준다.
            let value = ""
            let param = params
            let arrflag = "N"
            for(let k=0;k < preData.length-1;k++){  
                // let inputflag = preData[k][2]
                let textdata = preData[k][0]
                let color = preData[k][4]
                
                // Value 값을 가져오기 위함이다.
                // let vflag = preData[k+1][2]
                let vdata = preData[k+1][0]
                let vcolor = preData[k+1][4]

                if(vdata == ""){ // 데이터가 끝까지 없는 경우는 넘어가야 한다. "" 경우
                    continue
                }

                if(vcolor == sColor && arrflag == "N"){// 배열이 아닌 마지막 값을 가진 Cell 이 오면 
                    param["type"] = preData[k+1][3]
                    
                    if(param["option"] == undefined){
                        param["option"] = null
                    }
                    if(param["auto"] == undefined){
                        param["auto"] = false
                    }

                    if(vdata == this.state.arrayData){
                        param[textdata] = []
                    }else if(vdata == this.state.jsonData){
                        param[textdata] = {}
                    }else if(vdata == "null"){
                        param[textdata] = null
                    }else{
                        if(param["type"] == "int"){
                            vdata *= 1
                        }
                        param[textdata] = vdata // 일반 데이터 값을 넣어준다.
                    }
                    
                }else if(vcolor != sColor && vdata != "" && isNaN(vdata) == false ){//자식이 컬럼이면서 숫자인 경우는 배열이다. 
                    if(param[textdata] == undefined || param[textdata] == false || param[textdata] == null){// 값이 없의 면서 Json
                        param[textdata] = [] 
                    }  

                    if(preData[k+2] != null && preData[k+2][3] != ""){
                        param["type"] = preData[k+2][3]
                        if(param["option"] == undefined){
                            param["option"] = null
                        }
                        if(param["auto"] == undefined){
                            param["auto"] = false
                        }
                    }
                    if(param["type"] == "int"){
                        preData[k+2][0] *= 1
                    }

                    param[textdata][vdata] = preData[k+2][0]
                    arrflag = "Y"
                }else if(arrflag == "N"){//배열이 아닌 경우
                    if(param[textdata] == undefined || param[textdata] == false || param[textdata] == null){// 값이 없의 면서 Json
                        param[textdata] = {}
                    }
                    param = param[textdata]
                }
            }
        }
        return params
    }

    // Network Create
    saveData() {
        let flag = "T"
        let title = ""
        let input_data = ""
        let netInfotable = this.refs.master1.state
        
        // Validation Check
        for (var i in netInfotable.data) {
            title = netInfotable.data[i]["title"]
            input_data = netInfotable.data[i]["input_data"]
            if(input_data == null || input_data == ""){ alert( title + " is not exist." );return; flag = "F"; break;}
        }

        let netType = this.state.netType
        if(flag == "T" && (netType == null || netType == "")){ 
            alert( "Select a Network Type") 
            return
        }

        let params = this.getConfigData()
        
        // Make NN Info
        let inDefault = ["biz_cate","biz_sub_cate","nn_title","nn_desc"]
        let dparam = {}
        for (let i in netInfotable.data) {
            title = netInfotable.data[i]["title"]
            input_data = netInfotable.data[i]["input_data"]
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
                    this.props.reportRepository.getCommonNodeInfo(nn_id, wf_ver_id, desc).then((tableData) => {
                        desc = tableData[0]["fields"]["nn_wf_node_name"]
                        this.props.reportRepository.putFileUpload(nn_id, wf_ver_id, desc, tfparam).then((tableData) => {
                        });
                    });

                    // Eval File Save
                    desc = "eval_data"
                    this.props.reportRepository.getCommonNodeInfo(nn_id, wf_ver_id, desc).then((tableData) => {
                        desc = tableData[0]["fields"]["nn_wf_node_name"]
                        this.props.reportRepository.putFileUpload(nn_id, wf_ver_id, desc, efparam).then((tableData) => {
                        });
                    });
                });
            });
        });
                
    }

    //Network List가 선택 되면 해당 Config를 조회해준다.
    handleChangeRadio(selectedValue){
        let netSelectTable = this.refs.master2
        let value = selectedValue.target.value //radio button cell
        if(value == undefined && selectedValue.target.attributes[0] != undefined){// key, desc cell
            value = selectedValue.target.attributes[0].value
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
            this.state.NN_TableMaster = [   {title:"Category"          , input_data:"", ex:"ex) ERP, MES, SCM"}
                                            ,{title:"SubCategory"      , input_data:"", ex:"ex) MRO"}
                                            ,{title:"Title"         , input_data:"", ex:"ex) MRO Classification"}
                                            ,{title:"Description"   , input_data:"", ex:"ex) MRO Classification Description"}
                                         ];
        }
        nnInfoDefault = this.state.NN_TableMaster

        /////////////////////////////////////////////////////////////////////////////////////////
        // Select Network List
        /////////////////////////////////////////////////////////////////////////////////////////
        function sortByKey(array, key) {
            return array.sort(function(a, b) {
                var x = a[key]; var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        }

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
        let colDatasSL = ["Sel", "Network", "Description", "Image"]
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

                    <div className="net-info-default">
                        <table className="form-table align-left">
                            <BootstrapTable ref= 'master1' 
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


                </div>
            </section>

        );
    }
}

NN_InfoNewComponent.defaultProps = {
    reportRepository: new ReportRepository(new Api())
};




