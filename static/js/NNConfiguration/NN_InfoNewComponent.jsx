import React from 'react';
import Api from './../utils/Api'
import Modal from 'react-modal';
import EnvConstants from './../constants/EnvConstants';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import ReportRepository from './../repositories/ReportRepository'
import FileUploadProgress  from 'react-fileupload-progress';

const FileUpload = require('react-fileupload');
import { Line, Circle } from 'rc-progress';
import {findDOMNode} from 'react-dom'
import ReactTooltip from 'react-tooltip'
import ToolTip from 'react-portal-tooltip'


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
            arrayData : "[ ]",
            jsonData : "{ }",
            tmpFilePathTrain : "1",
            tmpFilePathEval : "1",
            tmpFilePathTrainData : null,
            tmpFilePathEvalData : null,
            percent:0,//File Upload percent
            lineviewTrain:false,//File Upload Line
            lineviewEval:false,//File Upload Lin
            isViewImage: false,//Net Select Image view
            isViewImageDetail : null,//Net Select Image view
            netType : null
        };
        this.getTmpFilePathTrain = this.getTmpFilePathTrain.bind(this);
        this.getTmpFilePathEval = this.getTmpFilePathEval.bind(this);
        this._handleUploadingTrain = this._handleUploadingTrain.bind(this);
        this._handleUploadingEval = this._handleUploadingEval.bind(this);
        this.optTmpFilePathTrain={
            baseUrl:EnvConstants.getApiServerUrl() + '/api/v1/type/wf/state/data/detail/upload/file/nnid/tmpFilePathTrain/ver/1/dir/'+this.state.tmpFilePathTrain+'/',
            param:{
                fid:0
            }
            ,chooseAndUpload : true
            ,multiple : true
            ,uploadSuccess : this.getTmpFilePathTrain
            ,uploading: this._handleUploadingTrain
        };

        this.optTmpFilePathEval={
            baseUrl:EnvConstants.getApiServerUrl() + '/api/v1/type/wf/state/data/detail/upload/file/nnid/tmpFilePathEval/ver/1/dir/'+this.state.tmpFilePathEval+'/',
            param:{
                fid:0
            }
            ,chooseAndUpload : true
            ,multiple : true
            ,uploadSuccess : this.getTmpFilePathEval
            ,uploading: this._handleUploadingEval
        } ;
        
    }

    // 최초 1회 실행하여 Network Config List를 가져온다.
    componentDidMount(){
        this.getCommonNNInfoAuto('all');
        // 파일 임시 저장소를 만들어 가져와 준다.
        this.props.reportRepository.getFileUploadPath("tmpFilePathTrain", "1", "1").then((tableData) => {
            this.setState({ tmpFilePathTrain : tableData["path"]})
            this.optTmpFilePathTrain.baseUrl = EnvConstants.getApiServerUrl() + '/api/v1/type/wf/state/data/detail/upload/file/nnid/tmpFilePathTrain/ver/1/dir/'+this.state.tmpFilePathTrain+'/'
        });
        this.props.reportRepository.getFileUploadPath("tmpFilePathEval", "1", "1").then((tableData) => {
            this.setState({ tmpFilePathEval : tableData["path"]})
            this.optTmpFilePathEval.baseUrl  = EnvConstants.getApiServerUrl() + '/api/v1/type/wf/state/data/detail/upload/file/nnid/tmpFilePathEval/ver/1/dir/'+this.state.tmpFilePathEval+'/'
        });
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

    _handleUploadingTrain(progress, mill){
        this.state.lineviewTrain = true
        let per = Math.round(progress.loaded/progress.total * 100)
        this.setState({ percent : per})
        if(progress.total == 0){
            this.state.lineviewTrain = false
        }
    }

    _handleUploadingEval(progress, mill){
        this.state.lineviewEval = true
        let per = Math.round(progress.loaded/progress.total * 100)
        this.setState({ percent : per})
        if(progress.total == 0){
            this.state.lineviewEval = false
        }
    }

    getTmpFilePathTrain(){
        console.log("getTmpFilePathTrain()")
        this.props.reportRepository.getFileUploadPath("tmpFilePathTrain", "list", this.state.tmpFilePathTrain).then((tableData) => {
                                        this.setState({ tmpFilePathTrainData : tableData})
                                    });
    }

    getTmpFilePathEval(){
        console.log("getTmpFilePathEval()") 
        this.props.reportRepository.getFileUploadPath("tmpFilePathEval", "list", this.state.tmpFilePathEval).then((tableData) => {
                                        this.setState({ tmpFilePathEvalData : tableData})
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
        let tdata = this.refs.tbody.rows
        let sColor = this.state.color

        let preData = []
        let params = {}
        let maxrowcnt = this.refs.master3.tHead.children[0].childElementCount
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
    saveCommonNNInfoNew() {
        let flag = "T"
        let title = ""
        let input_data = ""
        
        // Validation
        for (var i in this.refs.master1.state.data) {
            title = this.refs.master1.state.data[i]["title"]
            input_data = this.refs.master1.state.data[i]["input_data"]
            if(input_data == null || input_data == ""){ alert( title + " is not exist." );return; flag = "F"; break;}
        }

        let netType = this.state.netType
        if(flag == "T" && (netType == null || netType == "")){ 
            alert( "Select a Network Type") 
            return
        }
        netType = netType[0]

        let params = this.getConfigData()

        console.log(params)
        
        // Make NN Info
        let inDefault = ["biz_cate","biz_sub_cate","nn_title","nn_desc"]
        let dparam = {}
        for (let i in this.refs.master1.state.data) {
            title = this.refs.master1.state.data[i]["title"]
            input_data = this.refs.master1.state.data[i]["input_data"]
            dparam[inDefault[i]] = input_data
        }
        dparam["use_flag"] = "Y"
        dparam["config"] = "N"
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
        tfparam["type"] = "tmpFilePathTrain"
        tfparam["path"] = trainfile

        let efparam = {}
        efparam["type"] = "tmpFilePathEval"
        efparam["path"] = evalfile

        let nn_id = "nn00000001"
        let wf_ver_id = "1"


        // // Make NN Info
        // this.props.reportRepository.postCommonNNInfo("", dparam).then((nn_id) => {
        //     this.setState({ nn_id: nn_id })
        //     // Make NN WF Info
        //     this.props.reportRepository.postCommonNNInfoWF(nn_id, wfparam).then((wf_ver_id) => {
        //         this.setState({ wf_ver_id: wf_ver_id })
        //         // Make NN WF Node Info
        //         this.props.reportRepository.postCommonNNInfoWFNode(nn_id, wf_ver_id, nodeparam).then((tableData) => {
        //             // Train File Save
        //             desc = "train_data"
        //             this.props.reportRepository.getCommonNodeInfo(nn_id, wf_ver_id, desc).then((tableData) => {
        //                 desc = tableData[0]["fields"]["nn_wf_node_name"]
        //                 this.props.reportRepository.putFileUpload(nn_id, wf_ver_id, desc, tfparam).then((tableData) => {
        //                 });
        //             });

        //             // Eval File Save
        //             desc = "eval_data"
        //             this.props.reportRepository.getCommonNodeInfo(nn_id, wf_ver_id, desc).then((tableData) => {
        //                 desc = tableData[0]["fields"]["nn_wf_node_name"]
        //                 this.props.reportRepository.putFileUpload(nn_id, wf_ver_id, desc, efparam).then((tableData) => {
        //                 });
        //             });

        //         });
        //     });
        // });
                
    }

    handleChange(selectedValue){
        console.log(selectedValue.target.value)

    }

    handleChangeRadio(selectedValue){
        let value = selectedValue.target.value //radio button cell
        if(value == undefined && selectedValue.target.attributes[0] != undefined){// key, desc cell
            value = selectedValue.target.attributes[0].value
            for(let i=1 ; i < this.refs.master2.rows.length ; i++){
                let key = this.refs.master2.rows[i].children[0].children.rd1
                if(key.value == value){
                    key.checked = true
                }
            }
        }
        this.state.netType = value

        this.getCommonNNInfoAutoDetail(value);
    }

    fileDeleteTrain(value){
        let tfparam = {}
        tfparam["filename"] = value.target.alt
        this.props.reportRepository.deleteFileUploadPath("tmpFilePathTrain", "1", this.state.tmpFilePathTrain, tfparam).then((tableData) => {
                                                this.getTmpFilePathTrain()
                                                });
    }

    fileDeleteEval(value){
        let tfparam = {}
        tfparam["filename"] = value.target.alt
        this.props.reportRepository.deleteFileUploadPath("tmpFilePathEval", "1", this.state.tmpFilePathEval, tfparam).then((tableData) => {
                                                this.getTmpFilePathEval()
                                                });
    }

    viewNetImage(value){
        let url = "./images/"+value.target.alt+".png"
        if(this.state.isViewImage == true && this.state.isViewImageDetail == url){
            this.setState({ isViewImage: false })
            this.setState({ isViewImageDetail: null })
        }else{
            this.setState({ isViewImage: true })
            this.setState({ isViewImageDetail: url })
        }
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
        // fileupload
        /////////////////////////////////////////////////////////////////////////////////////////
        const containerStyle = {
            width: '100%'
        };

        let listTmpFilePathTrain = []
        if (this.state.tmpFilePathTrainData != null) {
            listTmpFilePathTrain = this.state.tmpFilePathTrainData
        }

        let listTmpFilePathEval = []
        if (this.state.tmpFilePathEvalData != null) {
            listTmpFilePathEval = this.state.tmpFilePathEvalData
        }

        // Train File upload Header
        let tableHeaderTF = []; //make header
        let colDatasTF = ["Train File Name", "Del"]
        let headerDataTF = []
        for (let i=0;i < colDatasTF.length;i++){
            headerDataTF.push(<th key={k++} style={{"text-align":"center"}} >{colDatasTF[i]}</th>)
        }
        
        tableHeaderTF.push(<tr key={k++} >{headerDataTF}</tr>)

        // Eval File upload Header
        let tableHeaderEF = []; //make header
        let colDatasEF = ["Train File Name", "Del"]
        let headerDataEF = []
        for (let i=0;i < colDatasEF.length;i++){
            headerDataEF.push(<th key={k++} style={{"text-align":"center"}} >{colDatasEF[i]}</th>)
        }
        
        tableHeaderEF.push(<tr key={k++} >{headerDataEF}</tr>)

        //Train File Upload Data
        let tableDataTF = []; // make tabledata
        for(let rows in listTmpFilePathTrain){
            let colDataTF = [];
            let row = listTmpFilePathTrain[rows]

            for(let cols in row){
                colDataTF.push(<td key={k++} > {row[cols]} </td>) 
            }

            //add delete image
            if(row["filename"] != null){
                colDataTF.push(<td key={k++} > <img style ={{width:20, "cursor":"pointer"}} alt = {row["filename"]}
                                                    onClick={this.fileDeleteTrain.bind(this)} 
                                                    src="./images/del.png" /></td>)
            }
            
            tableDataTF.push(<tr key={k++}>{colDataTF}</tr>)
        }


        let fileTableTF = []
        fileTableTF.push(<thead ref='thead' key={k++} className="center">{tableHeaderTF}</thead>)
        fileTableTF.push(<tbody ref='tbody' key={k++} className="center" >{tableDataTF}</tbody>)

        //Eval File Upload Data
        let tableDataEF = []; // make tabledata
        for(let rows in listTmpFilePathEval){
            let colDataEF = [];
            let row = listTmpFilePathEval[rows]

            for(let cols in row){
                colDataEF.push(<td key={k++} > {row[cols]} </td>) 
            }

            //add delete image
            if(row["filename"] != null){
                colDataEF.push(<td key={k++} > <img style ={{width:20, "cursor":"pointer"}} alt = {row["filename"]}
                                                    onClick={this.fileDeleteEval.bind(this)} 
                                                    src="./images/del.png" /></td>)
            }

            tableDataEF.push(<tr key={k++}>{colDataEF}</tr>)
        }


        let fileTableEF = []
        fileTableEF.push(<thead ref='thead' key={k++} className="center">{tableHeaderEF}</thead>)
        fileTableEF.push(<tbody ref='tbody' key={k++} className="center" >{tableDataEF}</tbody>)
        
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
            headerDataSL.push(<th key={k++} style={{"text-align":"center"}} >{colDatasSL[i]}</th>)
        }
        
        tableHeaderSL.push(<tr key={k++} >{headerDataSL}</tr>)

        //Network Select Data
        let tableDataSL = []; // make tabledata
        for(let rows in nnInfoNewList){
            let colDataSL = [];
            let row = nnInfoNewList[rows]

            colDataSL.push(<td key={k++} > < input type = "radio" name="rd1"
                                                                    value = {row["id"]}
                                                                    onClick={this.handleChangeRadio.bind(this)} 
                                                                    style={{"text-align":"center"}} />  </td>)
            colDataSL.push(<td key={k++} value = {row["id"]} onClick={this.handleChangeRadio.bind(this)} > {row["id"]} </td>) 
            colDataSL.push(<td key={k++} value = {row["id"]} style={{"text-align":"left"}} onClick={this.handleChangeRadio.bind(this)} > {row["desc"]} </td>) 
            let clickUrl = "./images/ico_help.png"
            colDataSL.push(<td key={k++} > <img style ={{width:20, "cursor":"pointer"}} alt = {row["id"]}
                                                onClick={this.viewNetImage.bind(this)} 
                                                src={clickUrl} /></td>)

            tableDataSL.push(<tr key={k++}>{colDataSL}</tr>)
        }


        let nnInfoNewListTable = []
        nnInfoNewListTable.push(<thead ref='thead' key={k++} className="center">{tableHeaderSL}</thead>)
        nnInfoNewListTable.push(<tbody ref='tbody' key={k++} className="center" >{tableDataSL}</tbody>)

        /////////////////////////////////////////////////////////////////////////////////////////
        // Network Config List
        /////////////////////////////////////////////////////////////////////////////////////////
        const jsonData = this.state.jsonData
        const arrayData = this.state.arrayData
        // 테이블 구릅핑에 필요한 수를 넣어준다.
        function setRspanCount(data, colcnt){
            let prev = []
            let redata = data
            for(let i in data){
                let sameflag = "Y"
                for(let j in data[i]){
                    let coldata = data[i][j] // 현재 값의 데이터를 넣어준다.
                    let prevdata = prev[j] // 이전 Row의 Data 값을 넣어준다.
                     if(coldata != null){ // Table Data 가 존재 할 경우
                        coldata.rspancnt += 1
                        prev[j] = coldata
                        
                        if(prevdata != null && prevdata.key == coldata.key && sameflag == "Y"){// 이전 데이터가 있으며 동일할 경우
                            
                        }else{// 앞에서 동일하지 않으면 해당 Row는 더이상 컬럼이 동일하지 않다고 판단해야 한다.
                            sameflag == "N"
                        }
                    }else{//Table Data가 존재 하지 않을 경우 이전 Row값에 Null을 넣어준다. 
                        prev[j] = null
                    }
                }
            }

            return redata
        }

        //테이블에 출력시 정렬을 위해 사용한다.
        function jsonKeySort(data){
            let keys = null
            if(data != null && typeof(data) != "string"){
                keys = Object.keys(data)
                keys.sort()
            }
            
            return keys
        }

        // Json 을 기준으로 빈 노드를 계층구조로 만들어 준다.
        function setNode(ppNode){
            let recnt = 0
            let pNode = null
            let data = ppNode.data
            ppNode.flag = "Y"
            
            if(ppNode.child == null){
                let keyArray1 = jsonKeySort(data)//data를 기준으로 자식을 찾아 소팅해준다.

                let dataType = Object.prototype.toString.call(data)
                if(dataType == "[object Object]" && keyArray1.length == 0 && ppNode.key == "option"){
                    ppNode.data = jsonData
                }else if(dataType == "[object Array]" && keyArray1.length == 0 && ppNode.key == "option"){
                    ppNode.data = arrayData
                }
                for(let key1 in keyArray1){
                    const node ={
                        key : keyArray1[key1],
                        rspancnt:0,
                        next : null,
                        child : null,
                        parents:ppNode,
                        data : data[keyArray1[key1]],
                        prev : null,
                        flag : "N", // Node생성시 사
                        dataflag : "N", // Node Data 입력시 사용 
                        type:""
                    }
                    
                    if(key1 == 0){
                        pNode = node
                        ppNode.child = pNode    
                    }else{
                        node.prev = pNode
                        pNode.next = node
                        pNode = node
                    } 
                }
                
                if(keyArray1 != null){
                    recnt = keyArray1.length
                }
            } 
            
            return recnt
        }

        
        // 노드를 만들어 data 를 넣어 주는 기능을 한다.
        function makeNode(data){
            const rNode ={
                key :"root",
                rspancnt:0,
                next : null,
                child : null,
                parents:null,
                data : null,
                prev : null,
                flag : "N",
                dataflag : "Y",
                type:"",
                colcnt :0
            }
            
            // // Key Make Array
            let checkcnt = 0

            for (let i in data) {// 최초 Root를 만들어준다.
                rNode.data = data[i]
                checkcnt = setNode(rNode)
            }
            
            let node = rNode
            let outcnt = 0
            while(true){
                if(node.child != null && node.child.flag == "N"){ // 자식이 있고 자식이 Load 한 적이 없다면 자식으로 내려간다.
                    node = node.child
                }else if(node.next != null){  
                    node = node.next  
                }else if(node.child == null && node.next == null && node.parents != null){
                    node = node.parents
                }else if(node.child != null && node.child.flag == "Y" && node.parents != null){
                    node = node.parents
                }

                let selflag = "N"
                let tmpnode = node
                while(true){// type이 sel 인 경우는 배열로 표기 되야 해서 Child를 만들면 안된다.
                    if(tmpnode.next != null){
                        tmpnode = tmpnode.next
                    }else{
                        break
                    }

                    if(node.key == "option" && tmpnode.key == "type" && tmpnode.data == "sel"){
                        selflag = "Y"
                    }
                }


                if(selflag == "N"){
                    checkcnt = setNode(node)
                }
                
                if(node.parents == null){
                    break
                }
                
                outcnt += 1
                if(outcnt>3000){
                    break
                }
            }
            return rNode
        }

        // 최종 데이터를 표현하는 Type은 표시하지 않는다. 또한 해당 값은 Option의 Type에 넣어 Numver, String을 판단한다.
        // Auto 값이 false인 경우 표현 하지 않는다. 
        function makeTableData(node){
            // Data Make Array
            let outcnt = 0
            let k = 1
            let nnInfoNewListDetail = []
            while(true){
                if(node.child != null && node.child.dataflag == "N"){
                    node.dataflag = "Y"
                    node = node.child  
                }else if(node.child == null && node.dataflag == "N") {
                    let data = []
                    let tmpnode = node
                    while(true){
                        //Option Type을 넣어줘야 한다.
                        let ttmpnode = tmpnode
                        while(true){
                            if(ttmpnode.next == null){
                                break
                            }
                            ttmpnode = ttmpnode.next
                            if(ttmpnode.key == "type"){
                                tmpnode.type = ttmpnode.data
                            }
                        }
                        // 배열인 경우 상위 부모의 type을 찾아야 한다.
                        if(tmpnode.type == ""){
                            ttmpnode = tmpnode.parents
                            while(true){
                                if(ttmpnode.next == null){
                                    break
                                }
                                ttmpnode = ttmpnode.next
                                if(ttmpnode.key == "type"){
                                    tmpnode.type = ttmpnode.data
                                }
                            }
                        }

                        //Data를 넣어준다.
                        data.push(tmpnode)
                        tmpnode = tmpnode.parents
                        if(tmpnode.parents == null){
                            break
                        }
                    }

                    // 마지막 값부터 저장되어 있는 것을 처음 것부터 쌓이게 변겨해 준다.
                    let redata = []
                    for(let i=data.length-1;i >= 0;i--){
                        redata.push(data[i])
                    }

                    let vflag = "Y"
                    let keydata = redata[redata.length-1]
                    let datatype = Object.prototype.toString.call(keydata.data)

                    if(keydata.key == "type"){ // 마지막에 위치한 Type은 화면에 표시 하지 않는다.
                        vflag = "N"
                    }else if(keydata.key == "auto" && keydata.data == false){// 마지막에 위치한 auto false는 표기하지 않음.
                        vflag = "N"
                    }else if(keydata.key == "option" && keydata.data == null){//option이 Null이면 표기하지 않음.
                        vflag = "N"
                        //auto, option이 모두 없는 경우는 option을 표기해 주어야 한다.
                        let tmpnode = node
                        while(true){
                            if(tmpnode.prev != null){
                                tmpnode = tmpnode.prev
                            }else{
                                break
                            }
                            if(tmpnode.key == "auto" && tmpnode.data == false){
                                vflag = "Y"
                            }
                        }
                    }else if(datatype == "[object Object]" && keydata.type == "sel"){// array는 list로 그림.
                        vflag = "N"
                    }

                    if(vflag == "Y"){
                        nnInfoNewListDetail[k++] = redata
                        if(rNode.colcnt < redata.length){//타이틀 수를 판단해줌. 
                            rNode.colcnt = redata.length
                        }
                    }
                    
                    node.dataflag = "Y"
                }else{
                    if(node.next != null){
                        node = node.next
                    }else{
                        node = node.parents
                    }
                }

                if(node == null || node.parents == null){
                    break
                }

                outcnt += 1
                if(outcnt>3000){
                    break
                }
            }
            rNode.colcnt = rNode.colcnt + 1
            return nnInfoNewListDetail
        }

        // Network List Detail Node를 만들고 Data를 넣어준다.
        let rNode = makeNode(this.state.NN_TableDataDetail)
        // Table에 넣어주는 구조로 Data를 만들어준다.
        let nnInfoNewListDetail = makeTableData(rNode)
        // Table을 만들기 위해 span을 계산해 넣어준다.
        nnInfoNewListDetail = setRspanCount(nnInfoNewListDetail, rNode.colcnt)

        // console.log(rNode)
        // console.log(nnInfoNewListDetail)

        /////////////////////////////////////////////////////////////////////////////////////////
        // NetConf Table Header Make
        /////////////////////////////////////////////////////////////////////////////////////////
        let tableHeader = []; //make header
        let colDatas = ["col1"]
        if(rNode.colcnt > 0){
            colDatas = []
            for(let i=0;i < rNode.colcnt ; i++){
                colDatas.push("col"+(i+1))
            }
        }
        let headerData = []
        for (let i=0;i < colDatas.length;i++){
            headerData.push(<th key={k++} style={{"text-align":"center"}} >{colDatas[i]}</th>)
        }
        
        tableHeader.push(<tr key={k++} >{headerData}</tr>)

        /////////////////////////////////////////////////////////////////////////////////////////
        // NetConf Table Data Make
        /////////////////////////////////////////////////////////////////////////////////////////
        let tableData = []; // make tabledata
        for(let rows in nnInfoNewListDetail){
            let colData = [];

            let rspantext = []

            let row = nnInfoNewListDetail[rows]
            let option = []

            for(let cols in row){
                if(cols == row.length-1){ 
                    colData.push(<td key={k++} rowSpan= {1}> {row[cols].key} </td>)    
                    let rowData = row[cols].data
                    if(Object.prototype.toString.call(rowData) == "[object Array]" && row[cols].type == "sel"){
                        let defaultVal = ""
                        if(row[cols].data.length > 0){
                            defaultVal = rowData[0]
                        }

                        for(let op in rowData){
                            option.push(<option key={k++} value={rowData[op]}>{rowData[op]}</option>)
                        }   

                        colData.push(<td key={k++}>
                                        <div>
                                        <select ref={"sel"+k} onChange={this.handleChange.bind(this)}
                                               id={k} 
                                                defaultValue={defaultVal[0]}
                                               style={{"color":this.state.color}}
                                               rowSpan={1}>
                                           {option}
                                        </select>
                                        </div>
                                    </td>)
                    }else{
                        let datatype = row[cols].type
                        if(datatype == "int"){
                            datatype = "number"
                        }else{
                            datatype = "string"
                        }

                        if(rowData == arrayData){
                            colData.push(<td key={k++} type={datatype} style={{"color":this.state.color}} > {rowData} </td>)
                        }else if(rowData == jsonData){
                            colData.push(<td key={k++} type={datatype} style={{"color":this.state.color}} > {rowData} </td>)
                        }else if(rowData == null){
                            rowData = "null"
                            colData.push(<td key={k++} type={datatype} style={{"color":this.state.color}} > {rowData} </td>)
                        }else{
                            colData.push(<td key={k++} style={{"color":this.state.color}} > < input type = {datatype} style={{"text-align":"center"}} defaultValue = {rowData} />  </td>)
                        }
                        
                    }
                }else{
                    if(row[cols].rspancnt > 0){
                        colData.push(<td key={k++} rowSpan= {row[cols].rspancnt}> {row[cols].key} </td>) 
                        row[cols].rspancnt = 0
                    }   
                }
            }

            //add column
            for(let i=0;i<colDatas.length - row.length-1;i++){
                colData.push(<td key={k++} ></td>) 
            }

            tableData.push(<tr key={k++}>{colData}</tr>)
        }
        

        let nnInfoNewListDetailTable = []
        nnInfoNewListDetailTable.push(<thead ref='thead' key={k++} className="center">{tableHeader}</thead>)
        nnInfoNewListDetailTable.push(<tbody ref='tbody' key={k++} className="center" >{tableData}</tbody>)



    


        return (
            <section>
                <h1 className="hidden">tensor MSA main table</h1>
                <div className="container paddingT10">
                    <div className="tblBtnArea">
                        <button type="button" className="save" onClick={() => this.saveCommonNNInfoNew()} >Save</button>
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

                    <div>
                        <h1> Network File Upload </h1>
                    </div>

                    <div >
                        <FileUpload options={this.optTmpFilePathTrain} >
                            <button ref="chooseAndUpload" id='filetrain' name = 'train'>TrainFileUpload</button>
                        </FileUpload>

                        <div>
                            <table className="table detail" ref= 'master3' >
                                {fileTableTF}
                            </table>
                        </div>

                        {this.state.lineviewTrain ?
                            <div>
                                <h3>Line Progress {this.state.percent}%</h3>
                                <div style={containerStyle}>
                                  <Line percent={this.state.percent} strokeWidth="1" strokeColor={'#3FC7FA'} />
                                </div>
                            </div>
                            :
                            <div>
                            </div>
                        }
                    </div>

                    <div> 
                        <FileUpload options={this.optTmpFilePathEval}>
                            <button ref="chooseAndUpload" id='fileeval' name = 'eval'>EvalFileUpload</button>
                        </FileUpload>
                    </div>

                    <div>
                        <table className="table detail" ref= 'master3' >
                            {fileTableEF}
                        </table>
                    </div>

                    {this.state.lineviewEval ?
                        <div>
                            <h3>Line Progress {this.state.percent}%</h3>
                            <div style={containerStyle}>
                              <Line percent={this.state.percent} strokeWidth="1" strokeColor={'#3FC7FA'} />
                            </div>
                        </div>
                        :
                        <div>
                        </div>
                    }

                    <br></br>








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
                        <tr><td style={{"text-align":"center"}}>
                            <img src = {this.state.isViewImageDetail} style={{"width":"800"}} />
                        </td></tr>
                        </table>
                        </div>
                        :
                        <div>
                        </div>
                    }




                    <div>
                        <h1> Network Config </h1>
                    </div>

                    <div>
                        <table className="table detail" ref= 'master3' >
                            {nnInfoNewListDetailTable}
                        </table>
                    </div>
                </div>
            </section>

        );
    }
}

NN_InfoNewComponent.defaultProps = {
    reportRepository: new ReportRepository(new Api())
};



