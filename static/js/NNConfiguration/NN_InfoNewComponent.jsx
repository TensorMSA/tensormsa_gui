import React from 'react';
import Api from './../utils/Api'
import Modal from 'react-modal';
import ReportRepository from './../repositories/ReportRepository'
import FileUploadComponent from './../NNLayout/common/FileUploadComponent'
import JsonConfComponent from './../NNLayout/common/JsonConfComponent'
import NN_InfoNewCompDetail1 from './../NNConfiguration/NN_InfoNewCompDetail1'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.scss';

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
            train_node_name:null,
            eval_node_name:null,
            tmp_train_node_name:"tmpTrainNodeName",
            tmp_eval_node_name:"tmpEvalNodeName",
            NN_TableColArr1:[    {index:0,      id:"title",                 name:"Title"}
                                ,{index:1,      id:"input_data",            name:"Input Data"}
                                ,{index:2,      id:"example",               name:"Example"}
                            ],
            tabIndex:1
        };
    }

    // 최초 1회 실행하여 Network Config List를 가져온다.
    componentDidMount(){
        this.props.setActiveItem("init",null,null,null,null,null,null,null);
        // 파일 임시 저장소를 만들어 가져와 준다.
        this.props.reportRepository.getFileUpload(this.state.tmp_train_node_name, "1", "1", "tmp").then((tableData) => {
            // this.state.train_node_name = tableData["path"]
            this.setState({ train_node_name: tableData["path"] })
        });
        this.props.reportRepository.getFileUpload(this.state.tmp_eval_node_name, "1", "1", "tmp").then((tableData) => {
            // this.state.eval_node_name = tableData["path"]
            this.setState({ eval_node_name: tableData["path"] })
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
        let refsTab = ""
        if(this.state.tabIndex == 1){
            refsTab = this.refs.netDetail1
        }else if(this.state.tabIndex == 2){
            refsTab = this.refs.netDetail2
        }else if(this.state.tabIndex == 3){
            refsTab = this.refs.netDetail3
        }

        let netType = refsTab.state.netType
        if(flag == "T" && (netType == null || netType == "")){ 
            alert( "Select a Network Type") 
            return
        }

        let params = refsTab.refs.netconfig.getConfigData("auto")
        
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

    networkSelectTab(value){
        // let tab = value.target.innerText
        value = value.tabIndex + 1
        this.setState({ tabIndex: value })
    }

    render() {
        let k = 1
        /////////////////////////////////////////////////////////////////////////////////////////
        // First Network Default
        /////////////////////////////////////////////////////////////////////////////////////////
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

                    <Tabs defaultIndex={0}  onSelect={tabIndex => this.networkSelectTab({ tabIndex })} >
                    <TabList>
                      <Tab>Frame</Tab>
                      <Tab>Image</Tab>
                      <Tab>NLP</Tab>
                    </TabList>

                    <TabPanel>
                        <NN_InfoNewCompDetail1 ref="netDetail1" 
                                                tabIndex={this.state.tabIndex} 
                                                train_node_name={this.state.train_node_name}
                                                eval_node_name={this.state.eval_node_name}
                                                tmp_train_node_name={this.state.tmp_train_node_name}
                                                tmp_eval_node_name={this.state.tmp_eval_node_name} />
                    </TabPanel>
                    <TabPanel>
                        <NN_InfoNewCompDetail1 ref="netDetail2" tabIndex={this.state.tabIndex} 
                                                train_node_name={this.state.train_node_name}
                                                eval_node_name={this.state.eval_node_name}
                                                tmp_train_node_name={this.state.tmp_train_node_name}
                                                tmp_eval_node_name={this.state.tmp_eval_node_name} />
                    </TabPanel> 
                    <TabPanel>
                        <NN_InfoNewCompDetail1 ref="netDetail3" tabIndex={this.state.tabIndex} 
                                                train_node_name={this.state.train_node_name}
                                                eval_node_name={this.state.eval_node_name}
                                                tmp_train_node_name={this.state.tmp_train_node_name}
                                                tmp_eval_node_name={this.state.tmp_eval_node_name} />
                    </TabPanel>
                    </Tabs>



                    
                </div>

            </section>

        );
    }
}

NN_InfoNewComponent.defaultProps = {
    reportRepository: new ReportRepository(new Api())
};




