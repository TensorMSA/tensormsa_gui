import React from 'react';
import Api from './../utils/Api'
import Modal from 'react-modal';
import ReportRepository from './../repositories/ReportRepository'
import FileUploadComponent from './../NNLayout/common/FileUploadComponent'
import JsonConfComponent from './../NNLayout/common/JsonConfComponent'
import NN_InfoNewCompDetail1 from './../NNConfiguration/NN_InfoNewCompDetail1'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.scss';

export default class NN_InfoApplicationList extends React.Component {
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
        
        // Make NN Info
        let inDefault = ["", "biz_cate","biz_sub_cate","nn_title","nn_desc"]
        let dparam = {}
        for (let i=1 ; i < table.rows.length ; i++) {
            title = table.rows[i].cells[this.findColInfo(col, "id", "title").index].innerText
            input_data = table.rows[i].cells[this.findColInfo(col, "id", "input_data").index].children[0].value
            dparam[inDefault[i]] = input_data
        }


        // Make NN Info
        this.props.reportRepository.putBotSetupInfo("", dparam).then((nn_id) => {
            dparam["use_flag"] = "Y"

            console.log(dparam)
        });

    }

    render() {
        let k = 1
        /////////////////////////////////////////////////////////////////////////////////////////
        // First Network Default
        /////////////////////////////////////////////////////////////////////////////////////////
        let nnInfoDefault = [];
        if (this.state.NN_TableMaster == null){
            this.state.NN_TableMaster = [   
                                            {title:"Chatbot ID" , width:10 , input_data:"cb0002", ex:"ex) chatbot id"}
                                            ,{title:"Chatbot Category" , width:10 , input_data:"service", ex:"ex) Category"}
                                            ,{title:"Chatbot SubCategory" , width:10 , input_data:"info_bot", ex:"ex) Sub"}
                                            ,{title:"Tagging Type" , width:10  , input_data:"dict", ex:"ex) Tagging Info"}
                                            ,{title:"Proper Noun" , width:10 , input_data:"{'tagdate': [1, '/hoya_model_root/chatbot/date.txt', False]}", ex:"ex) Proper Noun"}
                                            ,{title:"Intent Model" , width:10 , input_data:"", ex:"ex) Intent Model Name"}
                                            ,{title:"NER Model" , width:10 , input_data:"", ex:"ex) NER Model Name"}
                                            ,{title:"Intent ID" , width:10 , input_data:"1", ex:"ex) Intent"}
                                            ,{title:"entity_type" , width:10 , input_data:"key", ex:""}
                                            ,{title:"entity_list" , width:10 , input_data:"{'key': ['tagdate', 'tagloc', 'tagmenu']}", ex:"JSON Format"}
                                            ,{title:"Story ID" , width:10 , input_data:"1", ex:"ex) 1,2,3,4,5"}
                                            ,{title:"Story Type" , width:10 , input_data:"response", ex:"ex) response / default"}
                                            ,{title:"Entity Type" , width:10 ,input_data:"", ex:"ex) "}
                                            ,{title:"Response Type" , width:10 , input_data:"entity", ex:"ex) entity / default"}
                                            ,{title:"Output Entity" , width:10 , input_data:"{'entity':['tagdate','tagloc','tagmenu']}", ex:"ex) "}
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
                    <div><img src="./images/chatbot_ico.png" width="128" height="128"></img></div>
                    <div className="tblBtnArea">
                        <button type="button" className="save" onClick={() => this.saveData()} >Save</button>
                    </div>

                    <div>
                        <h1> Bot Framework </h1>
                    </div>


                    <div ref="masterInfo">
                        <table className="table detail" ref= 'master1' >
                            {masterListTable}
                        </table>
                    </div>
                </div>
            </section>

        );
    }
}

NN_InfoApplicationList.defaultProps = {
    reportRepository: new ReportRepository(new Api())
};




