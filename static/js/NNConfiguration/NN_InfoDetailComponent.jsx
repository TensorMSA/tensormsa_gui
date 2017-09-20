import React from 'react'
import ReportRepository from './../repositories/ReportRepository'
import Api from './../utils/Api'
import FileUploadComponent from './../NNLayout/common/FileUploadComponent'
import JsonConfComponent from './../NNLayout/common/JsonConfComponent'
import NN_InfoDetailStackBar from './../NNConfiguration/NN_InfoDetailStackBar'
import NN_InfoDetailLine from './../NNConfiguration/NN_InfoDetailLine'
import NN_InfoDetailMemoModal from './../NNConfiguration/NN_InfoDetailMemoModal';
import { Line, LineChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {Pie} from 'react-chartjs-2';
import Modal from 'react-modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.scss';

export default class NN_InfoDetailComponent extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            tableData: null,
            NN_TableWFData: null,
            NN_TableNodeData: null,
            NN_TableNodeDataSort: null,
            NN_TableColArr1:[    {index:0,      id:"sel",               name:"Sel"}
                                ,{index:1,      id:"nn_wf_ver_id",      name:"Network Version"}
                                ,{index:2,      id:"active_flag",       name:"Active"}
                                ,{index:3,      id:"train_batch_ver_id",name:"Train Batch"}
                                ,{index:4,      id:"train_acc_info",    name:"Train Batch Acc"}
                                ,{index:5,      id:"train_loss_info",   name:"Train Batch Loss"}
                                ,{index:6,      id:"train_model_exists",name:"Train Model"}
                                ,{index:7,      id:"pred_batch_ver_id", name:"Predict Batch"}
                                ,{index:8,      id:"pred_acc_info",     name:"Predict Batch Acc"}
                                ,{index:9,      id:"pred_loss_info",    name:"Predict Batch Loss"}
                                ,{index:10,     id:"pred_model_exists", name:"Predict Model"}
                                ,{index:11,     id:"batch"            , name:"Batch"}
                                ,{index:12,     id:"nn_wf_ver_desc"   , name:"Memo"}
                                ,{index:13,     id:"train", name:"Train"}
                            ],
            NN_TableBTData: null,
            NN_TableColArr2:[    {index:0,      id:"nn_batch_ver_id",   name:"Batch Version"}
                                ,{index:1,      id:"eval_flag",         name:"Train Active"}
                                ,{index:2,      id:"active_flag",       name:"Predict Active"}
                                ,{index:3,      id:"acc_info",          name:"Batch Acc"}
                                ,{index:4,      id:"loss_info",         name:"Batch Loss"}
                                ,{index:5,      id:"true_cnt",          name:"True Count"}
                                ,{index:6,      id:"true_false_cnt",    name:"Total Count"}
                                ,{index:7,      id:"true_false_percent",name:"Total Percent"}
                                ,{index:8,      id:"model",             name:"Network Model"}
                            ],
            NN_TableColArr3:[],
            nn_id:null,
            nn_wf_ver_id:null,
            nn_batch_id:null,
            train_node_name:null,
            eval_node_name:null,
            nn_title:null,
            nn_titlebt:"Network Batch List ",
            nodeType:null,
            netType:null,
            isViewBatch:false,
            isViewFile:true,
            color:"black",
            acclossLineChartBTData:null,
            tBarChartBTData:null,
            pBarChartBTData:null,
            modalViewMenu : null,
            openModalFlag : false,
            tabIndex : 1,
            active_color : "#14c0f2"
        };
        this.closeModal = this.closeModal.bind(this);
    }
    /////////////////////////////////////////////////////////////////////////////////////////
    // Common Function
    /////////////////////////////////////////////////////////////////////////////////////////
    findColInfo(idxTable, idxType, idxName){// 테이블 컬럼의 인덱스를 넘겨 준다.
        let col = this.state.NN_TableColArr1
        if(idxTable == 2){
            col = this.state.NN_TableColArr2
        }else if(idxTable == 3){
            col = this.state.NN_TableColArr3
        }

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
    /////////////////////////////////////////////////////////////////////////////////////////
    // Top Button Function
    /////////////////////////////////////////////////////////////////////////////////////////
    fileView(){
        if(this.state.isViewFile == true){
            this.setState({ isViewFile: false })
        }else{
            this.setState({ isViewFile: true })
        }
    }
    
    addVersion(){//Version New를 생성해준다.
        let re = confirm( "Are you create version?" )
        if(re == true){
            // // WF 신규 생성 Make NN WF Info
            // let wfparam = {}
            // wfparam["nn_def_list_info_nn_id"] = ""
            // wfparam["nn_wf_ver_info"] = "init"
            // wfparam["condition"] = "1"
            // wfparam["active_flag"] = "N"

            // // Make NN WF Node Info
            // let nodeparam = {}
            // nodeparam["type"] = this.state.netType

            // this.props.reportRepository.postCommonNNInfoWF(this.state.nn_id, wfparam).then((wf_ver_id) => {
            //     // Make NN WF Node Info
            //     this.props.reportRepository.postCommonNNInfoWFNode(this.state.nn_id, wf_ver_id, nodeparam).then((tableData) => {
            //         this.getCommonNNInfoWF(this.state.nn_id)
            //         });
            // });

            //Run AutoML
            this.props.reportRepository.postCommonNNInfoAuto(this.state.nn_id).then((tableData) => {
            
            });
        }
    }

    saveData(){//Save
        let re = confirm( "Are you Save?" )
        if(re == true){
            //Version Active Flag Save
            let vbody = this.refs.master2.children[1].children
            for(let i=0 ; i < vbody.length; i++){
                let col = vbody[i].children
                let ver = col[this.findColInfo("1", "id", "nn_wf_ver_id").index].attributes.alt.value // version id key column
                let active = col[this.findColInfo("1", "id", "active_flag").index].childNodes[0].childNodes[0].selectedOptions[0].value // Active column

                if(active == "Y"){
                    let wfparam = {}
                    wfparam["nn_wf_ver_id"] = ver
                    wfparam["nn_def_list_info_nn_id"] = ""
                    wfparam["nn_wf_ver_info"] = "init"
                    wfparam["condition"] = "1"
                    wfparam["active_flag"] = "Y"
                    // Version Active 변경.

                    this.props.reportRepository.putCommonNNInfoWF(this.state.nn_id, wfparam).then((tableData) => {
                        this.getCommonNNInfoWF(this.state.nn_id)
                    });
                }
            }
            
            //Batch Active, Eval Flag Save
            let nn_id = this.state.nn_id
            let nn_wf_ver_id = this.state.nn_wf_ver_id
            vbody = this.refs.master3.children[1].children
            for(let i=0 ; i < vbody.length; i++){
                let col = vbody[i].children
                let batch = col[this.findColInfo("2", "id", "nn_batch_ver_id").index].attributes.alt.value // version id key column
                let evalb = col[this.findColInfo("2", "id", "eval_flag").index].childNodes[0].childNodes[0].selectedOptions[0].value // Eval column
                let activeb = col[this.findColInfo("2", "id", "active_flag").index].childNodes[0].childNodes[0].selectedOptions[0].value // Active column

                let wfparam = {}
                wfparam["nn_batch_ver_id"] = batch
                wfparam["eval_flag"] = evalb
                wfparam["active_flag"] = activeb
                // Version Active 변경.

                this.props.reportRepository.putCommonNNInfoBatch(this.state.nn_id, this.state.nn_wf_ver_id, wfparam).then((tableData) => {
                });

            }

            //Config Save
            let params = this.refs.netconfig.getConfigData()
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////
    // Search Function
    /////////////////////////////////////////////////////////////////////////////////////////
    componentDidMount() {
        this.getCommonNNInfoWF()
    }

    getCommonNNInfoWF() {
        if(this.state.nn_id == null || this.state.nn_id == "init"){//Version 정보 없이 메뉴가 선택 되면 아무것도 보여주지 않는다.
            this.setState({ nn_title: "Please, Check Network" })
        }else{
            this.props.reportRepository.getCommonNNInfo(this.state.nn_id).then((tableData) => {// Network Info
                this.state.nn_title = tableData[0]["nn_title"]+" (Net ID : "+this.state.nn_id+")"
                this.state.netType = tableData[0]["dir"]
                this.props.reportRepository.getCommonNNInfoWF(this.state.nn_id).then((tableData) => {// Network Version Info
                    this.setState({ NN_TableWFData: tableData })
                    this.setBatchLineChartData(tableData)
                    for(let i in tableData){
                        if(tableData[i].active_flag == "Y"){//active version을 선택해준다.
                            this.clickSeletVersion(tableData[i].nn_wf_ver_id)  
                        }
                    }
                });
            });
        }   
    }

    getCommonBatchInfo(ver) {
        function pad(n, width) {
          n = n + '';
          return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
        }

        this.props.reportRepository.getCommonNNInfoBatch(this.state.nn_id, ver).then((tableData) => {// Network Batch Info
            this.state.nn_titlebt = "Network Batch List"+" (Ver ID : "+ver+")"
            //Batch Sort ID를 만들어주어야 한다.nn000000001_1_1
            for(let i in tableData){
                if(tableData[i]["nn_batch_ver_id"] != null){
                    let split1 = ""
                    let split2 = ""
                    let splitData = tableData[i]["nn_batch_ver_id"].split("_")
                    let split0 = splitData[0]
                    if(splitData[1] != null && isNaN(splitData[1]) == false){
                        split1 = pad(splitData[1], 10)
                        split0 += "_"+split1
                    }
                    if(splitData[2] != null && isNaN(splitData[2]) == false){
                        split2 = pad(splitData[2], 10)
                        split0 += "_"+split2
                    }
                    tableData[i]["nn_batch_ver_id_sort"] = split0
                }
                
            }
            this.setState({ NN_TableBTData: tableData })
        });
    }

    getCommonNodeInfo(ver) {
        this.props.reportRepository.getCommonNNInfoWFNode(this.state.nn_id, ver, "all").then((tableData) => {// Network Node Info
            this.setState({ NN_TableNodeData: tableData })
        });
    }
    /////////////////////////////////////////////////////////////////////////////////////////
    // Version Table Action
    /////////////////////////////////////////////////////////////////////////////////////////   
    clickChangeVersion(value){//Version 이 변경 되면 해당 버전을 Check 해주고 Batch Node를 새로 조회 한다.
        let table = this.refs.master2
        for(let i=1 ; i < table.rows.length ; i++){
            let key = table.rows[i].children[0].children.rd1
            if(key.alt == value){
                key.checked = true
            }
        }

        this.state.nodeType = null //Node Table의 Title을 없애준다.
        this.state.nn_wf_ver_id = value
        this.state.NN_TableNodeDataSort = null
        this.getCommonBatchInfo(value)// Batch를 조회해준다.
        this.getCommonNodeInfo(value)// Node 정보를 가져와 뿌려준다.Active version의 Node를 가져온다.
        this.setBatchBarChartData(value)//chart정보를 만들어 뿌려준다.

        //클릭된 Batch 번호를 가져와 Title표시를 해주주어야 한다.
        for(let i in this.state.NN_TableWFData){
            if(value == this.state.NN_TableWFData[i]["nn_wf_ver_id"]){
                this.state.nn_batch_id = this.state.NN_TableWFData[i]["train_batch_ver_id"]
            }
            
        }
    }

    clickSeletVersion(selectedValue){//Version을 선택하면 새로 조회 한다.   
        let value = selectedValue
        if(value.target != undefined){
            value = selectedValue.target.attributes.alt.value   
        }
        this.clickChangeVersion(value)
        this.state.isViewBatch = false
    }

    clickTrainVersion(selectedValue){//Version Train을 선택했을때 훈련을 하고 재 조회 해준다. ..
        let value = selectedValue
        if(value.target != undefined){
            value = selectedValue.target.attributes.alt.value
            
            //학습을 해준다.
            let re = confirm( "Are you Train?" )
            if(re == true){
                // 기존에 실행 되고 있는 Train이 있으면 안돌게 해야 한다.
                // 돌리려고 하는 Batch version 모델이 없으면 안된다.
                this.props.reportRepository.postTainRun(this.state.nn_id, value).then((tableData) => {
                });
            }
            this.clickChangeVersion(value)
        }        
    }

    handleChangeSelWF(selectedValue){//Version Active가 Y가 되면 다른 Y를 N으로 변경해 준다
        let value = selectedValue.target.value //active select cell
        let table = this.refs.master2
        if(value != undefined && value == "Y"){// key, desc cell
            let changekey = selectedValue.target.attributes.name.value // 변경된 Cell 키값 
            for(let i=1 ; i < table.rows.length ; i++){
                let key = table.rows[i].children[this.findColInfo("1", "id", "nn_wf_ver_id").index].attributes.alt.value
                let changvalue = table.rows[i].children[this.findColInfo("1", "id", "active_flag").index].children[0].children[0]
                if(key != changekey){// Y로 변경한 Cell 이 아니라면 
                    changvalue.value = "N"//N으로 변경을 해준다.
                }
            }
        }
    }

    closeModal() { 
        this.setState({openModalFlag: false})
    }

    clickOpenModalMenu(selectedValue){
        let value = selectedValue
        if(value.target != undefined){
            value = selectedValue.target.attributes.alt.value
            this.setState({modalViewMenu : <NN_InfoDetailMemoModal closeModal={this.closeModal} 
                                                                nn_id={this.state.nn_id}
                                                                nn_wf_ver_id={value}/>})
            this.setState({openModalFlag: true})
        }
        
    }

    batchView(selectedValue){
        let tfflage = this.state.isViewBatch
        if(selectedValue.target.alt != this.state.nn_wf_ver_id){
            tfflage = false
        }
        this.clickSeletVersion(selectedValue)

        if(tfflage == false){
            this.setState({ isViewBatch: true })
        }


    }

    /////////////////////////////////////////////////////////////////////////////////////////
    // Version Line Chart
    /////////////////////////////////////////////////////////////////////////////////////////
    setBatchLineChartData(data){
        this.state.acclossLineChartBTData = []

        for(let rows in data){
            let row = data[rows]
            let cTrainacc = 0
            let cTrainloss = 0
            let cPredacc = 0
            let cPredloss = 0   
            let ver = row["nn_wf_ver_id"]
            if(row["train_acc_info"] != null){
                cTrainacc=row["train_acc_info"].acc*1
            }
            if(row["train_loss_info"] != null){
                cTrainloss=row["train_loss_info"].loss*1
            }
            if(row["pred_acc_info"] != null){
                cPredacc=row["pred_acc_info"].acc*1
            }
            if(row["pred_loss_info"] != null){
                cPredloss=row["pred_loss_info"].loss*1
            }

            this.state.acclossLineChartBTData.push({name: ver, TrainAcc: cTrainacc, TrainLoss: cTrainloss, PredictAcc: cPredacc, PredictLoss: cPredloss})
            
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////
    // Version Batch Bar Chart
    /////////////////////////////////////////////////////////////////////////////////////////   
    setBatchBarChartData(ver){
        for(let i in this.state.NN_TableWFData){
            if(this.state.NN_TableWFData[i]["nn_wf_ver_id"] == ver){
                this.state.tBarChartBTData = this.state.NN_TableWFData[i]["t_result_info"]
                this.state.pBarChartBTData = this.state.NN_TableWFData[i]["p_result_info"]
            }
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////
    // Batch Table Action
    /////////////////////////////////////////////////////////////////////////////////////////  
    handleChangeSelBTE(selectedValue){//Batch Train Active가 Y가 되면 다른 Y를 N으로 변경해 준다.
        let value = selectedValue.target.value //active select cell
        let table = this.refs.master3
        if(value != undefined && value == "Y"){// key, desc cell
            let changekey = selectedValue.target.attributes.name.value // 변경된 Cell 키값 
            for(let i=1 ; i < table.rows.length ; i++){
                let key = table.rows[i].children[this.findColInfo("2", "id", "nn_batch_ver_id").index].attributes.alt.value
                let changvalue = table.rows[i].children[this.findColInfo("2", "id", "eval_flag").index].children[0].children[0]
                if(key != changekey){// Y로 변경한 Cell 이 아니라면 
                    changvalue.value = "N"//N으로 변경을 해준다.
                }
            }
        }
    }

    handleChangeSelBTA(selectedValue){//Batch Predict Active가 Y가 되면 다른 Y를 N으로 변경해 준다.
        let value = selectedValue.target.value //active select cell
        let table = this.refs.master3
        if(value != undefined && value == "Y"){// key, desc cell
            let changekey = selectedValue.target.attributes.name.value // 변경된 Cell 키값 
            for(let i=1 ; i < table.rows.length ; i++){
                let key = table.rows[i].children[this.findColInfo("2", "id", "nn_batch_ver_id").index].attributes.alt.value
                let changvalue = table.rows[i].children[this.findColInfo("2", "id", "active_flag").index].children[0].children[0]
                if(key != changekey){// Y로 변경한 Cell 이 아니라면 
                    changvalue.value = "N"//N으로 변경을 해준다.
                }
            }
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////
    // Node Table Action
    /////////////////////////////////////////////////////////////////////////////////////////  
    clickNodeConfig(selectedValue){//Node를 선택했을때 Config 리스트를 보여준다.
        let table = this.refs.master4
        let value = selectedValue
        if(value.target != undefined){
            value = selectedValue.target.attributes.alt.value
        }

        console.log(value)
        this.state.nodeType = value

        let nodeData = this.state.NN_TableNodeData

        for(let i in nodeData){
            let nodename = nodeData[i]["fields"]["nn_wf_node_name"]
            let nodeconfig = {"0":nodeData[i]["fields"]["node_config_data"]}
            if(value == nodename){
                this.setState({ NN_TableNodeDataSort : nodeconfig })
            }
        }
    }

    networkSelectTab(value){
        // let tab = value.target.innerText
        value = value.tabIndex + 1
        this.setState({ tabIndex: value })
    }

    render() {
        let batchImg = "./images/ico_menu05.png"
        let memoImg = "./images/ico_menu06.png"

        this.state.nn_id = this.props.nn_id
        /////////////////////////////////////////////////////////////////////////////////////////
        // Common Function
        /////////////////////////////////////////////////////////////////////////////////////////
        let k = 1
        
        function sortByKey(array, key) {// Data sort key
            return array.sort(function(a, b) {
                var x = a[key]; var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        }

        function sortData(data, id){// Data sort
            let nnInfoNewList = [];
            if (data != null) {
                for (var i in data) {
                    nnInfoNewList[i] = data[i];
                }
            }

            nnInfoNewList = sortByKey(nnInfoNewList, id);
            return nnInfoNewList
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
        // Version Table Data Make
        /////////////////////////////////////////////////////////////////////////////////////////
        this.state.NN_TableWFData = sortData(this.state.NN_TableWFData, "nn_wf_ver_id")
        let tableHeader = makeHeader(this.state.NN_TableColArr1)

        //Network Select Data
        let tableData = []; // make tabledata
        let optionYN = []
        optionYN.push(<option key={k++} value={"Y"}>{"Y"}</option>)
        optionYN.push(<option key={k++} value={"N"}>{"N"}</option>)

        for(let rows in this.state.NN_TableWFData){
            let colData = [];
            let row = this.state.NN_TableWFData[rows]
            let trainacc = ""
            let trainloss = ""
            let predacc = ""
            let predloss = ""

            if(row["train_acc_info"] != null){
                trainacc = row["train_acc_info"].acc
            }
            if(row["train_loss_info"] != null){
                trainloss = row["train_loss_info"].loss
            }
            if(row["pred_acc_info"] != null){
                predacc = row["pred_acc_info"].acc
            }
            if(row["pred_loss_info"] != null){
                predloss = row["pred_loss_info"].loss
            }

            if(row["active_flag"] == "Y"){
                this.state.color = this.state.active_color
            }else{
                this.state.color = "black"
            }

            colData.push(<td key={k++} width="50" > < input type = "radio" name="rd1"
                                                                    alt = {row["nn_wf_ver_id"]} 
                                                                    onClick = {this.clickSeletVersion.bind(this)}
                                                                    style={{"textAlign":"center", "width":"100%"}} />  </td>)
            colData.push(<td key={k++} alt = {row["nn_wf_ver_id"]} 
                                        onClick = {this.clickSeletVersion.bind(this)} > {row["nn_wf_ver_id"]} </td>)
              
            colData.push(<td key={k++} width="80" >
                                        <div>
                                        <select ref={"sel"+k} onChange={this.handleChangeSelWF.bind(this)}
                                                alt = {row["nn_wf_ver_id"]} 
                                                onClick = {this.clickSeletVersion.bind(this)}
                                                id={k} 
                                                defaultValue={row["active_flag"]}
                                                name = {row["nn_wf_ver_id"]}
                                                style={{"color":this.state.color, "width":"100%", "fontWeight":"bold"}}
                                                rowSpan={1}>
                                           {optionYN}
                                        </select>
                                        </div>
                                    </td>)
            colData.push(<td key={k++} alt = {row["nn_wf_ver_id"]} 
                                        onClick = {this.clickSeletVersion.bind(this)} > {row["train_batch_ver_id"]} </td>)
            colData.push(<td key={k++} alt = {row["nn_wf_ver_id"]} 
                                        onClick = {this.clickSeletVersion.bind(this)} > {trainacc} </td>)
            colData.push(<td key={k++} alt = {row["nn_wf_ver_id"]} 
                                        onClick = {this.clickSeletVersion.bind(this)} > {trainloss} </td>)
            colData.push(<td key={k++} alt = {row["nn_wf_ver_id"]} 
                                        onClick = {this.clickSeletVersion.bind(this)} > {row["train_model_exists"]} </td>)
            colData.push(<td key={k++} alt = {row["nn_wf_ver_id"]} 
                                        onClick = {this.clickSeletVersion.bind(this)} > {row["pred_batch_ver_id"]} </td>)
            colData.push(<td key={k++} alt = {row["nn_wf_ver_id"]} 
                                        onClick = {this.clickSeletVersion.bind(this)} > {predacc} </td>)
            colData.push(<td key={k++} alt = {row["nn_wf_ver_id"]} 
                                        onClick = {this.clickSeletVersion.bind(this)} > {predloss} </td>)
            colData.push(<td key={k++} alt = {row["nn_wf_ver_id"]} 
                                        onClick = {this.clickSeletVersion.bind(this)} > {row["train_model_exists"]} </td>)
            colData.push(<td key={k++} > <img style ={{width:20, "cursor":"pointer"}} alt = {row["nn_wf_ver_id"]}
                                                onClick={this.batchView.bind(this)} 
                                                src={batchImg} /></td>)
            colData.push(<td key={k++} > <img style ={{width:20, "cursor":"pointer"}} alt = {row["nn_wf_ver_id"]}
                                                onClick={this.clickOpenModalMenu.bind(this)} 
                                                src={memoImg} /></td>)
            colData.push(<td key={k++} width="50" > < input type = "button" name="btn2"
                                                                    alt = {row["nn_wf_ver_id"]} 
                                                                    value = {"Train"}
                                                                    onClick = {this.clickTrainVersion.bind(this)}
                                                                    style={{"textAlign":"center", "width":"100%"}} /></td>)
            tableData.push(<tr key={k++}>{colData}</tr>)
        }

        let wfInfoListTable = []
        wfInfoListTable.push(<thead ref='thead' key={k++} className="center">{tableHeader}</thead>)
        wfInfoListTable.push(<tbody ref='tbody' key={k++} className="center" >{tableData}</tbody>)
        /////////////////////////////////////////////////////////////////////////////////////////
        // Batch Table Data Make
        /////////////////////////////////////////////////////////////////////////////////////////
        this.state.NN_TableBTData = sortData(this.state.NN_TableBTData, "nn_batch_ver_id_sort")
        tableHeader = makeHeader(this.state.NN_TableColArr2)

        tableData = []
        for(let rows in this.state.NN_TableBTData){
            let colData = [];
            let row = this.state.NN_TableBTData[rows]
            let acc = ""
            let loss = ""
            
            if(row["acc_info"] != null){
                acc = row["acc_info"].acc
            }
            if(row["loss_info"] != null){
                loss = row["loss_info"].loss
            }

            if(row["eval_flag"] == "Y" || row["active_flag"] == "Y"){
                this.state.color = this.state.active_color
            }else{this.state.color = "black"}
            colData.push(<td key={k++} alt={row["nn_batch_ver_id"]} style={{"color":this.state.color, "fontWeight":"bold"}}> {row["nn_batch_ver_id"]} </td>)

            if(row["eval_flag"] == "Y"){
                this.state.color = this.state.active_color
            }else{this.state.color = "black"}
            colData.push(<td key={k++} width="120" >
                                        <div>
                                        <select ref={"sel"+k} onChange={this.handleChangeSelBTE.bind(this)}
                                                id={k} 
                                                alt={row["nn_batch_ver_id"]} 
                                                defaultValue={row["eval_flag"]}
                                                name = {row["nn_batch_ver_id"]}
                                                style={{"color":this.state.color, "width":"100%", "fontWeight":"bold"}}
                                                rowSpan={1}>
                                           {optionYN}
                                        </select>
                                        </div>
                                    </td>)

            if(row["active_flag"] == "Y"){
                this.state.color = this.state.active_color
            }else{this.state.color = "black"}
            colData.push(<td key={k++} width="120" >
                                        <div>
                                        <select ref={"sel"+k} onChange={this.handleChangeSelBTA.bind(this)}
                                                id={k} 
                                                alt={row["nn_batch_ver_id"]} 
                                                defaultValue={row["active_flag"]}
                                                name = {row["nn_batch_ver_id"]}
                                                style={{"color":this.state.color, "width":"100%", "fontWeight":"bold"}}
                                                rowSpan={1}>
                                           {optionYN}
                                        </select>
                                        </div>
                                    </td>)

            colData.push(<td key={k++} alt={row["nn_batch_ver_id"]} > {acc} </td>)

            colData.push(<td key={k++} alt={row["nn_batch_ver_id"]} > {loss} </td>)

            colData.push(<td key={k++} alt={row["nn_batch_ver_id"]} > {row["true_cnt"]} </td>)

            colData.push(<td key={k++} alt={row["nn_batch_ver_id"]} > {row["true_false_cnt"]} </td>)

            colData.push(<td key={k++} alt={row["nn_batch_ver_id"]} > {row["true_false_percent"]} % </td>)

            if(row["eval_flag"] == "Y" || row["active_flag"] == "Y"){
                this.state.color = this.state.active_color
            }else{this.state.color = "black"}
            colData.push(<td key={k++} alt={row["nn_batch_ver_id"]} style={{"color":this.state.color, "fontWeight":"bold"}}> {row["model"]} </td>)

            tableData.push(<tr key={k++}>{colData}</tr>)
        }

        let batchInfoListTable = []
        batchInfoListTable.push(<thead ref='thead' key={k++} className="center">{tableHeader}</thead>)
        batchInfoListTable.push(<tbody ref='tbody' key={k++} className="center" >{tableData}</tbody>)
        /////////////////////////////////////////////////////////////////////////////////////////
        // Node Table Data Make
        /////////////////////////////////////////////////////////////////////////////////////////
        let nodeData = null
        tableHeader = []
        tableData = []
        if(this.state.NN_TableNodeData != null){
            let node = {}
            for(let i in this.state.NN_TableNodeData){
                node[i] = this.state.NN_TableNodeData[i]["fields"]
                if(node[i]["nn_wf_node_desc"] == "train_data"){
                    this.state.train_node_name = node[i]["nn_wf_node_name"] 
                }else if(node[i]["nn_wf_node_desc"] == "eval_data"){
                    this.state.eval_node_name = node[i]["nn_wf_node_name"] 
                }
            }
            nodeData = sortData(node, "nn_wf_node_name")

            this.state.NN_TableColArr3 = []
            for(let i=0; i < nodeData.length; i++){
                let nodejson = {"index":i, "id":"nn_wf_node_name","name":nodeData[i]["nn_wf_node_name"],"config":nodeData[i]["node_config_data"]}
                this.state.NN_TableColArr3.push(nodejson)
            }

            tableHeader = makeHeader(this.state.NN_TableColArr3)
            let colData = []

            for (let i=0 ;i < this.state.NN_TableColArr3.length ; i++){
                let config = Object.keys(this.state.NN_TableColArr3[i]["config"]).length
                if(config > 0){
                    config = "Y"
                }else{
                    config = "N"
                }
                if(config == "N"){
                    colData.push(<td key={k++} alt={this.state.NN_TableColArr3[i]["name"]} > {config} </td>)
                }else{
                    colData.push(<td key={k++} alt={this.state.NN_TableColArr3[i]["name"]} 
                                     onClick = {this.clickNodeConfig.bind(this)}
                                     style={{"color":this.state.active_color, "fontWeight":"bold", "cursor":"pointer"}}> {config} </td>)
                }
                
            }
            tableData.push(<tr key={k++}>{colData}</tr>)
        }

        let nodeInfoListTable = []
        nodeInfoListTable.push(<thead ref='thead' key={k++} className="center">{tableHeader}</thead>)
        nodeInfoListTable.push(<tbody ref='tbody' key={k++} className="center" >{tableData}</tbody>)

        return (  

            <section>
            <div className="container paddingT10">
                
                <div className="tblBtnArea">
                    <button type="button" className="addnew" onClick={() => this.addVersion() } >Add Ver</button>
                    <button type="button" className="save" onClick={() => this.saveData()} >Save</button>
                </div>
                

                <h1> {this.state.nn_title} </h1>    
                <table style={{ "width":"100%" }} ><tr><td>
                <div style={{ "overflow":"auto", "height":300}}>      
                    <table className="table detail" ref= 'master2'  >
                    
                        {wfInfoListTable}
                    
                    </table>
                </div>
                </td></tr></table>
                    <Modal className="modal" overlayClassName="modal" isOpen={this.state.openModalFlag}
                            onRequestClose={this.closeModal}
                            contentLabel="Modal" >
                        <div className="modal-dialog modal-lg">
                          {this.state.modalViewMenu}
                        </div>
                    </Modal>    

                {this.state.isViewBatch ?
                    <div>
                    <br style={{ "height":20}}></br>
                    <h1> {this.state.nn_titlebt} </h1>
                    <table className="table detail" ref= 'master3' >
                        {batchInfoListTable}
                    </table>
                    </div>
                    :
                    <div>
                    </div>
                }

                <Tabs defaultIndex={0}  onSelect={tabIndex => this.networkSelectTab({ tabIndex })} >
                <TabList>
                  <Tab>Version List</Tab>
                  <Tab>Auto ML List</Tab>
                </TabList>

                <TabPanel>
                    <div>
                        <h1> Train Model Accuracy chart ({this.state.nn_batch_id})</h1>
                        <NN_InfoDetailStackBar ref="stackbar" NN_Data={this.state.tBarChartBTData} />
                    </div>
                </TabPanel>
                <TabPanel>
                    <div>
                        <h1> Auto ML ({this.state.nn_batch_id})</h1>
                        <NN_InfoDetailLine ref="line" NN_Data={this.state.tBarChartBTData} />
                    </div>
                </TabPanel>
                </Tabs>

                {this.state.isViewFile ?
                    <div ref="fileUploadDiv">
                        <table className="table detail">
                        <tr>
                        <td style={{"verticalAlign":"top"}}>
                        <h1> Network Train Source File Upload </h1>
                        <FileUploadComponent ref="trainfilesrc" 
                                                nn_id={this.state.nn_id} 
                                                nn_wf_ver_id={this.state.nn_wf_ver_id} 
                                                nn_node_name={this.state.train_node_name} 
                                                nn_path_type={"source"}
                                                uploadbtnflag={true} 
                                                deletebtnflag={true} />
                        </td>

                        <td style={{"verticalAlign":"top"}}>
                        <h1> Network Eval Source File Upload </h1>
                        <FileUploadComponent ref="evalfilesrc" 
                                                nn_id={this.state.nn_id} 
                                                nn_wf_ver_id={this.state.nn_wf_ver_id} 
                                                nn_node_name={this.state.eval_node_name} 
                                                nn_path_type={"source"}
                                                uploadbtnflag={true} 
                                                deletebtnflag={true} />
                        </td>

                        </tr>

                        <tr>
                        <td style={{"verticalAlign":"top"}}>
                        <h1> Network Train Store File Upload </h1>
                        <FileUploadComponent ref="trainfilestr" 
                                                nn_id={this.state.nn_id} 
                                                nn_wf_ver_id={this.state.nn_wf_ver_id} 
                                                nn_node_name={this.state.train_node_name} 
                                                nn_path_type={"store"}
                                                uploadbtnflag={false} 
                                                deletebtnflag={true} />
                        </td>

                        <td style={{"verticalAlign":"top"}}>
                        <h1> Network Eval Store File Upload </h1>
                        <FileUploadComponent ref="evalfilestr" 
                                                nn_id={this.state.nn_id} 
                                                nn_wf_ver_id={this.state.nn_wf_ver_id} 
                                                nn_node_name={this.state.eval_node_name} 
                                                nn_path_type={"store"}
                                                uploadbtnflag={false} 
                                                deletebtnflag={true} />
                        </td>

                        </tr>


                        </table>
                    </div>
                    :
                    <div>
                    </div>
                }

                <div>
                    <h1> Network Node Info </h1>
                    <table className="table detail" ref= 'master4' >
                        {nodeInfoListTable}
                    </table>
                </div>

                <div>
                    <h1> Network Config ({this.state.nodeType}) </h1>
                    <JsonConfComponent ref="netconfig" editable="N" NN_TableDataDetail={this.state.NN_TableNodeDataSort} />
                </div>


            </div>
            </section>
        )
    }
}

NN_InfoDetailComponent.defaultProps = {
    reportRepository: new ReportRepository(new Api())
};

